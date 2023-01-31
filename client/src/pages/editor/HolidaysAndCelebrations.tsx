import {FC, useState} from "react";
import {AppHeader} from "../../layouts/Header";
import {ErrorsBlock} from "../../components/ErrorsBlock";
import {AxiosError} from "axios/index";
import {Gutter} from "../../components/Gutter";
import {useRequestMessages} from "../../hooks/useRequestMessages";
import {Alert, Button, Calendar, Card, Checkbox, Form, Input, Layout, Popover, Space, theme} from "antd";
import {useMutation, useQuery} from "react-query";
import {API, getRequestConfig} from "../../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {queryClient} from "../../services/queryClient";
import dayjs, {Dayjs} from "dayjs";
import {CalendarEvent} from "../../shared/calendarEvent.interface";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import * as yup from 'yup'
import {getYupRule} from "../../utils/yupRule";
import {formatDate} from "../../utils/dates";
import styles from './HolidaysAndCelebrations.module.css'
import {FormInstance} from "antd/es/form/hooks/useForm";
import {Event} from "../../components/calendar/Event";

type EventProps = {
    event: CalendarEvent
    onDelete: (id: string) => void

    isLoading: boolean
    onFinish: (values: any) => void
}

type FormProps = {
    form: FormInstance
    onFinish: (values: any) => void
    buttonDisabled: boolean
    buttonText: string
    initialValues?: any
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

export const EventWithControls: FC<EventProps> = ({event, onDelete, onFinish, isLoading}) => {
    const [showEditForm, setShowEditForm] = useState(false)
    const [form] = Form.useForm()
    const toggleShowEditForm = () => setShowEditForm(!showEditForm)
    return (
        <Event event={event} popoverContent={<div>
            {showEditForm ? <AddOrUpdateForm form={form} initialValues={{
                ...event
            }} onFinish={(v) => {
                console.log(event)
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
    const {token} = theme.useToken()
    const [form] = Form.useForm()
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>();
    const onSelect = (newValue: Dayjs) => {
        setSelectedDate(newValue);
    };
    const requestMessages = useRequestMessages('CALENDAR_EVENTS')
    const {getAccessTokenSilently} = useAuth0()
    const calendarEvents = useQuery<CalendarEvent[]>("/calendar_events", async () => {
        const token = await getAccessTokenSilently()
        const res = await API.get(`/calendar_events`, getRequestConfig(token))
        return res.data.data
    })

    const addMutation = useMutation(async (data) => {
        const token = await getAccessTokenSilently({scope: 'editor:editor'})
        requestMessages.onLoad()
        const res = await API.post('/calendar_events', data, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            form.resetFields()
            await queryClient.invalidateQueries({queryKey: ['/calendar_events']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const editMutation = useMutation(async (data) => {
        const token = await getAccessTokenSilently({scope: 'editor:editor'})
        requestMessages.onLoad()
        const res = await API.patch('/calendar_events', data, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            await queryClient.invalidateQueries({queryKey: ['/calendar_events']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const deleteMutation = useMutation(async (id) => {
        const token = await getAccessTokenSilently({scope: 'editor:editor'})
        requestMessages.onLoad()
        const res = await API.delete(`/calendar_events/${id}`, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            await queryClient.invalidateQueries({queryKey: ['/calendar_events']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })

    const onAddFinish = (values: any) => {
        addMutation.mutate({...values, date: selectedDate?.toISOString()})
    }

    const onEditFinish = (values: any) => {
        editMutation.mutate({...values})
    }


    const dateCellRender = (value: Dayjs) => {
        const eventsForThisDay = calendarEvents.data?.filter(d => {
            if (value.isSame(new Date(d.date), 'day')) {
                return true;
            }
            if (!d.isRecurring) {
                return false
            }
            // @ts-ignore
            return dayjs(d.date).dayOfYear() === value.dayOfYear()
        }) ?? []

        const children = eventsForThisDay.map(e => (
            <EventWithControls key={e._id} event={e} onDelete={(id: string) => deleteMutation.mutate(id as any)}
                               isLoading={deleteMutation.isLoading || editMutation.isLoading}
                               onFinish={onEditFinish}/>));

        return <Popover placement={'left'} content={<AddOrUpdateForm form={form} buttonDisabled={addMutation.isLoading}
                                                                     buttonText={"Add event"} onFinish={onAddFinish}/>}
                        title={`Add event for ${formatDate(selectedDate!)}`}
                        trigger="click"
        >
            <div className={styles.day} style={{borderTop: `2px solid ${token.colorBorderSecondary}`}}>
                {value.date()}
                <Gutter size={0.5}/>
                {children}
            </div>
        </Popover>

    };


    return (
        <>
            {requestMessages.contextHolder}
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
                    <Calendar onSelect={onSelect} mode={'month'} dateFullCellRender={dateCellRender}/>
                </Card>
            </Content>
        </>
    )
}
