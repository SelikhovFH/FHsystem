import { FC, useEffect, useState } from "react";
import { AppHeader } from "../layouts/Header";
import { ErrorsBlock } from "../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../components/Gutter";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Layout,
  List,
  Modal,
  Row,
  Statistic,
  Switch,
  Typography
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../utils/yupRule";
import styles from "./FormStyles.module.css";
import { FormProps } from "../utils/types";
import { useApiFactory } from "../services/apiFactory";
import { ProjectSelect } from "../components/form/ProjectSelect";
import dayjs, { Dayjs } from "dayjs";
import { CreateTrackPrefill, TimeTrack, TimeTrackResponse } from "../shared/timeTrack.interface";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../services/api";
import { Link } from "react-router-dom";
import { AppRoutes } from "../router/AppRoutes";
import { queryClient } from "../services/queryClient";
import { formatBoolean, formatDate, formatMonth } from "../utils/formatters";

const { Content } = Layout;
const { Title } = Typography;

const schema = yup.object().shape({
  projectId: yup.string().required(),
  date: yup.string().required(),
  isMonthTrack: yup.boolean(),
  hours: yup.number().min(1).max(300).required(),
  comment: yup.string()
});


const AddOrUpdateForm: FC<FormProps & { isEditForm?: boolean }> = ({
                                                                     form,
                                                                     onFinish,
                                                                     buttonDisabled,
                                                                     buttonText,
                                                                     initialValues,
                                                                     isEditForm
                                                                   }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);

  return <Form className={styles.form} initialValues={initialValues} form={form} name="timeTrack"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Alert description={<>
      You can track time in 2 ways:
      <br />
      1. Track time every day
      <br />
      2. Select "Is month track" and track time in the end of the month
    </>} message="Tip" type="info" />
    <Form.Item valuePropName="checked" rules={[getYupRule(schema)]} label="Is month track"
               name="isMonthTrack">
      <Switch />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Project"
               name="projectId">
      <ProjectSelect />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Date"
               name="date">
      <DatePicker defaultValue={dayjs()} disabledDate={(date: Dayjs) => {
        if (date.toDate() > new Date()) {
          return true;
        }
        if (date.toDate() < dayjs().subtract(1, "month").toDate()) {
          return true;
        }
        return false;
      }
      } />
    </Form.Item>
    {!isEditForm && form.getFieldValue("isMonthTrack") === true &&
      <Alert message="Note that hours are calculated for current month by formula (hours to be tracked - tracked hours)"
             type="info" />}
    <Form.Item rules={[getYupRule(schema)]} label={"Hours"}
               name="hours">
      <InputNumber min={1} max={300} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Comment"
               name="comment">
      <Input.TextArea rows={4} />
    </Form.Item>

    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const TimeTrackPage: FC = () => {


  const [isOpen, setIsOpen] = useState(false);
  const [timeTrackToEdit, setTimeTrackToEdit] = useState<TimeTrack | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const {
    data: tracks,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<TimeTrackResponse[], TimeTrack>({
    basePath: "/time_tracks/my",
    get: {
      queryKeys: ["/time_tracks/my", selectedMonth],
      fetcher: async (config) => {
        const params = new URLSearchParams({
          date: selectedMonth.toISOString()
        });
        const res = await API.get(`/time_tracks/my?${params.toString()}`, config);
        return res.data.data as TimeTrackResponse[];
      }
    },
    add: {
      onSuccess: () => {
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: ["/time_tracks/my/prefill"] });
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setTimeTrackToEdit(null);
        queryClient.invalidateQueries({ queryKey: ["/time_tracks/my/prefill"] });
      }
    },
    remove: {
      onSuccess: () => {
        setIsOpen(false);
        setTimeTrackToEdit(null);
        queryClient.invalidateQueries({ queryKey: ["/time_tracks/my/prefill"] });
      }
    }
  });
  const { getAccessTokenSilently } = useAuth0();
  const {
    data: createTrackPrefill,
    isLoading
  } = useQuery<CreateTrackPrefill>(["/time_tracks/my/prefill"], async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/time_tracks/my/prefill`, getRequestConfig(token));
    return res.data.data;
  });

  const isMonthTrack = Form.useWatch("isMonthTrack", form);
  useEffect(() => {
    if (!createTrackPrefill) {
      return;
    }
    if (timeTrackToEdit) {
      return;
    }
    if (isMonthTrack) {
      form.setFieldValue("comment", createTrackPrefill.comment);
      form.setFieldValue("hours", Math.max(0, createTrackPrefill.totalUserHours - createTrackPrefill.trackedHours));
    } else {
      form.resetFields(["comment", "hours"]);
    }

  }, [isMonthTrack]);

  const showAddModal = () => {
    setIsOpen(true);
  };

  const handleAddCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleEditCancel = () => {
    setTimeTrackToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate(values);
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: timeTrackToEdit?._id, ...values });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: TimeTrack) => {
    // @ts-ignore
    setTimeTrackToEdit({ ...item, date: dayjs(item.date) });
    setIsOpen(true);
  };

  return (
    <>
      {messageContext}

      <Modal destroyOnClose footer={[]} title={"Update time track"} open={isOpen && !!timeTrackToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={timeTrackToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          isEditForm
          buttonText={"Edit time track"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add time track"} open={isOpen && !timeTrackToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new time track"} />
      </Modal>


      <AppHeader title={"Track your working time"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            tracks.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic title="Hours tracked / must be time-tracked" value={createTrackPrefill?.trackedHours}
                         suffix={`/ ${createTrackPrefill?.totalUserHours}`} loading={isLoading} />
              <Button style={{ marginTop: 16 }} onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
                Track time
              </Button>
            </Col>
            <Col span={6}>
              <Statistic title="Working days in this months (excluding holidays and days off)"
                         value={createTrackPrefill?.workingDays} loading={isLoading} />
            </Col>
            <Col span={6}>
              <Statistic title="Holidays & celebrations with day off in this month"
                         value={createTrackPrefill?.eventsDays}
                         loading={isLoading} />
            </Col>
            <Col span={6}>
              <Statistic title="Booked days off this month" value={createTrackPrefill?.dayOffDays}
                         loading={isLoading} />
              <Link to={AppRoutes.bookDayOff}>
                <Button style={{ marginTop: 16 }} type="default">
                  Book day off
                </Button>
              </Link>

            </Col>
          </Row>
        </Card>
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <DatePicker allowClear={false} value={selectedMonth} onChange={v => setSelectedMonth(v!)} picker="month" />
          <List
            style={{ background: "white" }}
            loading={tracks.isLoading || deleteMutation.isLoading || editMutation.isLoading}
            itemLayout="horizontal"
            dataSource={tracks.data ?? []}
            header={<Title level={5}>Your time tracks in {formatMonth(selectedMonth)}</Title>}
            renderItem={(track: TimeTrackResponse) => (
              <List.Item
                actions={[<Button
                  onClick={() => onEditClick(track)}
                  type="link">Edit</Button>,
                  <Button onClick={() => onDelete(track)}
                          type="link" danger>Delete</Button>]}
              >
                <List.Item.Meta
                  title={`${formatDate(track.date)}`}
                  description={
                    <Descriptions size={"small"} column={1}>
                      <Descriptions.Item label="Hours">{track.hours}</Descriptions.Item>
                      <Descriptions.Item label="Is month track">{formatBoolean(track.isMonthTrack)}</Descriptions.Item>
                      <Descriptions.Item label="Project">{track.project.name}</Descriptions.Item>
                      {track.comment && <Descriptions.Item label="Comment">{track.comment}</Descriptions.Item>}
                    </Descriptions>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

      </Content>
    </>
  );
};
