import {FC} from "react";
import {Card, Layout, List, theme, Typography} from "antd";
import {Gutter} from "../components/Gutter";
import {useQuery} from "react-query";
import {API, getRequestConfig} from "../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {ErrorsBlock} from "../components/ErrorsBlock";
import {AxiosError} from "axios";
import {AppHeader} from "../layouts/Header";
import {DeliveryResponse} from "../shared/delivery.interface";
import {formatDate} from "../utils/dates";
import {renderDeliveryStatus} from "../sections/deliveries";


const {Content} = Layout;
const {Text} = Typography

export const MyDeliveriesPage: FC = (props) => {
    const {token} = theme.useToken()
    const {getAccessTokenSilently} = useAuth0()

    const myDeliveries = useQuery<DeliveryResponse[]>("/deliveries/my", async () => {
        const token = await getAccessTokenSilently()
        const res = await API.get(`/deliveries/my`, getRequestConfig(token))
        return res.data.data
    })

    return (
        <>
            <AppHeader title={"Book day off"}/>
            <Content style={{margin: 32}}>
                <ErrorsBlock
                    errors={[
                        myDeliveries.error as AxiosError,
                    ]}/>
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <List
                        itemLayout="horizontal"
                        dataSource={myDeliveries.data ?? []}
                        renderItem={({
                                         item,
                                         description,
                                         customItem,
                                         status,
                                         estimatedDeliveryTime,
                                         deliveryCode,
                                         device
                                     }: DeliveryResponse) => (
                            <List.Item>
                                <List.Item.Meta
                                    title={<>
                                        {renderDeliveryStatus(status)}
                                        {`| ${deliveryCode} | ${estimatedDeliveryTime ? formatDate(estimatedDeliveryTime) : ''}`}
                                    </>}
                                    description={<>
                                        {description}
                                        <br/>
                                        {item?.name || device?.name || customItem}
                                    </>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
                <Gutter size={2}/>
            </Content>
        </>
    )
}
