import {FC, useEffect, useState} from "react";
import {AppHeader} from "../../layouts/Header";
import {ErrorsBlock} from "../../components/ErrorsBlock";
import {AxiosError} from "axios/index";
import {Gutter} from "../../components/Gutter";
import {useRequestMessages} from "../../hooks/useRequestMessages";
import {Button, Card, DatePicker, Form, Input, Layout, Modal, Radio, Select, Space, Table} from "antd";
import {useMutation, useQuery} from "react-query";
import {API, getRequestConfig} from "../../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {queryClient} from "../../services/queryClient";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import * as yup from 'yup'
import {getYupRule} from "../../utils/yupRule";
import styles from "./FormStyles.module.css"
import {ColumnsType} from "antd/es/table";
import {FormProps} from "../../utils/types";
import {Item} from "../../shared/item.interface";
import {Delivery, DeliveryResponse, DeliveryStatus} from "../../shared/delivery.interface";
import {UserSelect} from "../../components/form/UserSelect";
import {ItemSelect} from "../../components/form/ItemSelect";
import {DeviceSelect} from "../../components/form/DeviceSelect";
import {formatDate} from "../../utils/dates";
import {renderUserCell} from "../../components/table/RenderUserCell";
import {Device} from "../../shared/device.interface";
import dayjs from "dayjs";
import {renderDeliveryStatus} from "../../sections/deliveries";

const {Content} = Layout;


const schema = yup.object().shape({
    status: yup.string().required(),
    deliverToId: yup.string().required(),
    deliveryCode: yup.string(),
    description: yup.string(),
    estimatedDeliveryTime: yup.string(),
    itemId: yup.string().when('payload', {
        is: (payload: string) => payload === 'item',
        then: yup.string().required(),
    }),
    deviceId: yup.string().when('payload', {
        is: (payload: string) => payload === 'device',
        then: yup.string().required(),
    }),
    customItem: yup.string().when('payload', {
        is: (payload: string) => !payload || payload === 'custom',
        then: yup.string().required(),
    }),
    payload: yup.string(),
});


const AddOrUpdateForm: FC<FormProps> = ({form, onFinish, buttonDisabled, buttonText, initialValues}) => {
    useEffect(() => {
        form.resetFields()
    }, [form, initialValues])
    const defaultPayloadValue = initialValues && (initialValues.itemId ? "item" : initialValues.deviceId && "device") || "custom"
    return <Form className={styles.form} initialValues={{...initialValues, payload: defaultPayloadValue}} form={form}
                 name="delivery"
                 layout={"vertical"}
                 onFinish={onFinish}
                 autoComplete="off">
        <Form.Item rules={[getYupRule(schema)]} label="Status"
                   name="status">
            <Select
                options={Object.values(DeliveryStatus).map(v => ({value: v, label: v}))}
            />
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Deliver to"
                   name="deliverToId">
            <UserSelect value={form.getFieldValue("deliverToId")}/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Delivery code"
                   name="deliveryCode">
            <Input/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Description"
                   name="description">
            <Input/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Estimated delivery time"
                   name="estimatedDeliveryTime">
            <DatePicker/>
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
            {({getFieldValue}) =>
                getFieldValue('payload') === 'item' ? (
                    <Form.Item name="itemId" label="Item" rules={[getYupRule(schema)]}>
                        <ItemSelect/>
                    </Form.Item>
                ) : getFieldValue('payload') === 'device' ? (
                        <Form.Item name="deviceId" label="Device" rules={[getYupRule(schema)]}>
                            <DeviceSelect/>
                        </Form.Item>)
                    : (<Form.Item name="customItem" label="Custom item" rules={[getYupRule(schema)]}>
                        <Input/>
                    </Form.Item>)
            }
        </Form.Item>


        <Form.Item>
            <Button disabled={buttonDisabled} type="primary" htmlType="submit">
                {buttonText}
            </Button>
        </Form.Item>
    </Form>
}

