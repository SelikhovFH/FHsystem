import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, Form, Input, InputNumber, Layout, Modal, Select, Space, Table, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import { Device, DeviceType } from "../../shared/device.interface";
import { UserSelect } from "../../components/form/UserSelect";
import styles from "./FormStyles.module.css";
import { DeviceTypeLabels } from "../../sections/devices";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { useIsAdmin } from "../../wrappers/RequireAdmin";
import { renderUserCell } from "../../components/table/RenderUserCell";
import { useApiFactory } from "../../services/apiFactory";
import { formatMemory, formatScreenSize } from "../../utils/formatters";

const { Content } = Layout;

const schema = yup.object().shape({
  name: yup.string().required(),
  type: yup.string().required(),
  screenSize: yup.number(),
  cpu: yup.string(),
  ram: yup.number(),
  storage: yup.number(),
  serialNumber: yup.string(),
  owner: yup.string().required(),
  assignedToId: yup.string(),
  notes: yup.string()
});

const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  return <Form className={styles.form} initialValues={initialValues} form={form} name="device"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Name"
               name="name">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Device type"
               name="type">
      <Select
        options={Object.values(DeviceType).map(v => ({ value: v, label: DeviceTypeLabels[v] }))}
      />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Screen size"
               name="screenSize">
      <InputNumber min={10} max={100} addonAfter={`″`} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="CPU"
               name="cpu">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="RAM"
               name="ram">
      <InputNumber min={4} addonAfter={`GB`} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Storage"
               name="storage">
      <InputNumber min={128} addonAfter={`GB`} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Serial number"
               name="serialNumber">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Device owner"
               name="owner">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Assigned to"
               name="assignedToId">
      <UserSelect value={form.getFieldValue("assignedToId")} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Notes"
               name="notes">
      <Input.TextArea rows={4} />
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const ManageDevicesPage: FC = () => {
  const isAdmin = useIsAdmin();

  const [isOpen, setIsOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<Device | null>(null);

  const {
    data: devices,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<Device[], Device>({
    basePath: "/devices",
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setDeviceToEdit(null);
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
    setDeviceToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate(values);
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: deviceToEdit?._id, ...values });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (device: Device) => {
    setDeviceToEdit(device);
    setIsOpen(true);
  };

  const columns: ColumnsType<Device> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: DeviceType) => {
        return DeviceTypeLabels[type];
      }
    },
    {
      title: "Screen size",
      dataIndex: "screenSize",
      key: "screenSize",
      render: (text: number) => {
        return text && formatScreenSize(text);
      }
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      key: "cpu"
    },
    {
      title: "RAM",
      dataIndex: "ram",
      key: "ram",
      render: (text: number) => {
        return text && formatMemory(text);
      }
    },
    {
      title: "Storage",
      dataIndex: "storage",
      key: "storage",
      render: (text: number) => {
        return text && formatMemory(text);
      }
    },
    {
      title: "Serial number",
      dataIndex: "serialNumber",
      key: "serialNumber"
    },
    {
      title: "Device owner",
      dataIndex: "owner",
      key: "owner"
    },
    {
      title: "Assigned to user",
      dataIndex: "assignedToUser",
      key: "assignedToUser",
      render: renderUserCell
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes"
    },
    {
      title: "Operations",
      dataIndex: "operations",
      key: "operations",
      render: (_, record) => {
        if (!isAdmin) {
          return <Tooltip title="Only admins can edit and update devices">
            <Space>
              <Button disabled type={"primary"} icon={<EditOutlined />}>
              </Button>
              <Button disabled danger
                      type={"primary"}
                      icon={<DeleteOutlined />}>
              </Button>

            </Space>
          </Tooltip>;
        }
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

      <Modal footer={[]} title={"Update device"} open={isOpen && !!deviceToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={deviceToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit device"} />
      </Modal>
      <Modal footer={[]} title={"Add device"} open={isOpen && !deviceToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new device"} />
      </Modal>


      <AppHeader title={"Manage devices"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            devices.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Button onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
            Add device
          </Button>
        </Card>
        <Gutter size={2} />
        <Table scroll={{ x: true }} loading={devices.isLoading} dataSource={devices.data} columns={columns}

        />
      </Content>
    </>
  );
};
