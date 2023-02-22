import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, Form, Input, Layout, Modal, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import { Project } from "../../shared/project.interface";

const { Content } = Layout;

const schema = yup.object().shape({
  name: yup.string().required()
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
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const ManageProjectsPage: FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const {
    data: items,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<Project[], Project>({
    basePath: "/projects",
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setProjectToEdit(null);
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
    setProjectToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate(values);
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: projectToEdit?._id, ...values });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: Project) => {
    setProjectToEdit(item);
    setIsOpen(true);
  };

  const columns: ColumnsType<Project> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
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

      <Modal destroyOnClose footer={[]} title={"Update project"} open={isOpen && !!projectToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={projectToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit project"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add project"} open={isOpen && !projectToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new project"} />
      </Modal>


      <AppHeader title={"Manage projects"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            items.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Button onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
            Add project
          </Button>
        </Card>
        <Gutter size={2} />
        <Table loading={items.isLoading} dataSource={items.data} columns={columns} />
      </Content>
    </>
  );
};
