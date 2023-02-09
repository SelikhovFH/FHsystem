import { FC } from "react";
import { Button, Card, Col, Row, Space, Tabs, TabsProps } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { AppHeader } from "../layouts/Header";
import { Content } from "antd/es/layout/layout";
import { useApiFactory } from "../services/apiFactory";
import { User, UserProfile } from "../shared/user.interface";
import { Gutter } from "../components/Gutter";
import { SalaryTab } from "../components/profile/SalaryTab";
import { DevicesTab } from "../components/profile/DevicesTab";
import { DeliveriesTab } from "../components/profile/DeliveriesTab";
import { DeliveryResponse } from "../shared/delivery.interface";
import { DaysOffTab } from "../components/profile/DaysOffTab";

type Props = {}


export const ProfilePage: FC<Props> = (props) => {
  const { logout } = useAuth0();
  const {
    data: profile
  } = useApiFactory<UserProfile, User>({
    basePath: "/users/me"
  });
  const {
    data: myDeliveries
  } = useApiFactory<DeliveryResponse[]>({
    basePath: "/deliveries/my"
  });
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `💻 Devices`,
      children: <DevicesTab devices={profile.data?.devices} />
    },
    {
      key: "2",
      label: `📦 Deliveries`,
      children: <DeliveriesTab deliveries={myDeliveries.data} />
    },
    {
      key: "3",
      label: `📅 Days off`,
      children: <DaysOffTab daysOff={profile.data?.daysOff} />
    },
    {
      key: "4",
      label: `💵 Salary`,
      children: <SalaryTab salaryHistory={profile.data?.salaryHistory} />
    }
  ];

  return (
    <>
      <AppHeader title={"My profile"} />
      <Content style={{ margin: 32, minHeight: "calc(100vh - 64px - 64px)" }}>
        <Row style={{ height: "100%" }} gutter={16}>
          <Col className="gutter-row" span={8}>
            <Card loading={profile.isLoading} bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
              aaa
            </Card>
            <Gutter size={2} />
            <Card loading={profile.isLoading} bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
              <Space>
                <Button onClick={() => logout({ returnTo: window.location.origin })} type="primary" danger
                        icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </Space>
            </Card>
          </Col>
          <Col style={{ height: "100%" }} span={16}>
            <Card loading={profile.isLoading} bordered={false}
                  style={{ boxShadow: "none", borderRadius: 4, height: "100%" }}>
              <Tabs defaultActiveKey="1" items={items} />
            </Card>
          </Col>
        </Row>
      </Content>

    </>
  );
};
