import { FC, useEffect, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Popover,
  Segmented,
  Space,
  Table
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { CalendarEvent } from "../../shared/calendarEvent.interface";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import { formatDate } from "../../utils/formatters";
import styles from "./HolidaysAndCelebrations.module.css";
import { Event } from "../../components/calendar/Event";
import { AppCalendar } from "../../components/calendar/AppCalendar";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import { FormInstance } from "antd/es/form/hooks/useForm";
import { ColumnsType } from "antd/es/table";
import { renderDateCell } from "../../components/table/RenderDateCell";
import { renderBooleanCell } from "../../components/table/RenderBooleanCell";

type EventProps = {
  event: CalendarEvent
  onDelete: (id: string) => void
  isLoading: boolean
  onFinish: (values: any) => void
  form: FormInstance
}

const AddOrUpdateCalendarForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  return <Form initialValues={initialValues} className={styles.form} form={form} name="registerUser"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Title"
               name="title">
      <Input style={{ minWidth: 250 }} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Description"
               name="description">
      <Input.TextArea rows={4} style={{ minWidth: 250 }} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} style={{ marginBottom: 0 }} name="isDayOff" valuePropName="checked">
      <Checkbox>Is day off</Checkbox>
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} name="isRecurring" valuePropName="checked">
      <Checkbox>Is recurring</Checkbox>
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

const AddOrUpdateForm: FC<FormProps> = ({ form, onFinish, buttonDisabled, buttonText, initialValues }) => {
  useEffect(() => {
    form.resetFields();
  }, [initialValues]);
  return <Form initialValues={initialValues} className={styles.form} form={form} name="registerUser"
               layout={"vertical"}
               onFinish={onFinish}
               autoComplete="off">
    <Form.Item rules={[getYupRule(schema)]} label="Title"
               name="title">
      <Input style={{ minWidth: 250 }} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} label="Description"
               name="description">
      <Input.TextArea rows={4} style={{ minWidth: 250 }} />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} style={{ marginBottom: 0 }} name="date" label={"Date"}>
      <DatePicker />
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} style={{ marginBottom: 0 }} name="isDayOff" valuePropName="checked">
      <Checkbox>Is day off</Checkbox>
    </Form.Item>
    <Form.Item rules={[getYupRule(schema)]} name="isRecurring" valuePropName="checked">
      <Checkbox>Is recurring</Checkbox>
    </Form.Item>
    <Form.Item>
      <Button disabled={buttonDisabled} type="primary" htmlType="submit">
        {buttonText}
      </Button>
    </Form.Item>
  </Form>;
};

export const EventWithControls: FC<EventProps> = ({ event, onDelete, onFinish, isLoading, form }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const toggleShowEditForm = () => setShowEditForm(!showEditForm);
  return (
    <Event event={event} popoverContent={<div>
      {showEditForm ? <AddOrUpdateCalendarForm form={form} initialValues={{
        ...event
      }} onFinish={(v) => {
        onFinish({
          ...v,
          _id: event._id,
          date: event.date
        });
        setShowEditForm(false);
        form.resetFields();
      }
      } buttonDisabled={isLoading}
                                               buttonText={"Update event"} /> : <>
        <Event.DefaultPopoverContent {...event} />
        <Gutter size={2} />
        <Space>
          <Button onClick={toggleShowEditForm} type={"primary"} icon={<EditOutlined />}>
            Edit
          </Button>
          <Button disabled={isLoading} onClick={() => onDelete(event._id)} danger
                  type={"primary"}
                  icon={<DeleteOutlined />}>
            Delete
          </Button>

        </Space>
      </>}

    </div>} />

  );
};

const { Content } = Layout;


const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  isDayOff: yup.boolean(),
  isRecurring: yup.boolean(),
  date: yup.string().required()
});

