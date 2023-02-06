import React from "react";
import {FormInstance} from "antd/es/form/hooks/useForm";

export type ChildrenProp = {
    children?: React.ReactNode
};

export type FormProps = {
    form: FormInstance
    onFinish: (values: any) => void
    buttonDisabled: boolean
    buttonText: string
    initialValues?: any
}
