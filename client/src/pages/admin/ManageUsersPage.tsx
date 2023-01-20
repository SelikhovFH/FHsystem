import {Button, Card, Checkbox, Form, Input, Layout, theme, Typography} from "antd";
import {FC} from "react";
import {useAuth0} from "@auth0/auth0-react";
import {useQuery} from "react-query";
import {API} from "../../services/api";

const {Header, Content} = Layout;
const {Title} = Typography

export const ManageUsersPage: FC = (props) => {
    const {getAccessTokenSilently} = useAuth0()
    const query = useQuery("users", async () => {
        const token = await getAccessTokenSilently({scope: 'admin:admin'})
        return API.get(`/users?page=${0}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    })
    console.log(query)

    const {
        token: {colorBgContainer},
    } = theme.useToken()
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    return (
        <>
            <Header style={{background: colorBgContainer, display: "flex", alignItems: "center"}}>
                <Title style={{margin: 0}} level={4}>
                    Manage users
                </Title>
            </Header>
            <Content style={{margin: 32}}>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Form
                        name="registerUser"
                        layout={"inline"}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="User email"
                            name="email"
                        >
                            <Input style={{minWidth: 250}}/>
                        </Form.Item>

                        <Form.Item name="isAdmin" valuePropName="isAdmin">
                            <Checkbox>Is Admin</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Content>
        </>
    )
}
