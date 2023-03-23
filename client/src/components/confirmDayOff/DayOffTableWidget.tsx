import { FC, useEffect, useState } from "react";
import { useApiFactory } from "../../services/apiFactory";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { renderClientCell } from "../table/RenderClientCell";
import { Button, Card, DatePicker, Form, Layout, Modal, Radio, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ErrorsBlock } from "../ErrorsBlock";
import { AxiosError } from "axios";
import { Gutter } from "../Gutter";
import * as yup from "yup";
import { FormProps } from "../../utils/types";
import styles from "../../pages/FormStyles.module.css";
import { getYupRule } from "../../utils/yupRule";
import { DayOff, DayOffStatus, DayOffType } from "../../shared/dayOff.interface";
import { StatusLabels, TypeLabels } from "../../sections/dayOff";
import { UserSelect } from "../form/UserSelect";
import { formatDate } from "../../utils/formatters";

type Props = {}

const { Content } = Layout;

const schema = yup.object().shape({
  dates: yup.array().of(yup.string()).required(),
  type: yup.string().required(),
  status: yup.string().required(),
  userId: yup.string().required()
});
const { RangePicker } = DatePicker;


const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  return <Form className={styles.form} initialValues={initialValues} form={form} name="project"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Dates"
               name="dates">
      <RangePicker />
    </Form.Item>
    <Form.Item name="type" label="Type" rules={[getYupRule(schema)]}>
      <Radio.Group>
        {Object.values(DayOffType).map(v => (<Radio key={v} value={v}>{TypeLabels[v]}</Radio>))}
      </Radio.Group>
    </Form.Item>
    <Form.Item name="status" label="Status" rules={[getYupRule(schema)]}>
      <Radio.Group>
        {Object.values(DayOffStatus).map(v => (<Radio key={v} value={v}>{StatusLabels[v]}</Radio>))}
      </Radio.Group>
    </Form.Item>
    <Form.Item name="userId" label="Employee" rules={[getYupRule(schema)]}>
      <UserSelect />
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const DayOffTableWidget: FC<Props> = (props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [dayOffToEdit, setDayOffToEdit] = useState<DayOff | null>(null);

  const {
    data: clients,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<DayOff[], DayOff>({
    basePath: "/days_off",
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setDayOffToEdit(null);
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
    setDayOffToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (_values: any) => {
    const { dates, ...values } = _values;
    const startDate = dates[0].toISOString();
    const finishDate = dates[1].toISOString();
    addMutation.mutate({ ...values, startDate, finishDate });
  };

  const onEditFinish = (_values: any) => {
    const { dates, ...values } = _values;
    const startDate = dates[0].toISOString();
    const finishDate = dates[1].toISOString();
    editMutation.mutate({ _id: dayOffToEdit?._id, ...values, startDate, finishDate });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: DayOff) => {
    // @ts-ignore
    setDayOffToEdit({ ...item, dates: [dayjs(item.startDate), dayjs(item.finishDate)], userId: item.userId._id });
    setIsOpen(true);
  };

  const columns: ColumnsType<DayOff> = [
    {
      title: "Employee",
      dataIndex: "userId",
      key: "userId",
      render: (user) => {
        return renderClientCell(user);
      }
    },
    {
      title: "Dates",
      dataIndex: "dates",
      key: "dates",
      render: (_, record) => {
        return <>{formatDate(record.startDate)} - {formatDate(record.finishDate)}</>;
      }
    },
    {
      title: "Days count",
      dataIndex: "dayCount",
      key: "dayCount"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, record) => {
        return <>{TypeLabels[record.type]}</>;
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        return <>{StatusLabels[record.status]}</>;
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
      {isOpen && !!dayOffToEdit && <Modal footer={[]} title={"Update day off"} open={true}
                                          onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={dayOffToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit day off"} />
      </Modal>}
      {isOpen && !dayOffToEdit && <Modal footer={[]} title={"Add day off"} open={true}
                                         onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new day off"} />
      </Modal>}
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
          Add day off
        </Button>
      </Card>
      <Gutter size={2} />
      <Table loading={clients.isLoading} dataSource={clients.data} columns={columns} />
    </>
  );
};
