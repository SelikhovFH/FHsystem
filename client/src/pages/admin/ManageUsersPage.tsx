import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from "antd";
import { FC, useEffect, useState } from "react";
import { Gutter } from "../../components/Gutter";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AppHeader } from "../../layouts/Header";
import { SalaryRecord, User, UserRole, UserStatus } from "../../shared/user.interface";
import { capitalize } from "../../utils/strings";
import { useApiFactory } from "../../services/apiFactory";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import styles from "../editor/FormStyles.module.css";
import dayjs from "dayjs";
import { SalaryInput } from "../../components/form/SalaryInput";
import { formatDate, formatMoney } from "../../utils/formatters";
import { renderDateCell } from "../../components/table/RenderDateCell";
import { renderUserCell } from "../../components/table/RenderUserCell";
import { UserRolesLabels, UserStatusLabels } from "../../sections/users";

const { Content } = Layout;
const { Paragraph } = Typography;

const registerSchema = yup.object().shape({
  email: yup.string().required().email(),
  role: yup.string().required(),
  name: yup.string().required(),
  surname: yup.string().required()
});

const updateSchema = registerSchema.shape({
  workStartDate: yup.string().required(),
  birthDate: yup.string().required(),
  phone: yup.string().required(),
  emergencyContact: yup.string(),
  location: yup.string().required(),
  title: yup.string().required(),
  salaryHistory: yup.array().of(yup.object().shape({
    value: yup.number().required(),
    date: yup.string().required()
  })).required(),
  cvLink: yup.string(),
  status: yup.string().required()
});

const RegisterForm: FC<Omit<FormProps, "initialValues" | "buttonText">> = ({ form, onFinish, buttonDisabled }) => {
  useEffect(() => {
    form.resetFields();
  }, []);
  return <Form className={styles.form} form={form} name="registerUser"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(registerSchema)]} label="Name"
               name="name">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(registerSchema)]} label="Surname"
               name="surname">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(registerSchema)]} label="Email"
               name="email">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(registerSchema)]} label="User role"
               name="role">
      <Select
        options={Object.values(UserRole).map(v => ({ value: v, label: UserRolesLabels[v] }))}
      />
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        Register new user
      </Button>
    </Form.Item>
  </Form>;
};

const UpdateForm: FC<Omit<FormProps, "buttonText">> = ({ form, onFinish, buttonDisabled, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  return <Form className={styles.form} form={form} name="updateForm"
               initialValues={initialValues}
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(updateSchema)]} label="Email"
               name="email">
      <Input disabled />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="User role"
               name="role">
      <Select
        disabled
        options={Object.values(UserRole).map(v => ({ value: v, label: UserRolesLabels[v] }))}
      />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="Name"
               name="name">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="Surname"
               name="surname">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="Work start date"
               name="workStartDate">
      <DatePicker />
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
    <Form.Item rules={[getYupRule(updateSchema)]} label="Title"
               name="title">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="Salary"
               name="salaryHistory">
      <SalaryInput />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="CV link"
               name="cvLink">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(updateSchema)]} label="Status"
               name="status">
      <Select
        options={Object.values(UserStatus).map(v => ({ value: v, label: capitalize(v) }))}
      />
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        Update user
      </Button>
    </Form.Item>
  </Form>;
};


export const ManageUsersPage: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const {
    data: users,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<User[], Partial<User>>({
    basePath: "/users",
    add: {
      path: "/users/register",
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setUserToEdit(null);
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
    setUserToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate(values);
  };

  const onEditFinish = (_values: User) => {
    const { auth0id, role, email, ...values } = _values;
    editMutation.mutate({ ...values, _id: userToEdit?._id });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (user: User) => {
    // @ts-ignore
    setUserToEdit({ ...user, workStartDate: dayjs(user.workStartDate), birthDate: dayjs(user.birthDate) });
    setIsOpen(true);
  };

  const columns: ColumnsType<User> = [
    // {
    //     title: 'Email verified & password changed',
    //     dataIndex: 'email_verified',
    //     key: 'email_verified',
    //     render: (text: string) => {
    //         return text ? '✅' : '❌';
    //     }
    // },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (_, record) => {
        return renderUserCell(record);
      },
      fixed: "left"
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole) => {
        return <span style={{ whiteSpace: "nowrap" }}>
          {UserRolesLabels[role]}
        </span>;
      }
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => {
        return <span style={{ whiteSpace: "nowrap" }}>
          {text}
        </span>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus) => {
        return <span style={{ whiteSpace: "nowrap" }}>
          {UserStatusLabels[status]}
        </span>;
      }
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone"
    },
    {
      title: "Emergency contact",
      dataIndex: "emergencyContact",
      key: "emergencyContact"
    },
    {
      title: "Work start date",
      dataIndex: "workStartDate",
      key: "workStartDate",
      render: renderDateCell
    },
    {
      title: "Birth date",
      dataIndex: "birthDate",
      key: "birthDate",
      render: renderDateCell
    },
    {
      title: "Location (time zone)",
      dataIndex: "location",
      key: "location"
    },
    {
      title: "Salary history",
      dataIndex: "salaryHistory",
      key: "salaryHistory",
      render: (values: SalaryRecord[]) => {
        return <Space>
          {values.map((v, idx) => <Tag key={idx}>{formatMoney(v.value)} | {formatDate(v.date)}</Tag>)}
        </Space>;
      }
    },
    {
      title: "CV link",
      dataIndex: "cvLink",
      key: "cvLink",
      render: (link: string) => {
        return <a href={link} target={"_blank"}>{link}</a>;
      }
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
      <Modal footer={[]} title={"Update user"} open={isOpen && !!userToEdit}
             onCancel={handleEditCancel}>
        <UpdateForm
          initialValues={userToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
        />
      </Modal>
      <Modal footer={[]} title={"Register user"} open={isOpen && !userToEdit}
             onCancel={handleAddCancel}>
        <RegisterForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
        />
      </Modal>
      <AppHeader title={"Manage users"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock errors={[users.error, addMutation.error]} />

        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Button onClick={showAddModal} type="primary">
            Register
          </Button>
        </Card>
        {addMutation.data?.ticket &&
          <Alert style={{ marginTop: 16 }} type={"info"} message={"Send this link to future user"}
                 description={<Paragraph copyable>{addMutation.data?.ticket}</Paragraph>} />}
        <Gutter size={2} />
        <Table scroll={{ x: true }} loading={users.isLoading} dataSource={users.data} columns={columns} />
      </Content>
    </>
  );
};
