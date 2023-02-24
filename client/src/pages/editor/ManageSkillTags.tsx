import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, Form, Input, Layout, Modal, Select, Space, Table, Tag } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import { SkillTag, SkillTagColor } from "../../shared/skillTag.interface";
import { renderColorCell } from "../../components/table/RenderColorCell";

const { Content } = Layout;

const schema = yup.object().shape({
  name: yup.string().required(),
  color: yup.string().required()
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
    <Form.Item rules={[getYupRule(schema)]} label="Color"
               name="color">
      <Select>
        {Object.values(SkillTagColor).map(v => <Select.Option key={v} value={v} label={v}>
          <Tag color={v}>{v}</Tag>
        </Select.Option>)}

      </Select>
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const ManageSkillTagsPage: FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [skillTagToEdit, setSkillTagToEdit] = useState<SkillTag | null>(null);

  const {
    data: skillTags,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<SkillTag[], SkillTag>({
    basePath: "/skill_tags",
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setSkillTagToEdit(null);
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
    setSkillTagToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate(values);
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: skillTagToEdit?._id, ...values });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: SkillTag) => {
    setSkillTagToEdit(item);
    setIsOpen(true);
  };

  const columns: ColumnsType<SkillTag> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: renderColorCell
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

      <Modal destroyOnClose footer={[]} title={"Update skill tag"} open={isOpen && !!skillTagToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={skillTagToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit skill tag"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add skill tag"} open={isOpen && !skillTagToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new skill tag"} />
      </Modal>


      <AppHeader title={"Manage skill tags"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            skillTags.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Button onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
            Add skill tag
          </Button>
        </Card>
        <Gutter size={2} />
        <Table loading={skillTags.isLoading} dataSource={skillTags.data} columns={columns} />
      </Content>
    </>
  );
};
