import {FC} from "react";
import {AppHeader} from "../../layouts/Header";
import {ErrorsBlock} from "../../components/ErrorsBlock";
import {AxiosError} from "axios/index";
import {Gutter} from "../../components/Gutter";
import {useRequestMessages} from "../../hooks/useRequestMessages";
import {Calendar, Card, Layout, theme, Typography} from "antd";
import {useMutation, useQuery} from "react-query";
import {API, getRequestConfig} from "../../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {DayOff} from "../../shared/dayOff.interface";
import {queryClient} from "../../services/queryClient";
import {Dayjs} from "dayjs";

type Props = {}
const {Content} = Layout;
const {Title, Text} = Typography

const Holiday = () => {
    const {token} = theme.useToken()
    return (
        <div style={{background: token.colorPrimary, padding: 8, borderRadius: 8}}>
            <Text style={{color: "white"}} strong>1 year in company</Text>
            <br/>
            <Text style={{color: "white"}}>This is day off</Text>
        </div>
    )
}

export const HolidaysAndCelebrationsPage: FC<Props> = (props) => {
    const requestMessages = useRequestMessages('USER_REGISTER')
    const {getAccessTokenSilently} = useAuth0()
    const pendingDaysOff = useQuery<(DayOff & { user: { email: string, picture: string }, dayOffExceedsLimit: boolean })[]>("/days_off/pending", async () => {
        const token = await getAccessTokenSilently({scope: 'admin:admin'})
        const res = await API.get(`/days_off/pending`, getRequestConfig(token))
        return res.data.data
    })
    const mutation = useMutation(async (data) => {
        const token = await getAccessTokenSilently({scope: 'admin:admin'})
        requestMessages.onLoad()
        const res = await API.patch('/days_off/confirm', data, getRequestConfig(token))
        return res.data.data
    }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            await queryClient.invalidateQueries({queryKey: ['/days_off/pending']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })
    const dateCellRender = (value: Dayjs) => {
        const children = value.date() < 15 || value.date() > 18 ? null : <Holiday/>;

        return <div style={{margin: 4, padding: 8, minHeight: 96, borderTop: "2px solid black"}}>
            {value.date()}
            {children}
            <Gutter size={1}/>
            {children}
            <Gutter size={1}/>
            {children}
        </div>

    };
    console.log(pendingDaysOff)
    return (
        <>
            {requestMessages.contextHolder}
            <AppHeader title={"Holidays & celebrations"}/>
            <Content style={{margin: 32}}>
                <ErrorsBlock
                    errors={[pendingDaysOff.error as AxiosError, mutation.error as AxiosError]}/>
                <Gutter size={2}/>
                <Card title="Add events" bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <Calendar dateFullCellRender={dateCellRender}/>
                </Card>
            </Content>
        </>
    )
}
