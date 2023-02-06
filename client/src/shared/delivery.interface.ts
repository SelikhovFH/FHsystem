import {Item} from "./item.interface";
import {Device} from "./device.interface";
import {User} from "./user.interface";

export interface Delivery {
    _id: string
    status: DeliveryStatus
    deliverToId: string
    deliveryCode?: string
    itemId?: string
    deviceId?: string
    customItem?: string
    description?: string
    estimatedDeliveryTime?: string
}

export interface DeliveryResponse extends Delivery {
    item?: Item
    device?: Device
    deliverToUser?: User
}

export enum DeliveryStatus {
    toSend = 'toSend',
    sent = 'sent',
    delivered = 'delivered',
    canceled = 'canceled'
}
