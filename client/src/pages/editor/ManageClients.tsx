import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, DatePicker, Form, Input, Layout, Modal, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import { Client } from "../../shared/client.interface";
import dayjs from "dayjs";
import { renderClientCell } from "../../components/table/RenderClientCell";
import { renderDateCell } from "../../components/table/RenderDateCell";
import { URL_REGEX } from "../../utils/regex";

const { Content } = Layout;

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  website: yup.string().matches(URL_REGEX, "value should be valid url"),
  additionalContacts: yup.string(),
  workStartDate: yup.string().required()
});


const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  return <Form className={styles.form} initialValues={initialValues} form={form} name="project"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Name"
               name="name">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Email"
               name="email">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Website"
               name="website">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Additional contacts"
               name="additionalContacts">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Work start date"
               name="workStartDate">
      <DatePicker />
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const ManageClientsPage: FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const {
    data: clients,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<Client[], Client>({
    basePath: "/clients",
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setClientToEdit(null);
      }
    }
  });

  const showAddModal = () => {
    setIsOpen(true);
  };

  const handleAddCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleEditCancel = () => {
    setClientToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate({ ...values, workStartDate: values.workStartDate.toISOString() });
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: clientToEdit?._id, ...values, workStartDate: values.workStartDate.toISOString() });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: Client) => {
    // @ts-ignore
    setClientToEdit({ ...item, workStartDate: dayjs(item.workStartDate) });
    setIsOpen(true);
  };

  const columns: ColumnsType<Client> = [
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (_, record) => {
        return renderClientCell(record);
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "name"
    },
    {
      title: "Additional contacts",
      dataIndex: "additionalContacts",
      key: "additionalContacts"
    },
    {
      title: "Work start date",
      dataIndex: "workStartDate",
      key: "workStartDate",
      render: renderDateCell
    },
    {
      title: "Operations",
      dataIndex: "operations",
      key: "operations",
      render: (_, record) => {
        return <Space>
          <Button onClick={() => onEditClick(record)} type={"primary"} icon={<EditOutlined />}>
          </Button>
          <Button disabled={deleteMutation.isLoading} onClick={() => onDelete(record)} danger
                  type={"primary"}
                  icon={<DeleteOutlined />}>
          </Button>

        </Space>;
      },
      fixed: "right"
    }
  ];

  return (
    <>
      {messageContext}

      <Modal destroyOnClose footer={[]} title={"Update client"} open={isOpen && !!clientToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={clientToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit client"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add client"} open={isOpen && !clientToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new client"} />
      </Modal>


      <AppHeader title={"Manage clients"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            clients.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Button onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
            Add client
          </Button>
        </Card>
        <Gutter size={2} />
        <Table loading={clients.isLoading} dataSource={clients.data} columns={columns} />
      </Content>
    </>
  );
};
