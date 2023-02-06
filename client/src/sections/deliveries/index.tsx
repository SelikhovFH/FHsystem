import {DeliveryStatus} from "../../shared/delivery.interface";
import {Tag} from "antd";
import {ReactNode} from "react";

export const renderDeliveryStatus = (status: DeliveryStatus): ReactNode => {
    switch (status) {
        case DeliveryStatus.toSend:
            return <Tag color="default">To send</Tag>
        case DeliveryStatus.sent:
            return <Tag color="processing">Sent</Tag>
        case DeliveryStatus.delivered:
            return <Tag color="success">Delivered</Tag>
        case DeliveryStatus.canceled:
            return <Tag color="error">Canceled</Tag>
        default:
            return null
    }
}
