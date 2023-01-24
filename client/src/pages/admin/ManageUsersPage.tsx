import {Alert, Avatar, Button, Card, Checkbox, Form, Input, Layout, message, Table, theme, Typography} from "antd";
import {FC, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useMutation, useQuery} from "react-query";
import {API} from "../../services/api";
import {Gutter} from "../../components/Gutter";
import {AxiosError} from "axios";
import * as yup from 'yup';
import {getYupRule} from "../../utils/yupRule";
import {queryClient} from "../../services/queryClient";

const {Header, Content} = Layout;
const {Title, Paragraph} = Typography

const columns = [
    {
        title: 'Avatar',
        dataIndex: 'picture',
        key: 'avatar',
        render: (text: string) => <Avatar src={text}/>
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Email verified & password changed',
        dataIndex: 'email_verified',
        key: 'email_verified',
        render: (text: string) => {
            return text ? '✅' : '❌';
        }
    },
    {
        title: 'Admin',
        dataIndex: ['user_metadata', 'is_admin'],
        key: 'admin',
        render: (text: string) => {
            return text ? '✅' : '';
        }
    },
];

const schema = yup.object().shape({
    email: yup.string().required().email(),
    isAdmin: yup.boolean(),
});
const MESSAGE_KEY = 'USER_REGISTER';
const PAGE_SIZE = 20
//TODO CHECK PAGINATION ON BIGGER DATA SET
export const ManageUsersPage: FC = () => {
    const {token: {colorBgContainer}} = theme.useToken()
    const [form] = Form.useForm();
    const {getAccessTokenSilently} = useAuth0()
    const [messageApi, contextHolder] = message.useMessage();
    const [page, setPage] = useState(1)
    const {data, error, isError, isLoading} = useQuery(["users", page], async () => {
        const token = await getAccessTokenSilently({scope: 'admin:admin'})
        const res = await API.get(`/users?page=${page - 1}&per_page=${PAGE_SIZE}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data.data
    }, {keepPreviousData: true})
    const mutation = useMutation(async newUser => {
        const token = await getAccessTokenSilently({scope: 'admin:admin'})
        messageApi.open({
            key: MESSAGE_KEY,
            type: 'loading',
            content: 'Loading...',
        })
        const res = await API.post('/users/register', newUser, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        return res.data.data
    }, {
        onSuccess: async () => {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'success',
                content: 'Loaded!',
                duration: 2,
            });
            form.resetFields();
            await queryClient.invalidateQueries({queryKey: ['users']})
        },
        onError: async () => {
            messageApi.open({
                key: MESSAGE_KEY,
                type: 'error',
                content: 'Error!',
                duration: 2,
            });
        },
    })

    const onFinish = (values: any) => {
        mutation.mutate(values)
    };
    return (
        <>
            {contextHolder}
            <Header style={{background: colorBgContainer, display: "flex", alignItems: "center"}}>
                <Title style={{margin: 0}} level={4}>
                    Manage users
                </Title>
            </Header>
            <Content style={{margin: 32}}>
                {isError && <Alert message={(error as AxiosError).message} type="error"/>}
                {mutation.isError && <Alert message={(mutation.error as AxiosError).message} type="error"/>}
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Form
                        form={form}
                        name="registerUser"
                        layout={"inline"}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="User email"
                            name="email"
                            rules={[getYupRule(schema)]}
                        >
                            <Input style={{minWidth: 250}}/>
                        </Form.Item>

                        <Form.Item name="isAdmin" valuePropName="checked" rules={[getYupRule(schema)]}
                        >
                            <Checkbox>Is Admin</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button disabled={mutation.isLoading} type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                {mutation.data?.ticket &&
                    <Alert style={{marginTop: 16}} type={"info"} message={"Send this link to future user"}
                           description={<Paragraph copyable>{mutation.data?.ticket}</Paragraph>}/>}
                <Gutter size={2}/>
                <Table pagination={{pageSize: PAGE_SIZE, current: page, onChange: (page) => setPage(page)}}
                       loading={isLoading} dataSource={data} columns={columns}/>
            </Content>
        </>
    )
}
