import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, DatePicker, Form, Input, Layout, Modal, Radio, Select, Space, Table } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "./FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { Item } from "../../shared/item.interface";
import { Delivery, DeliveryResponse, DeliveryStatus } from "../../shared/delivery.interface";
import { UserSelect } from "../../components/form/UserSelect";
import { ItemSelect } from "../../components/form/ItemSelect";
import { DeviceSelect } from "../../components/form/DeviceSelect";
import { renderUserCell } from "../../components/table/RenderUserCell";
import { Device } from "../../shared/device.interface";
import dayjs from "dayjs";
import { renderDeliveryStatus } from "../../sections/deliveries";
import { renderDeviceName } from "../../sections/devices";
import { renderItemName } from "../../sections/items";
import { useApiFactory } from "../../services/apiFactory";
import { API } from "../../services/api";
import { renderDateCell } from "../../components/table/RenderDateCell";

const { Content } = Layout;


const schema = yup.object().shape({
  status: yup.string().required(),
  deliverToId: yup.string().required(),
  deliveryCode: yup.string(),
  description: yup.string(),
  estimatedDeliveryTime: yup.string(),
  itemId: yup.string().when("payload", {
    is: (payload: string) => payload === "item",
    then: yup.string().required()
  }),
  deviceId: yup.string().when("payload", {
    is: (payload: string) => payload === "device",
    then: yup.string().required()
  }),
  customItem: yup.string().when("payload", {
    is: (payload: string) => !payload || payload === "custom",
    then: yup.string().required()
  }),
  payload: yup.string()
});


const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  const defaultPayloadValue = initialValues && (initialValues.itemId ? "item" : initialValues.deviceId && "device") || "custom";
  return <Form className={styles.form} initialValues={{ ...initialValues, payload: defaultPayloadValue }} form={form}
               name="delivery"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Status"
               name="status">
      <Select
        options={Object.values(DeliveryStatus).map(v => ({ value: v, label: v }))}
      />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Deliver to"
               name="deliverToId">
      <UserSelect value={form.getFieldValue("deliverToId")} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Delivery code"
               name="deliveryCode">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Description"
               name="description">
      <Input />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Estimated delivery time"
               name="estimatedDeliveryTime">
      <DatePicker />
    </Form.Item>

    <Form.Item rules={[getYupRule(schema)]} label="Delivery payload" name={"payload"}>
      <Radio.Group defaultValue={defaultPayloadValue}>
        <Radio value="item">Item</Radio>
        <Radio value="device">Device</Radio>
        <Radio value="custom">Custom</Radio>
      </Radio.Group>
    </Form.Item>
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) => prevValues.payload !== currentValues.payload}
    >
      {({ getFieldValue }) =>
        getFieldValue("payload") === "item" ? (
          <Form.Item name="itemId" label="Item" rules={[getYupRule(schema)]}>
            <ItemSelect />
          </Form.Item>
        ) : getFieldValue("payload") === "device" ? (
            <Form.Item name="deviceId" label="Device" rules={[getYupRule(schema)]}>
              <DeviceSelect />
            </Form.Item>)
          : (<Form.Item name="customItem" label="Custom item" rules={[getYupRule(schema)]}>
            <Input />
          </Form.Item>)
      }
    </Form.Item>


    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const ManageDeliveriesPage: FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<Delivery | null>(null);

  const {
    data: deliveries,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<DeliveryResponse[], Delivery>({
    basePath: "/deliveries",
    get: {
      queryKeys: ["/deliveries", selectedUser, selectedStatus],
      fetcher: async (config) => {
        const params = new URLSearchParams({
          ...(selectedUser ? { user: selectedUser } : {}),
          ...(selectedStatus ? { status: selectedStatus } : {})
        });
        const res = await API.get(`/deliveries?${params.toString()}`, config);
        return res.data.data as DeliveryResponse[];
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
        setItemToEdit(null);
      }
    }
  });

  const payload = Form.useWatch("payload", form);
  useEffect(() => {
    if (payload === "item") {
      form.resetFields(["deviceId", "customItem"]);
    } else if (payload === "device") {
      form.resetFields(["itemId", "customItem"]);
    } else if (payload === "custom") {
      form.resetFields(["itemId", "deviceId"]);
    }
  }, [payload]);


  const showModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setItemToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };

  const onAddFinish = (_values: any) => {
    const { payload, ...values } = _values;
    addMutation.mutate({ ...values, estimatedDeliveryTime: values.estimatedDeliveryTime.toISOString() });
  };

  const onEditFinish = (_values: any) => {
    const { payload, ...values } = _values;
    editMutation.mutate({
      _id: itemToEdit?._id, ...values,
      estimatedDeliveryTime: values.estimatedDeliveryTime.toISOString()
    });
  };

  const onEditClick = (item: DeliveryResponse) => {
    // @ts-ignore
    setItemToEdit({ ...item, estimatedDeliveryTime: dayjs(item.estimatedDeliveryTime) });
    setIsOpen(true);
  };

  const columns: ColumnsType<DeliveryResponse> = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderDeliveryStatus
    },
    {
      title: "Deliver to User",
      dataIndex: "deliverToUser",
      key: "deliverToUser",
      render: renderUserCell
    },
    {
      title: "Delivery code",
      dataIndex: "deliveryCode",
      key: "deliveryCode"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Estimated delivery time",
      dataIndex: "estimatedDeliveryTime",
      key: "estimatedDeliveryTime",
      render: renderDateCell
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (item: Item) => {
        return item && renderItemName(item);
      }
    },
    {
      title: "Device",
      dataIndex: "device",
      key: "device",
      render: (device: Device) => {
        return device && renderDeviceName(device);
      }
    },
    {
      title: "Custom item",
      dataIndex: "customItem",
      key: "customItem"
    },
    {
      title: "Operations",
      dataIndex: "operations",
      key: "operations",
      render: (_, record) => {
        return <Button disabled={record.status === DeliveryStatus.canceled} onClick={() => onEditClick(record)}
                       type={"primary"} icon={<EditOutlined />} />;
      },
      fixed: "right"

    }
  ];
  return (
    <>
      {messageContext}
      <Modal destroyOnClose footer={[]} title={"Update delivery"} open={isOpen && !!itemToEdit}
             onCancel={handleCancel}>
        <AddOrUpdateForm
          initialValues={itemToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit delivery"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add delivery"} open={isOpen && !itemToEdit}
             onCancel={handleCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new delivery"} />
      </Modal>


      <AppHeader title={"Manage deliveries"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            deliveries.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <Space>
            <Form.Item label="Status" style={{ marginBottom: 0 }}>
              <Select
                allowClear
                options={Object.values(DeliveryStatus).map(v => ({ value: v, label: v }))}
                style={{ minWidth: 100 }}
                value={selectedStatus}
                onChange={v => setSelectedStatus(v as any)}
              />
            </Form.Item>
            <Form.Item label="User" style={{ marginBottom: 0 }}>
              <UserSelect style={{ minWidth: 200 }} value={selectedUser}
                          onChange={v => setSelectedUser(v as any)} />
            </Form.Item>
            <Button onClick={showModal} type="primary" icon={<PlusOutlined />}>
              Add delivery
            </Button>
          </Space>
        </Card>
        <Gutter size={2} />
        <Table scroll={{ x: true }} loading={deliveries.isLoading} dataSource={deliveries.data}
               columns={columns} />
      </Content>
    </>
  );
};
