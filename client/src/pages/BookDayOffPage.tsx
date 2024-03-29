import { FC } from "react";
import { Alert, Button, Card, Col, DatePicker, Form, Layout, Radio, Row, Statistic } from "antd";
import { Gutter } from "../components/Gutter";
import type { Dayjs } from "dayjs";
import { useMutation, useQuery } from "react-query";
import { API, getRequestConfig } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { queryClient } from "../services/queryClient";
import { ErrorsBlock } from "../components/ErrorsBlock";
import { AxiosError } from "axios";
import { useRequestMessages } from "../hooks/useRequestMessages";
import * as yup from "yup";
import { getYupRule } from "../utils/yupRule";
import { DayOff, DayOffType } from "../shared/dayOff.interface";
import { Rule } from "rc-field-form/lib/interface";
import {
  getDayOffBusinessDaysWithCalendarEvents,
  getWorkingDays,
  YearlyLimitsForDaysOffTypes
} from "../shared/dayOff.helpers";
import { AppHeader } from "../layouts/Header";
import { TypeLabels } from "../sections/dayOff";
import { CalendarEvent } from "../shared/calendarEvent.interface";
import { AppCalendar } from "../components/calendar/AppCalendar";


const { Content } = Layout;
const { RangePicker } = DatePicker;

const schema = yup.object().shape({
  type: yup.string().required(),
  dates: yup.array().of(yup.string()).required()
});

export const BookDayOffPage: FC = (props) => {
  const [form] = Form.useForm();
  const { getAccessTokenSilently } = useAuth0();
  const requestMessages = useRequestMessages("BOOK_DAY_OFF");
  const dayOffType = Form.useWatch("type", form) as DayOffType;
  const myDaysOff = useQuery<DayOff[]>("/days_off/my", async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/days_off/my`, getRequestConfig(token));
    return res.data.data;
  });
  const {
    data: usage,
    error: usageError,
    isLoading: usageLoading
  } = useQuery<Record<DayOffType, { used: number; limit: number }>>("/days_off/my/usage", async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/days_off/my/usage`, getRequestConfig(token));
    return res.data.data;
  });
  const calendarEvents = useQuery<CalendarEvent[]>("/calendar_events", async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/calendar_events`, getRequestConfig(token));
    return res.data.data;
  });
  const mutation = useMutation(async (newDayOff) => {
    const token = await getAccessTokenSilently();
    requestMessages.onLoad();
    const res = await API.post("/days_off/my", newDayOff, getRequestConfig(token));
    return res.data.data;
  }, {
    onSuccess: async () => {
      requestMessages.onSuccess();
      form.resetFields();
      await Promise.all([queryClient.invalidateQueries({ queryKey: ["/days_off/my"] }),
        queryClient.invalidateQueries({ queryKey: ["/days_off/my/usage"] })]);
    },
    onError: async () => {
      requestMessages.onError();
    }
  });

  const onFinish = (values: { type: DayOffType, dates: [Dayjs, Dayjs] }) => {
    const startDate = values.dates[0].toISOString();
    const finishDate = values.dates[1].toISOString();
    const data: any = {
      type: values.type,
      startDate,
      finishDate
    };
    mutation.mutate(data);
  };

  const dateValidationLimitRule: Rule = {
    message: "Your limit is not sufficient to cover new day off. Your request may be rejected by the admin",
    validator: (_, value: [Dayjs, Dayjs]) => {
      //Validation logic is same with backend but has slightly different implementation
      const currentLimit = YearlyLimitsForDaysOffTypes[dayOffType]();
      const limitUsed = usage?.[dayOffType].used ?? 0;
      const limitLeft = currentLimit - limitUsed;
      const newDayOffBusinessDays = getWorkingDays(value[0].toDate(), value[1].toDate());
      const newDayOffBusinessDaysWithHolidays = getDayOffBusinessDaysWithCalendarEvents(calendarEvents.data ?? [],
        { dayCount: newDayOffBusinessDays, startDate: value[0].toISOString(), finishDate: value[1].toISOString() });

      if (limitLeft < newDayOffBusinessDaysWithHolidays) {
        return Promise.reject("Your limit is not sufficient to cover new day off. Your request may be rejected by the admin");
      }
      return Promise.resolve();
    },
    warningOnly: true
  };
  return (
    <>
      {requestMessages.contextHolder}
      <AppHeader title={"Book day off"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            myDaysOff.error as AxiosError,
            mutation.error as AxiosError,
            usageError as AxiosError,
            calendarEvents.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic loading={usageLoading} title={`${TypeLabels.vacation} (monthly / yearly)`}
                         value={usage?.vacation.used}
                         suffix={`/ ${usage?.vacation.limit} / ${+(usage?.vacation.limit || 0) / (new Date().getMonth() + 1) * 12}`} />
            </Col>
            <Col span={6}>
              <Statistic loading={usageLoading} title={`${TypeLabels.sickLeave} limit (yearly)`}
                         value={usage?.sickLeave.used} suffix={`/ ${usage?.sickLeave.limit}`} />
            </Col>
            <Col span={6}>
              <Statistic loading={usageLoading} title={`${TypeLabels.dayOff} limit (yearly)`}
                         value={usage?.dayOff.used}
                         suffix={`/ ${usage?.dayOff.limit}`} />
            </Col>
            <Col span={6}>
              <Statistic loading={usageLoading} title={`${TypeLabels.unpaid} limit (yearly)`}
                         value={usage?.unpaid.used} />
            </Col>
          </Row>
        </Card>
        <Gutter size={2} />
        <Alert message="Booked days off should be approved by admins" type="info" />
        <Gutter size={2} />
        <Card title="Book" bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Form
            form={form}
            name="registerUser"
            layout={"vertical"}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item name="type" label="Day off type" rules={[getYupRule(schema)]}>
              <Radio.Group>
                {Object.values(DayOffType).map(v => (<Radio key={v} value={v}>{TypeLabels[v]}</Radio>))}
              </Radio.Group>
            </Form.Item>
            <Form.Item name="dates" label="Dates"
                       rules={[getYupRule(schema), dateValidationLimitRule]}>
              <RangePicker disabled={!dayOffType}
                           disabledDate={current => current && current.valueOf() < Date.now()} />
            </Form.Item>
            <Form.Item>
              <Button disabled={mutation.isLoading} type="primary" htmlType="submit">
                Book
              </Button>
            </Form.Item>
          </Form>
        </Card>
        <Gutter size={2} />
        <Card title="Overview" bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <AppCalendar events={calendarEvents.data} daysOff={myDaysOff.data} />
        </Card>
      </Content>
    </>
  );
};
