import { FC, ReactNode } from "react";
import { UserProfile } from "../../shared/user.interface";
import { Card, Col, Row, Tabs, TabsProps } from "antd";
import { DevicesTab } from "./DevicesTab";
import { DeliveriesTab } from "./DeliveriesTab";
import { DaysOffTab } from "./DaysOffTab";
import { SalaryTab } from "./SalaryTab";
import { DeliveryResponse } from "../../shared/delivery.interface";
import { UserInfoCard } from "./UserInfoCard";
import { Content } from "antd/es/layout/layout";

type Props = {
  profile?: UserProfile
  deliveries?: DeliveryResponse[]
  myProfileAddon?: ReactNode
  isLoading?: boolean
}

export const Profile: FC<Props> = ({ profile, myProfileAddon, isLoading, deliveries }) => {

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `💻 Devices`,
      children: <DevicesTab devices={profile?.devices} />
    },
    {
      key: "2",
      label: `📦 Deliveries`,
      children: <DeliveriesTab deliveries={deliveries} />
    },
    {
      key: "3",
      label: `📅 Days off`,
      children: <DaysOffTab daysOff={profile?.daysOff} />
    },
    {
      key: "4",
      label: `💵 Salary`,
      children: <SalaryTab salaryHistory={profile?.salaryHistory} />
    }
  ];
  return (
    <Content style={{ margin: 32, minHeight: "calc(100vh - 64px - 64px)" }}>
      <Row style={{ height: "100%" }} gutter={16}>
        <Col className="gutter-row" span={8}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%" }}>
            <Card loading={isLoading} bordered={false} style={{ boxShadow: "none", borderRadius: 4, flex: 1 }}>
              <UserInfoCard user={profile!} />
            </Card>
            {myProfileAddon &&
              <Card loading={isLoading} bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
                {myProfileAddon}
              </Card>}
          </div>
        </Col>
        <Col style={{ height: "100%" }} span={16}>
          <Card loading={isLoading} bordered={false}
                style={{ boxShadow: "none", borderRadius: 4, height: "100%" }}>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};
