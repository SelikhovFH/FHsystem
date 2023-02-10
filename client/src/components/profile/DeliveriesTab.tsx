import { FC } from "react";
import { DeliveryResponse } from "../../shared/delivery.interface";
import { Card, Col, Descriptions, Empty, Row } from "antd";
import { renderDeliveryStatus } from "../../sections/deliveries";
import { formatDate } from "../../utils/formatters";
import { renderItemName } from "../../sections/items";
import { renderDeviceName } from "../../sections/devices";

type Props = {
  deliveries?: DeliveryResponse[]
}

export const DeliveriesTab: FC<Props> = ({ deliveries }) => {
  if (!deliveries?.length) {
    return <Empty description={"No deliveries data"} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {deliveries.map(delivery => (<Col xxl={8} xl={12} sm={24} key={delivery._id}>
        <Card title={`Delivery #${delivery.deliveryCode}`} style={{ height: "100%" }} size={"small"}>
          <Descriptions size={"small"} column={1}>
            <Descriptions.Item
              label="Status">{renderDeliveryStatus(delivery.status)}</Descriptions.Item>
            <Descriptions.Item label="Delivery code">{delivery.deliveryCode}</Descriptions.Item>
            <Descriptions.Item
              label="Estimated delivery time">{formatDate(delivery.estimatedDeliveryTime)}</Descriptions.Item>
            {delivery.description && <Descriptions.Item label="Description">{delivery.description}</Descriptions.Item>}
            <Descriptions.Item label="Payload">
              {delivery.item && renderItemName(delivery.item) || delivery.device && renderDeviceName(delivery.device) || delivery.customItem}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>))}
    </Row>
  );

};