export const HolidaysAndCelebrationsPage: FC = () => {
  const [mode, setMode] = useState<string | number>("Table");
  const [isOpen, setIsOpen] = useState(false);
  const [calendarEventToEdit, setCalendarEventToEdit] = useState<CalendarEvent | null>(null);
  const showCalendar = mode === "Calendar";
  const {
    data: calendarEvents,
    form,
    addMutation,
    deleteMutation,
    editMutation,
    messageContext
  } = useApiFactory<CalendarEvent[], CalendarEvent>({
    basePath: "/calendar_events",
    add: {
      onSuccess: () => {
        setIsOpen(false);
      }
    },
    edit: {
      onSuccess: () => {
        setIsOpen(false);
        setCalendarEventToEdit(null);
      }
    }
  });


  const [selectedDate, setSelectedDate] = useState<Dayjs | null>();
  const onCalendarSelect = (newValue: Dayjs) => {
    setSelectedDate(newValue);
  };

  const onCalendarAddFinish = (values: any) => {
    addMutation.mutate({ ...values, date: selectedDate?.toISOString() });
  };

  const onCalendarEditFinish = (values: any) => {
    editMutation.mutate({ ...values });
  };

  const showAddModal = () => {
    setIsOpen(true);
  };

  const handleAddCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleEditCancel = () => {
    setCalendarEventToEdit(null);
    form.resetFields();
    setIsOpen(false);
  };


  const onAddFinish = (values: any) => {
    addMutation.mutate({ ...values, date: values?.date.toISOString() });
  };

  const onEditFinish = (values: any) => {
    editMutation.mutate({ _id: calendarEventToEdit?._id, ...values, date: values?.date.toISOString() });
  };

  const onDelete = (values: any) => {
    deleteMutation.mutate(values._id);
  };

  const onEditClick = (item: CalendarEvent) => {
    // @ts-ignore
    setCalendarEventToEdit({ ...item, date: dayjs(item.date) });
    setIsOpen(true);
  };

  const columns: ColumnsType<CalendarEvent> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description"
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: renderDateCell
    },
    {
      title: "Is day off",
      dataIndex: "isDayOff",
      key: "isDayOff",
      render: renderBooleanCell
    },
    {
      title: "Is recurring",
      dataIndex: "isRecurring",
      key: "isRecurring",
      render: renderBooleanCell
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
      <Modal destroyOnClose footer={[]} title={"Update calendar event"} open={isOpen && !!calendarEventToEdit}
             onCancel={handleEditCancel}>
        <AddOrUpdateForm
          initialValues={calendarEventToEdit}
          form={form}
          onFinish={onEditFinish}
          buttonDisabled={editMutation.isLoading}
          buttonText={"Edit calendar event"} />
      </Modal>
      <Modal destroyOnClose footer={[]} title={"Add calendar event"} open={isOpen && !calendarEventToEdit}
             onCancel={handleAddCancel}>
        <AddOrUpdateForm
          form={form}
          onFinish={onAddFinish}
          buttonDisabled={addMutation.isLoading}
          buttonText={"Add new calendar event"} />
      </Modal>
      <AppHeader title={"Holidays & celebrations"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[
            calendarEvents.error as AxiosError,
            addMutation.error as AxiosError,
            editMutation.error as AxiosError,
            deleteMutation.error as AxiosError
          ]} />
        <Gutter size={2} />
        <Alert message="Click on date to add event. Click on event to check details or update it" type="info" />
        <Gutter size={2} />
        <Card className={styles.tdHack} title="Add events" bordered={false}
              style={{ boxShadow: "none", borderRadius: 4 }}>
          <Segmented options={["Table", "Calendar"]} value={mode} onChange={setMode} />
          <Gutter size={2} />
          {showCalendar && <AppCalendar
            showDaysOff={false}
            onSelect={onCalendarSelect}
            events={calendarEvents.data}
            renderEvent={e => (
              <EventWithControls form={form} key={e._id} event={e}
                                 onDelete={(id: string) => deleteMutation.mutate(id as any)}
                                 isLoading={deleteMutation.isLoading || editMutation.isLoading}
                                 onFinish={onCalendarEditFinish} />)}
            renderDateCell={(value, children) => {
              return (
                <Popover placement={"left"}
                         content={<AddOrUpdateCalendarForm form={form}
                                                           buttonDisabled={addMutation.isLoading}
                                                           buttonText={"Add event"}
                                                           onFinish={onCalendarAddFinish} />}
                         title={`Add event for ${formatDate(selectedDate!)}`}
                         trigger="click"
                >
                  <div>
                    <AppCalendar.DayCell value={value}>
                      {children}
                    </AppCalendar.DayCell>
                  </div>
                </Popover>);
            }} />}
          {!showCalendar &&
            <>
              <Button onClick={showAddModal} type="primary" icon={<PlusOutlined />}>
                Add calendar event
              </Button>
              <Gutter size={2} />
              <Table loading={calendarEvents.isLoading} dataSource={calendarEvents.data} columns={columns} />
            </>
          }
        </Card>
      </Content>
    </>
  );
};
