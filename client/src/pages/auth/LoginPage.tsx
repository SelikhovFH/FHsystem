import {FC} from "react";
import {LockOutlined, MailOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Input, Typography} from 'antd';
import {Link} from "react-router-dom";
import {AuthRoutes} from "../../router/AppRoutes";
import {Gutter} from "../../components/Gutter";
import * as yup from 'yup';
import {Rule} from "rc-field-form/lib/interface";

const {Title} = Typography;


type Props = {}


let schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required()
});

const yupSync: Rule = {
    //@ts-ignore
    async validator({field}, value) {
        await schema.validateSyncAt(field, {[field]: value});
    },
};

export const LoginPage: FC<Props> = (props) => {
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (

        <Form
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
            <Title level={2}>Log in FHSystem</Title>
            <Gutter size={2}/>
            <Form.Item
                name="email"
                rules={[yupSync]}
            >
                <Input prefix={<MailOutlined/>} placeholder="Email"/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[yupSync]}
            >
                <Input
                    prefix={<LockOutlined/>}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Gutter size={1}/>
            <Link to={AuthRoutes.forgot_password}>
                Forgot password
            </Link>
            <Gutter size={2}/>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Log in
                </Button>
            </Form.Item>
        </Form>

    );
}
