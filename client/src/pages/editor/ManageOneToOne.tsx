import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, DatePicker, Form, Input, Layout, Modal, Segmented, Select, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "../FormStyles.module.css";
import tableStyles from "./ManageOneToOne.module.css";

import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import dayjs from "dayjs";
import { UserSelect } from "../../components/form/UserSelect";
import { renderUserCell } from "../../components/table/RenderUserCell";
import { renderDateCell } from "../../components/table/RenderDateCell";
import { Impression, OneToOneRecord } from "../../shared/oneToOneRecord.interface";
import { useAuth0 } from "@auth0/auth0-react";
import { API } from "../../services/api";
import { formatMonth } from "../../utils/formatters";
import { CollapsedTextCell } from "../../components/table/RenderCollapsedTextCell";
import { ImpressionLabel } from "../../sections/oneToOne";
import { ColumnType } from "antd/es/table/interface";
import { getDisplayName } from "../../sections/users/getDisplayName";

const { Content } = Layout;

const schema = yup.object().shape({
  creator: yup.string().required(),
  user: yup.string().required(),
  date: yup.string().required(),
  notes: yup.string().required(),
  impression: yup.number().required()
});


const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  return <Form className={styles.form} initialValues={initialValues} form={form} name="project"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Creator"
               name="creator">
      <UserSelect />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Employee"
               name="user">
      <UserSelect />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Date"
               name="date">
      <DatePicker />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Impression"
               name="impression">
      <Select
        options={[1, 2, 3, 4, 5].map(v => ({ value: v, label: ImpressionLabel[v as Impression] }))}
      />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Notes"
               name="notes">
      <Input.TextArea rows={10} />
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const ManageOneToOnePage: FC = () => {
  const { user } = useAuth0();
  const [mode, setMode] = useState<string | number>("List");
  const [isOpen, setIsOpen] = useState(false);
  const [oneToOneToEdit, setOneToOneToEdit] = useState<OneToOneRecord | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const show2dTable = mode === "Table";

  const {
    data: records,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<{ records: OneToOneRecord[], dates: string[], recordsByUser: OneToOneRecord[][] }, OneToOneRecord>({
    basePath: "/one_to_one_records",
    get: {
      queryKeys: ["/one_to_one_records", selectedYear],
      fetcher: async (config) => {
        const params = new URLSearchParams({
          date: selectedYear.toISOString()
        });
        const res = await API.get(`/one_to_one_records/?${params.toString()}`, config);
        return res.data.data as { records: OneToOneRecord[], dates: string[], recordsByUser: OneToOneRecord[][] };
      }
    },
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setOneToOneToEdit(null);
      }
    }
  });
  console.log(records.data);

  const showAddModal = () => {
    setIsOpen(true);
  };

  const handleAddCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleEditCancel = () => {
    setOneToOneToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate({ ...values, date: values.date.toISOString() });
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: oneToOneToEdit?._id, ...values, date: values.date.toISOString() });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: OneToOneRecord) => {
    setOneToOneToEdit({
      ...item,
      // @ts-ignore
      date: dayjs(item.date),
      // @ts-ignore
      creator: item.creator._id,
      // @ts-ignore
      user: item.user._id
    });
    setIsOpen(true);
  };

  const table2dColumns: ColumnsType<OneToOneRecord[]> = [{
    title: "Employee",
    dataIndex: "user",
    key: "user",
    width: 300,
    fixed: "left",
    render: (_: any, record: OneToOneRecord[]) => {
      return renderUserCell(record[0].user);
    }
  }, ...(records?.data?.dates.map(d => {
    const isCurrentMonth = dayjs().isSame(dayjs(d), "month");
    return ({
      title: formatMonth(d),
      dataIndex: d,
      key: d,
      className: isCurrentMonth && tableStyles.highlightColumn,
      render: (_: any, record: OneToOneRecord[]) => {
        const foundNote = record.find(r => dayjs(r.date).month() === dayjs(d).month());
        if (foundNote) {
          return <Card className={tableStyles.card}
                       size={"small"}>{getDisplayName(foundNote.user)} - {getDisplayName(foundNote.creator)}</Card>;
        }
        if (isCurrentMonth) {
          return <Button danger style={{ width: "100%" }} type={"dashed"}>Add one to one record</Button>;
        }
        return <></>;
      }
    } as ColumnType<OneToOneRecord[]>);
  }) ?? [])];


  const columns: ColumnsType<OneToOneRecord> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: renderDateCell
    },
    {
      title: "Creator",
      dataIndex: "creator",
      key: "creator",
      render: renderUserCell
    },
    {
      title: "Employee",
      dataIndex: "user",
      key: "user",
      render: renderUserCell
    },
    {
      title: "Impression",
      dataIndex: "impression",
      key: "impression",
      render: (text) => ImpressionLabel[text as Impression]
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      render: (text) => {
        return <CollapsedTextCell text={text} />;
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

      <Modal destroyOnClose footer={[]} title={"Update one to one record"} open={isOpen && !!oneToOneToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={oneToOneToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit one to one record"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add one to one record"} open={isOpen && !oneToOneToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          initialValues={{ creator: user?.db_id, date: dayjs() }}
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new one to one record"} />
      </Modal>


      <AppHeader title={"Manage one to one records"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            records.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Space>
            <Segmented options={["List", "Table"]} value={mode} onChange={setMode} />
            <DatePicker allowClear={false} value={selectedYear} onChange={v => setSelectedYear(v!)} picker="year" />
            <Button onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
              Add one to one record
            </Button>
          </Space>
        </Card>
        <Gutter size={2} />
        {show2dTable ?
          <Table className={tableStyles.noHoverTable} bordered scroll={{ x: true }} loading={records.isLoading}
                 dataSource={records.data?.recordsByUser}
                 columns={table2dColumns} /> :
          <Table loading={records.isLoading} dataSource={records.data?.records} columns={columns} />}

      </Content>
    </>
  );
};
