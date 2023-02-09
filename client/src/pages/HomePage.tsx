import { FC, useState } from "react";
import { AppHeader } from "../layouts/Header";
import { Card, Divider, Layout, Modal, Space, Typography } from "antd";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";
import { AdminRoutes, AppRoutes, EditorRoutes } from "../router/AppRoutes";
import { useIsAdmin } from "../wrappers/RequireAdmin";
import { useIsEditor } from "../wrappers/RequireEditor";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

type ActivityCardProps = { title: string, link: string, icon: string; onClick?: () => void }

const ActivityCard: FC<ActivityCardProps> = ({ link, title, icon, onClick }) => {
  return <Link to={link}>
    <Card onClick={onClick ? (e) => {
      e.preventDefault();
      onClick();
    } : undefined
    } className={styles.card} bodyStyle={{ padding: 0, height: "100%" }}>
      <div className={styles.cardInner}>
        <div>
          {icon}
        </div>
        <div>
          {title}
        </div>
      </div>
    </Card>
  </Link>;
};

export const HomePage: FC = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = useIsAdmin();
  const isEditor = useIsEditor();
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Modal title="Report a bug" open={isModalOpen} footer={[]} onCancel={handleCancel}>
        <Paragraph>
          You can contact developer to report a bug:
          <br />
          email: maxim.budnyk@gmail.com
          <br />
          telegram: @toucancoucan
        </Paragraph>
        <Paragraph>
          You can also contact manager to report a bug:
          <br />
          telegram: @glebselikhov
        </Paragraph>
      </Modal>
      <AppHeader title={"Homepage"} />
      <Content style={{ margin: 32 }}>
        <Title level={1}>
          Welcome to FH System
        </Title>
        <Title level={3}>
          User actions
        </Title>
        <Space wrap size={"middle"}>
          <ActivityCard title={"Book day off"} link={AppRoutes.bookDayOff} icon={"📅"} />
          <ActivityCard title={"Profile"} link={AppRoutes.profile} icon={"👤"} />
          <ActivityCard title={"Report a bug"} link={""} icon={"🐛"} onClick={showModal} />
        </Space>
        {isEditor && <>
          <Divider dashed />
          <Title level={3}>
            Editor actions
          </Title>
          <Space wrap size={"middle"}>
            <ActivityCard title={"Confirm day off"} link={EditorRoutes.confirmDayOff} icon={"✅"} />
            <ActivityCard title={"Celebrations"} link={EditorRoutes.holidaysAndCelebrations} icon={"🎉"} />
            <ActivityCard title={"Manage devices"} link={EditorRoutes.manageDevices} icon={"💻"} />
            <ActivityCard title={"Manage items"} link={EditorRoutes.manageItems} icon={"🪑"} />
            <ActivityCard title={"Manage deliveries"} link={EditorRoutes.manageDeliveries} icon={"🚚"} />
          </Space>
        </>}
        {isAdmin && <>
          <Divider dashed />
          <Title level={3}>
            Admin actions
          </Title>
          <Space wrap size={"middle"}>
            <ActivityCard title={"Manage users"} link={AdminRoutes.manageUsers} icon={"👥"} />
          </Space>
        </>}
      </Content>
    </>
  );
};