export const ManageDeliveriesPage: FC = () => {
    const [addForm] = Form.useForm()
    const [editForm] = Form.useForm()

    const [selectedUser, setSelectedUser] = useState<string | null>(null)
    const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | null>(null)


    const addPayload = Form.useWatch('payload', addForm);
    useEffect(() => {
        if (addPayload === "item") {
            addForm.resetFields(['deviceId', 'customItem'])
        } else if (addPayload === "device") {
            addForm.resetFields(['itemId', 'customItem'])
        } else if (addPayload === "custom") {
            addForm.resetFields(['itemId', 'deviceId'])
        }
    }, [addPayload])
    const editPayload = Form.useWatch('payload', editForm);
    useEffect(() => {
        if (editPayload === "item") {
            editForm.resetFields(['deviceId', 'customItem'])
        } else if (editPayload === "device") {
            editForm.resetFields(['itemId', 'customItem'])
        } else if (editPayload === "custom") {
            editForm.resetFields(['itemId', 'deviceId'])
        }
    }, [editPayload])


    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [itemToEdit, setItemToEdit] = useState<Delivery | null>(null);

    const showAddModal = () => {
        setIsAddOpen(true);
    };

    const handleAddCancel = () => {
        addForm.resetFields()
        setIsAddOpen(false);
    };

    const handleEditCancel = () => {
        setItemToEdit(null)
        editForm.resetFields()
        setIsEditOpen(false);
    };

    const requestMessages = useRequestMessages('DELIVERIES')
    const {getAccessTokenSilently} = useAuth0()
    const deliveries = useQuery<DeliveryResponse[]>(["/deliveries", selectedUser, selectedStatus], async () => {
        const token = await getAccessTokenSilently()
        const params = new URLSearchParams({
            ...(selectedUser ? {user: selectedUser} : {}),
            ...(selectedStatus ? {status: selectedStatus} : {}),
        });
        const res = await API.get(`/deliveries?${params.toString()}`, getRequestConfig(token))
        return res.data.data
    })

    const addMutation = useMutation(async (data) => {
        const token = await getAccessTokenSilently()
        requestMessages.onLoad()
        const res = await API.post('/deliveries', data, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            addForm.resetFields()
            await queryClient.invalidateQueries({queryKey: ['/deliveries']})
            setIsAddOpen(false);
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const editMutation = useMutation(async (data) => {
        const token = await getAccessTokenSilently()
        requestMessages.onLoad()
        editForm.resetFields()
        const res = await API.patch('/deliveries', data, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            await queryClient.invalidateQueries({queryKey: ['/deliveries']})
            setIsEditOpen(false);
            setItemToEdit(null)
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const deleteMutation = useMutation(async (id) => {
        const token = await getAccessTokenSilently()
        requestMessages.onLoad()
        const res = await API.delete(`/deliveries/${id}`, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            await queryClient.invalidateQueries({queryKey: ['/deliveries']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const onAddFinish = (_values: any) => {
        const {payload, ...values} = _values
        addMutation.mutate({...values, estimatedDeliveryTime: values.estimatedDeliveryTime.toISOString()})
    }

    const onEditFinish = (_values: any) => {
        const {payload, ...values} = _values
        editMutation.mutate({
            _id: itemToEdit?._id, ...values,
            estimatedDeliveryTime: values.estimatedDeliveryTime.toISOString()
        })
    }

    const onDelete = (values: any) => {
        deleteMutation.mutate(values._id)
    }

    const onEditClick = (item: DeliveryResponse) => {
        // @ts-ignore
        setItemToEdit({...item, estimatedDeliveryTime: dayjs(item.estimatedDeliveryTime)})
        setIsEditOpen(true)
    }

    const columns: ColumnsType<DeliveryResponse> = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: renderDeliveryStatus,
        },
        {
            title: 'Deliver to User',
            dataIndex: 'deliverToUser',
            key: 'deliverToUser',
            render: renderUserCell
        },
        {
            title: 'Delivery code',
            dataIndex: 'deliveryCode',
            key: 'deliveryCode',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Estimated delivery time',
            dataIndex: 'estimatedDeliveryTime',
            key: 'estimatedDeliveryTime',
            render: (text: string) => {
                return formatDate(text)
            },
        },
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
            render: (item: Item) => {
                return item && `${item.name} ${item.size || ''}`
            },
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
            render: (device: Device) => {
                return device && `${device.name}`
            },
        },
        {
            title: 'Custom item',
            dataIndex: 'customItem',
            key: 'customItem',
        },
        {
            title: 'Operations',
            dataIndex: 'operations',
            key: 'operations',
            render: (_, record) => {
                return <Button disabled={record.status === DeliveryStatus.canceled} onClick={() => onEditClick(record)}
                               type={"primary"} icon={<EditOutlined/>}/>
            },

        },
    ];

    return (
        <>
            {requestMessages.contextHolder}

            <Modal footer={[]} title={"Update delivery"} open={isEditOpen}
                   onCancel={handleEditCancel}>
                <AddOrUpdateForm
                    initialValues={itemToEdit}
                    form={editForm}
                    onFinish={onEditFinish}
                    buttonDisabled={editMutation.isLoading}
                    buttonText={"Edit delivery"}/>
            </Modal>
            <Modal footer={[]} title={"Add delivery"} open={isAddOpen}
                   onCancel={handleAddCancel}>
                <AddOrUpdateForm
                    form={addForm}
                    onFinish={onAddFinish}
                    buttonDisabled={addMutation.isLoading}
                    buttonText={"Add new delivery"}/>
            </Modal>


            <AppHeader title={"Manage deliveries"}/>
            <Content style={{margin: 32}}>
                <ErrorsBlock
                    errors={[
                        deliveries.error as AxiosError,
                        addMutation.error as AxiosError,
                        editMutation.error as AxiosError,
                        deleteMutation.error as AxiosError
                    ]}/>
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Space>
                        <Form.Item label="Status" style={{marginBottom: 0}}>
                            <Select
                                allowClear
                                options={Object.values(DeliveryStatus).map(v => ({value: v, label: v}))}
                                style={{minWidth: 100}}
                                value={selectedStatus}
                                onChange={v => setSelectedStatus(v as any)}
                            />
                        </Form.Item>
                        <Form.Item label="User" style={{marginBottom: 0}}>
                            <UserSelect style={{minWidth: 200}} value={selectedUser}
                                        onChange={v => setSelectedUser(v as any)}/>
                        </Form.Item>
                        <Button onClick={showAddModal} type="primary" icon={<PlusOutlined/>}>
                            Add delivery
                        </Button>
                    </Space>
                </Card>
                <Gutter size={2}/>
                <Table scroll={{x: true}} loading={deliveries.isLoading} dataSource={deliveries.data}
                       columns={columns}/>
            </Content>
        </>
    )
}
