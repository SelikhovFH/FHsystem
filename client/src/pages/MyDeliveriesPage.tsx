import {FC} from "react";
import {Card, Descriptions, Layout, List, theme, Typography} from "antd";
import { Gutter } from "../components/Gutter";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { ErrorsBlock } from "../components/ErrorsBlock";
import { AxiosError } from "axios";
import { AppHeader } from "../layouts/Header";
import { DeliveryResponse } from "../shared/delivery.interface";
import { formatDate } from "../utils/dates";
import { renderDeliveryStatus } from "../sections/deliveries";
import { renderDeviceName } from "../sections/devices";
import { renderItemName } from "../sections/items";


const { Content } = Layout;
const { Text } = Typography;

export const MyDeliveriesPage: FC = (props) => {
  const { token } = theme.useToken();
  const { getAccessTokenSilently } = useAuth0();

  const myDeliveries = useQuery<DeliveryResponse[]>("/deliveries/my", async () => {
        const token = await getAccessTokenSilently()
        const res = await API.get(`/deliveries/my`, getRequestConfig(token))
        return res.data.data
    })

    return (
        <>
            <AppHeader title={"My deliveries"}/>
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
                                    </>}
                                    description={<>
                                        <Descriptions size={"small"} column={1} title="Delivery Info">
                                            <Descriptions.Item
                                                label="Status">{renderDeliveryStatus(status)}</Descriptions.Item>
                                            <Descriptions.Item label="Delivery code">{deliveryCode}</Descriptions.Item>
                                            <Descriptions.Item
                                                label="Estimated delivery time">{formatDate(estimatedDeliveryTime)}</Descriptions.Item>
                                            <Descriptions.Item label="Description">{description}</Descriptions.Item>
                                            <Descriptions.Item label="Payload">
                                              {item && renderItemName(item) || device && renderDeviceName(device) || customItem}
                                            </Descriptions.Item>
                                        </Descriptions>
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
