import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, Form, Input, InputNumber, Layout, Modal, Select, Space, Table } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import styles from "./FormStyles.module.css";
import { ColumnsType } from "antd/es/table";
import { FormProps } from "../../utils/types";
import { Item, ItemSize } from "../../shared/item.interface";
import { useApiFactory } from "../../services/apiFactory";

const { Content } = Layout;

const schema = yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    quantity: yup.number().min(0),
    size: yup.string()
});


const AddOrUpdateForm: FC<FormProps> = ({form, onFinish, buttonDisabled, buttonText, initialValues}) => {
    useEffect(() => {
        form.resetFields();
    }, [initialValues])
    return <Form className={styles.form} initialValues={initialValues} form={form} name="item"
                 layout={"vertical"}
                 onFinish={onFinish}
                 autoComplete="off">
        <Form.Item rules={[getYupRule(schema)]} label="Name"
                   name="name">
            <Input/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Description"
                   name="description">
            <Input.TextArea rows={4}/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Quantity"
                   name="quantity">
            <InputNumber min={0}/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Size"
                   name="size">
            <Select
                options={Object.values(ItemSize).map(v => ({value: v, label: v}))}
            />
        </Form.Item>
        <Form.Item>
            <Button disabled={buttonDisabled} type="primary" htmlType="submit">
                {buttonText}
            </Button>
        </Form.Item>
    </Form>
}

export const ManageItemsPage: FC = () => {


    const [isOpen, setIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);

    const {
        data: items,
        form,
        addMutation,
        deleteMutation,
        editMutation,
        messageContext
    } = useApiFactory<Item[], Item>({
        basePath: "/items",
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

    const showAddModal = () => {
        setIsOpen(true);
    };

    const handleAddCancel = () => {
        form.resetFields();
        setIsOpen(false);
    };

    const handleEditCancel = () => {
        setItemToEdit(null);
        form.resetFields();
        setIsOpen(false);
    };


    const onAddFinish = (values: any) => {
        addMutation.mutate(values)
    }

    const onEditFinish = (values: any) => {
        editMutation.mutate({_id: itemToEdit?._id, ...values})
    }

    const onDelete = (values: any) => {
        deleteMutation.mutate(values._id)
    }

    const onEditClick = (item: Item) => {
        setItemToEdit(item);
        setIsOpen(true);
    }

    const columns: ColumnsType<Item> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Operations',
            dataIndex: 'operations',
            key: 'operations',
            render: (_, record) => {
                return <Space>
                    <Button onClick={() => onEditClick(record)} type={"primary"} icon={<EditOutlined/>}>
                    </Button>
                    <Button disabled={deleteMutation.isLoading} onClick={() => onDelete(record)} danger
                            type={"primary"}
                            icon={<DeleteOutlined/>}>
                    </Button>

                </Space>
            },
            fixed: "right"
        },
    ];

    return (
        <>
            {messageContext}

            <Modal destroyOnClose footer={[]} title={"Update item"} open={isOpen && !!itemToEdit}
                   onCancel={handleEditCancel}>
                <AddOrUpdateForm
                  initialValues={itemToEdit}
                  form={form}
                  onFinish={onEditFinish}
                  buttonDisabled={editMutation.isLoading}
                  buttonText={"Edit item"} />
            </Modal>
            <Modal destroyOnClose footer={[]} title={"Add item"} open={isOpen && !itemToEdit}
                   onCancel={handleAddCancel}>
                <AddOrUpdateForm
                  form={form}
                  onFinish={onAddFinish}
                  buttonDisabled={addMutation.isLoading}
                  buttonText={"Add new item"} />
            </Modal>


            <AppHeader title={"Manage items"}/>
            <Content style={{margin: 32}}>
                <ErrorsBlock
                    errors={[
                        items.error as AxiosError,
                        addMutation.error as AxiosError,
                        editMutation.error as AxiosError,
                        deleteMutation.error as AxiosError
                    ]}/>
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Button onClick={showAddModal} type="primary" icon={<PlusOutlined/>}>
                        Add item
                    </Button>
                </Card>
                <Gutter size={2}/>
                <Table scroll={{x: true}} loading={items.isLoading} dataSource={items.data} columns={columns}
                       rowClassName={(record, index) => record.quantity <= 0 ? styles.dimmedRow : ''}/>
            </Content>
        </>
    )
}
