import {FC} from "react";
import {
    Alert,
    Badge,
    BadgeProps,
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

const {Header, Content} = Layout;
const {Title, Paragraph} = Typography
const {RangePicker} = DatePicker;

const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            listData = [
                {type: 'success', content: 'Vacation approved'},
            ];
            break;

        default:
    }
    return listData || [];
};

const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
        <div style={listData.length ? {background: "green", height: "100%"} : {}} className="events">
            {listData.map((item) => (
                <Badge status={item.type as BadgeProps['status']} text={item.content}/>
            ))}
        </div>
    );
};

export const BookDayOffPage: FC = (props) => {
    const {token: {colorBgContainer}} = theme.useToken()
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log(values)
        // mutation.mutate(values)
    };
    return (
        <>
            <Header style={{background: colorBgContainer, display: "flex", alignItems: "center"}}>
                <Title style={{margin: 0}} level={4}>
                    Book day off
                </Title>
            </Header>
            <Content style={{margin: 32}}>
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic title="Vacation usage (yearly)" value={12} suffix="/ 24"/>
                        </Col>
                        <Col span={8}>
                            <Statistic title="Sick leave usage (yearly)" value={5} suffix="/ 10"/>
                        </Col>
                        <Col span={8}>
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
                        <Form.Item name="type" label="Day off type">
                            <Radio.Group>
                                <Radio value={'vacation'}>Vacation</Radio>
                                <Radio value={'sickLeave'}>Sick leave</Radio>
                                <Radio value={'unpaid'}>Unpaid day off</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="dates" label="Dates">
                            <RangePicker/>
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
