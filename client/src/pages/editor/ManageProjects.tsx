import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, DatePicker, Form, Input, Layout, Modal, Select, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import { Project, ProjectStatus, ProjectWorker } from "../../shared/project.interface";
import { Client } from "../../shared/client.interface";
import dayjs from "dayjs";
import { UserSelect } from "../../components/form/UserSelect";
import { ClientSelect } from "../../components/form/ClientSelect";
import { renderClientCell } from "../../components/table/RenderClientCell";
import { renderMultipleUsersCell, renderUserCell } from "../../components/table/RenderUserCell";
import { renderDateCell } from "../../components/table/RenderDateCell";
import { renderProjectStatus } from "../../sections/project";
import { WorkersInput } from "../../components/form/WorkersInput";
import { User } from "../../shared/user.interface";

const { Content } = Layout;

const schema = yup.object().shape({
  name: yup.string().required(),
  startDate: yup.string().required(),
  manager: yup.string().required(),
  workers: yup.array().required(),
  client: yup.string().required(),
  status: yup.string().required()
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
    <Form.Item rules={[getYupRule(schema)]} label="Status"
               name="status">
      <Select
        options={Object.values(ProjectStatus).map(v => ({ value: v, label: v }))}
      />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Start date"
               name="startDate">
      <DatePicker />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Client"
               name="client">
      <ClientSelect />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Project manager"
               name="manager">
      <UserSelect />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Project workers"
               name="workers">
      <WorkersInput />
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
    console.log(values);
    addMutation.mutate({ ...values, startDate: values.startDate.toISOString() });
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: projectToEdit?._id, ...values, startDate: values.startDate.toISOString() });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: Project) => {

    setProjectToEdit({
      ...item,
      // @ts-ignore
      startDate: dayjs(item.startDate),
      // @ts-ignore
      manager: item.manager._id,
      // @ts-ignore
      client: item.client._id,
      // @ts-ignore
      workers: item.workers.map(w => ({
        ...w, titles: w.titles.map(t => ({
          ...t,
          startDate: dayjs(t.startDate),
          finishDate: dayjs(t.finishDate)
        }))
      }))
    });
    setIsOpen(true);
  };

  const columns: ColumnsType<Project> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderProjectStatus
    },
    {
      title: "Start date",
      dataIndex: "startDate",
      key: "startDate",
      render: renderDateCell
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: renderClientCell
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      render: renderUserCell
    },
    {
      title: "Workers",
      dataIndex: "workers",
      key: "workers",
      render: (workers: ProjectWorker[]) => renderMultipleUsersCell(workers.map(w => w.user as User))
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

      {isOpen && !!projectToEdit && <Modal footer={[]} title={"Update project"} open={true}
                                           onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={projectToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit project"} />
      </Modal>}
      {isOpen && !projectToEdit && <Modal footer={[]} title={"Add project"} open={true}
                                          onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new project"} />
      </Modal>}


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
