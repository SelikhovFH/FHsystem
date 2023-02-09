import { FC, ReactNode } from "react";
import { UserProfile } from "../../shared/user.interface";
import { Card, Col, Row, Tabs, TabsProps } from "antd";
import { DevicesTab } from "./DevicesTab";
import { DeliveriesTab } from "./DeliveriesTab";
import { DaysOffTab } from "./DaysOffTab";
import { SalaryTab } from "./SalaryTab";
import { UserInfoCard } from "./UserInfoCard";
import { Content } from "antd/es/layout/layout";
import styles from "./Profile.module.css";

type Props = {
  profile?: UserProfile
  myProfileAddon?: ReactNode
  isLoading?: boolean
}

export const Profile: FC<Props> = ({ profile, myProfileAddon, isLoading }) => {

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `💻 Devices`,
      children: <DevicesTab devices={profile?.devices} />
    },
    {
      key: "2",
      label: `📦 Deliveries`,
      children: <DeliveriesTab deliveries={profile?.deliveries} />
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
    <Content className={styles.content} style={{ margin: 32 }}>
      <Row className={styles.fullHeight} gutter={[16, 16]}>
        <Col className="gutter-row" sm={24} xl={8}>
          <div className={styles.fullHeight} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card loading={isLoading} bordered={false} style={{ boxShadow: "none", borderRadius: 4, flex: 1 }}>
              <UserInfoCard user={profile!} />
            </Card>
            {myProfileAddon &&
              <Card loading={isLoading} bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
                {myProfileAddon}
              </Card>}
          </div>
        </Col>
        <Col className={styles.fullHeight} sm={24} xl={16}>
          <Card loading={isLoading} bordered={false} className={styles.fullHeight}
                style={{ boxShadow: "none", borderRadius: 4 }}>
            <Tabs defaultActiveKey="1" items={items} />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};
