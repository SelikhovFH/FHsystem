import { FC, useEffect } from "react";
import { FormProps } from "../../utils/types";
import { Button, DatePicker, Form, Input } from "antd";
import styles from "../../pages/editor/FormStyles.module.css";
import { getYupRule } from "../../utils/yupRule";
import * as yup from "yup";

const updateSchema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    phone: yup.string().required(),
    emergencyContact: yup.string(),
    location: yup.string().required(),
    birthDate: yup.string().required()
});

export const UpdateMyProfileForm: FC<Omit<FormProps, "buttonText">> = ({
                                                                           form,
                                                                           onFinish,
                                                                           buttonDisabled,
                                                                           initialValues
                                                                       }) => {
    useEffect(() => {
        form.resetFields();
    }, [initialValues]);
    return <Form className={styles.form} form={form} name="updateMyProfile"
                 initialValues={initialValues}
                 layout={"vertical"}
                 onFinish={onFinish}
                 autoComplete="off">
        <Form.Item rules={[getYupRule(updateSchema)]} label="Name"
                   name="name">
            <Input />
        </Form.Item>
        <Form.Item rules={[getYupRule(updateSchema)]} label="Surname"
                   name="surname">
            <Input />
        </Form.Item>

        <Form.Item rules={[getYupRule(updateSchema)]} label="Birth date"
                   name="birthDate">
            <DatePicker />
        </Form.Item>
        <Form.Item rules={[getYupRule(updateSchema)]} label="Phone"
                   name="phone">
            <Input />
        </Form.Item>
        <Form.Item rules={[getYupRule(updateSchema)]} label="Emergency contact"
                   name="emergencyContact">
            <Input />
        </Form.Item>
        <Form.Item rules={[getYupRule(updateSchema)]} label="Location (time zone)"
                   name="location">
            <Input />
        </Form.Item>
        <Form.Item>
            <Button disabled={buttonDisabled} type="primary" htmlType="submit">
                Update my profile
            </Button>
        </Form.Item>
    </Form>;
};
