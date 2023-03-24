import { FC } from "react";
import { Layout, theme, Typography } from "antd";
import { HeaderNotifications } from "./notifications/HeaderNotifications";

type Props = {
  title: string
}

const { Header } = Layout;
const { Title } = Typography;

export const AppHeader: FC<Props> = (props) => {
  const { token } = theme.useToken();
  return (
    <Header style={{
      background: token.colorBgContainer,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <Title style={{ margin: 0 }} level={4}>
        {props.title}
      </Title>
      <HeaderNotifications />
    </Header>
  );
};
