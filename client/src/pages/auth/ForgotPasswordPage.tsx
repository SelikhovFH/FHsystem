import {FC} from "react";
import {MailOutlined} from '@ant-design/icons';
import {Button, Form, Input, Typography} from 'antd';
import {Gutter} from "../../components/Gutter";
import * as yup from 'yup';
import {Rule} from "rc-field-form/lib/interface";

const {Title} = Typography;


type Props = {}


let schema = yup.object().shape({
    email: yup.string().required().email(),
});

const yupSync: Rule = {
    //@ts-ignore
    async validator({field}, value) {
        await schema.validateSyncAt(field, {[field]: value});
    },
};

export const ForgotPasswordPage: FC<Props> = (props) => {
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (

        <Form
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
            <Title level={2}>Reset password</Title>
            <Gutter size={2}/>
            <Form.Item
                name="email"
                rules={[yupSync]}
            >
                <Input prefix={<MailOutlined/>} placeholder="Email"/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Reset password
                </Button>
            </Form.Item>
        </Form>

    );
}
