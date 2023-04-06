import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { Gutter } from "../../components/Gutter";
import { Button, Form, Input, InputNumber, Layout, Select, Tabs, TabsProps } from "antd";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { FormProps } from "../../utils/types";
import { ItemSize } from "../../shared/item.interface";
import { SettingsModules } from "../../shared/settings/settingsModules.enum";

const { Content } = Layout;

const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    quantity: yup.number().min(0).required(),
    size: yup.string()
});


const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {

    useEffect(() => {
        form.resetFields();
    }, [initialValues]);

    return <Form className={styles.form} initialValues={initialValues} form={form} name="item"
                 layout={"vertical"}
                 onFinish={onFinish}
                 autoComplete="off">
        <Form.Item rules={[getYupRule(schema)]} label="Name"
                   name="name">
            <Input />
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Description"
                   name="description">
            <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Quantity"
                   name="quantity">
            <InputNumber min={0} />
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Size"
                   name="size">
            <Select
              options={Object.values(ItemSize).map(v => ({ value: v, label: v }))}
            />
        </Form.Item>
        <Form.Item>
            <Button disabled={buttonDisabled} type="primary" htmlType="submit">
                {buttonText}
            </Button>
        </Form.Item>
    </Form>;
};

export const SettingsPage: FC = () => {

    const [selectedModule, setSelectedModule] = useState<string>(SettingsModules.OneToOne);

    const items: TabsProps["items"] = [
        {
            key: SettingsModules.OneToOne,
            label: `One to one`,
            children: `Content of Tab Pane 1`
        }
    ];


    return (
      <>

          <AppHeader title={"Manage items"} />
          <Content style={{ margin: 32 }}>
              {/*<ErrorsBlock*/}
              {/*    errors={[*/}
              {/*        items.error as AxiosError,*/}
              {/*        addMutation.error as AxiosError,*/}
              {/*        editMutation.error as AxiosError,*/}
              {/*        deleteMutation.error as AxiosError*/}
              {/*    ]}/>*/}
              <Gutter size={2} />
              <Tabs items={items} accessKey={selectedModule} onChange={(v) => setSelectedModule(v)} />
          </Content>
      </>
    );
};
