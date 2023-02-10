import { FC } from "react";
import { Card, Col, Descriptions, Empty, Row, Typography } from "antd";
import { formatMemory } from "../../utils/formatters";
import { Device } from "../../shared/device.interface";
import { DeviceTypeLabels } from "../../sections/devices";

const { Text } = Typography;
type Props = {
  devices?: Array<Device>
}

export const DevicesTab: FC<Props> = ({ devices }) => {
  if (!devices?.length) {
    return <Empty description={"No devices data"} />;
  }

  return (
    <Row gutter={[16, 16]}>
      {devices.map(device => (<Col xxl={12} sm={24} key={device._id}>
        <Card title={device.name} style={{ height: "100%" }} size={"small"}>
          <Descriptions size={"small"} bordered column={2}>
            <Descriptions.Item label="Type">{DeviceTypeLabels[device.type]}</Descriptions.Item>
            {device.screenSize && <Descriptions.Item label="Screen size">{device.screenSize}</Descriptions.Item>}
            {device.cpu && <Descriptions.Item label="CPU">{device.cpu}</Descriptions.Item>}
            {device.ram && <Descriptions.Item label="RAM">{formatMemory(device.ram)}</Descriptions.Item>}
            {device.storage && <Descriptions.Item label="Storage">{formatMemory(device.storage)}</Descriptions.Item>}
            <Descriptions.Item label="Owner">{device.owner}</Descriptions.Item>
            {device.serialNumber &&
              <Descriptions.Item label="Serial number" span={2}>{device.serialNumber}</Descriptions.Item>}
            {device.notes && <Descriptions.Item label="Notes" span={2}>{device.notes}</Descriptions.Item>}
          </Descriptions>
        </Card>
      </Col>))}
    </Row>
  );
};
