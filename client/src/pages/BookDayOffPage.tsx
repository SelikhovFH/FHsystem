import {FC} from "react";
import {
    Alert,
    Button,
    Calendar,
    Card,
    Col,
    DatePicker,
    Form,
    Layout,
    Radio,
    Row,
    Statistic,
    theme,
    Typography
} from "antd";
import {Gutter} from "../components/Gutter";
import type {Dayjs} from 'dayjs';
import dayjs from 'dayjs';
import {useMutation, useQuery} from "react-query";
import {API, getRequestConfig} from "../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {queryClient} from "../services/queryClient";
import {ErrorsBlock} from "../components/ErrorsBlock";
import {AxiosError} from "axios";
import {useRequestMessages} from "../hooks/useRequestMessages";
import * as yup from "yup";
import {getYupRule} from "../utils/yupRule";
import {DayOff, DayOffStatus, DayOffType} from "../interfaces/dayOff.interface";


const {Header, Content} = Layout;
const {Title, Text} = Typography
const {RangePicker} = DatePicker;

const schema = yup.object().shape({
    type: yup.string().required(),
    dates: yup.array().of(yup.string()).required()
});

const StatusLabels: Record<DayOffStatus, string> = {
    approved: "Approved",
    declined: "Declined",
    pending: "Pending"
}

const TypeLabels: Record<DayOffType, string> = {
    vacation: "Vacation",
    sickLeave: "Sick leave",
    dayOff: "Day off",
    unpaid: "Unpaid day off",
}

export const BookDayOffPage: FC = (props) => {
    const {token} = theme.useToken()
    const [form] = Form.useForm();
    const {getAccessTokenSilently} = useAuth0()
    const requestMessages = useRequestMessages('BOOK_DAY_OFF')
    const myDaysOff = useQuery<DayOff[]>("days_off", async () => {
        const token = await getAccessTokenSilently()
        const res = await API.get(`/days_off/my`, getRequestConfig(token))
        return res.data.data
    })
    const mutation = useMutation(async (newDayOff) => {
        const token = await getAccessTokenSilently()
        requestMessages.onLoad()
        const res = await API.post('/days_off', newDayOff, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            form.resetFields();
            await queryClient.invalidateQueries({queryKey: ['days_off']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const dateCellRender = (value: Dayjs) => {
        const dayOffForDate = myDaysOff.data?.find(d => {
            return dayjs(value).isBetween(d.startDate, d.finishDate, 'day', '[]')
        })

        if (!dayOffForDate) {
            return null
        }
        const {status, type} = dayOffForDate
        const getColorForStatus = () => {
            switch (status) {
                case DayOffStatus.pending:
                    return token.colorInfoBg
                case DayOffStatus.approved:
                    return token.colorSuccessBg
                case DayOffStatus.declined:
                    return token.colorErrorBg
            }
        }

        return (
            <div style={{
                background: getColorForStatus(),
                height: "100%",
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <Text>{TypeLabels[type]}</Text>
                <Text italic>{StatusLabels[status]}</Text>
            </div>
        );
    };

    const onFinish = (values: { type: DayOffType, dates: [Dayjs, Dayjs] }) => {
        const startDate = values.dates[0].set('hour', 0).set('minute', 0).set('second', 0).toISOString()
        const finishDate = values.dates[0].set('hour', 23).set('minute', 59).set('second', 59).toISOString()

        const data: any = {
            type: values.type,
            startDate,
            finishDate,
        }
        mutation.mutate(data)
    };
    return (
        <>
            {requestMessages.contextHolder}
            <Header style={{background: token.colorBgContainer, display: "flex", alignItems: "center"}}>
                <Title style={{margin: 0}} level={4}>
                    Book day off
                </Title>
            </Header>
            <Content style={{margin: 32}}>
                <ErrorsBlock errors={[myDaysOff.error as AxiosError, mutation.error as AxiosError]}/>
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Statistic title="Vacation usage (yearly)" value={12} suffix="/ 15"/>
                        </Col>
                        <Col span={6}>
                            <Statistic title="Sick leave usage (yearly)" value={5} suffix="/ 7"/>
                        </Col>
                        <Col span={6}>
                            <Statistic title="Day off usage (yearly)" value={3} suffix="/ 5"/>
                        </Col>
                        <Col span={6}>
                            <Statistic title="Unpaid day off usage (yearly)" value={0}/>
                        </Col>
                    </Row>
                </Card>
                <Gutter size={2}/>
                <Alert message="Booked days off should be approved by admins" type="info"/>
                <Gutter size={2}/>
                <Card title="Book" bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
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
                        <Form.Item name="dates" label="Dates" rules={[getYupRule(schema)]}>
                            <RangePicker disabledDate={current => current && current.valueOf() < Date.now()}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Book
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Gutter size={2}/>
                <Card title="Overview" bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Calendar dateCellRender={dateCellRender}/>
                </Card>
            </Content>
        </>
    )
}
