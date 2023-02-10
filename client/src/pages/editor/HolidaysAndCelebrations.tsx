import { FC, useState } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Alert, Button, Card, Checkbox, Form, Input, Layout, Popover, Space } from "antd";
import { Dayjs } from "dayjs";
import { CalendarEvent } from "../../shared/calendarEvent.interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { getYupRule } from "../../utils/yupRule";
import { formatDate } from "../../utils/formatters";
import styles from "./HolidaysAndCelebrations.module.css";
import { Event } from "../../components/calendar/Event";
import { AppCalendar } from "../../components/calendar/AppCalendar";
import { FormProps } from "../../utils/types";
import { useApiFactory } from "../../services/apiFactory";
import { FormInstance } from "antd/es/form/hooks/useForm";

type EventProps = {
    event: CalendarEvent
    onDelete: (id: string) => void

    isLoading: boolean
    onFinish: (values: any) => void
    form: FormInstance
}

const AddOrUpdateForm: FC<FormProps> = ({form, onFinish, buttonDisabled, buttonText, initialValues}) => {
    return <Form initialValues={initialValues} className={styles.form} form={form} name="registerUser"
                 layout={"vertical"}
                 onFinish={onFinish}
                 autoComplete="off">
        <Form.Item rules={[getYupRule(schema)]} label="Title"
                   name="title">
            <Input style={{minWidth: 250}}/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} label="Description"
                   name="description">
            <Input.TextArea rows={4} style={{minWidth: 250}}/>
        </Form.Item>
        <Form.Item rules={[getYupRule(schema)]} style={{marginBottom: 0}} name="isDayOff" valuePropName="checked">
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
    </Form>
}

export const EventWithControls: FC<EventProps> = ({ event, onDelete, onFinish, isLoading, form }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const toggleShowEditForm = () => setShowEditForm(!showEditForm);
    return (
      <Event event={event} popoverContent={<div>
          {showEditForm ? <AddOrUpdateForm form={form} initialValues={{
              ...event
          }} onFinish={(v) => {
              onFinish({
                  ...v,
                  _id: event._id,
                    date: event.date
                })
                setShowEditForm(false)
                form.resetFields()
            }
            } buttonDisabled={isLoading}
                                             buttonText={"Update event"}/> : <>
                <Event.DefaultPopoverContent {...event}/>
                <Gutter size={2}/>
                <Space>
                    <Button onClick={toggleShowEditForm} type={"primary"} icon={<EditOutlined/>}>
                        Edit
                    </Button>
                    <Button disabled={isLoading} onClick={() => onDelete(event._id)} danger
                            type={"primary"}
                            icon={<DeleteOutlined/>}>
                        Delete
                    </Button>

                </Space>
            </>}

        </div>}/>

    )
}

const {Content} = Layout;


const schema = yup.object().shape({
    title: yup.string().required(),
    description: yup.string(),
    isDayOff: yup.boolean(),
    isRecurring: yup.boolean(),
    date: yup.string().required(),
});

export const HolidaysAndCelebrationsPage: FC = () => {
    const {
        data: calendarEvents,
        form,
        addMutation,
        deleteMutation,
        editMutation,
        messageContext
    } = useApiFactory<CalendarEvent[], CalendarEvent>({
        basePath: "/calendar_events"
    });

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>();
    const onSelect = (newValue: Dayjs) => {
        setSelectedDate(newValue);
    };

    const onAddFinish = (values: any) => {
        addMutation.mutate({ ...values, date: selectedDate?.toISOString() });
    };

    const onEditFinish = (values: any) => {
        editMutation.mutate({...values})
    }

    return (
        <>
            {messageContext}
            <AppHeader title={"Holidays & celebrations"}/>
            <Content style={{margin: 32}}>
                <ErrorsBlock
                    errors={[
                        calendarEvents.error as AxiosError,
                        addMutation.error as AxiosError,
                        editMutation.error as AxiosError,
                        deleteMutation.error as AxiosError
                    ]}/>
                <Gutter size={2}/>
                <Alert message="Click on date to add event. Click on event to check details or update it" type="info"/>
                <Gutter size={2}/>
                <Card className={styles.tdHack} title="Add events" bordered={false}
                      style={{boxShadow: "none", borderRadius: 4}}>
                    <AppCalendar
                        showDaysOff={false}
                        onSelect={onSelect}
                        events={calendarEvents.data}
                        renderEvent={e => (
                          <EventWithControls form={form} key={e._id} event={e}
                                             onDelete={(id: string) => deleteMutation.mutate(id as any)}
                                             isLoading={deleteMutation.isLoading || editMutation.isLoading}
                                             onFinish={onEditFinish} />)}
                        renderDateCell={(value, children) => {
                            return (
                                <Popover placement={'left'}
                                         content={<AddOrUpdateForm form={form}
                                                                   buttonDisabled={addMutation.isLoading}
                                                                   buttonText={"Add event"}
                                                                   onFinish={onAddFinish}/>}
                                         title={`Add event for ${formatDate(selectedDate!)}`}
                                         trigger="click"
                                >
                                    <div>
                                        <AppCalendar.DayCell value={value}>
                                            {children}
                                        </AppCalendar.DayCell>
                                    </div>
                                </Popover>);
                        }}/>
                </Card>
            </Content>
        </>
    )
}
