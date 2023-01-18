import {FC} from "react";
import {LockOutlined} from '@ant-design/icons';
import {Button, Form, Input, Typography} from 'antd';
import * as yup from 'yup';
import {Rule} from "rc-field-form/lib/interface";

const {Title} = Typography;


type Props = {}


let schema = yup.object().shape({
    password: yup.string().required(),
});

const yupSync: Rule = {
    //@ts-ignore
    async validator({field, ...rest}, value,) {
        console.log(rest, value)
        await schema.validateSyncAt(field, {[field]: value});
    },
};

export const NewPasswordPage: FC<Props> = (props) => {
    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (

        <Form
            initialValues={{remember: true}}
            onFinish={onFinish}
        >
            <Title level={2}>Set new password</Title>
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
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Set new password
                </Button>
            </Form.Item>
        </Form>

    );
}
