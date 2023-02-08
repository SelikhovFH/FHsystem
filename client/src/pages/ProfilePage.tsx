import { FC } from "react";
import { Button, Card, Col, Row } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { AppHeader } from "../layouts/Header";
import { Content } from "antd/es/layout/layout";
import { useApiFactory } from "../services/apiFactory";
import { User } from "../shared/user.interface";

type Props = {}

export const ProfilePage: FC<Props> = (props) => {
  const { logout } = useAuth0();
  const {
    data: profile
  } = useApiFactory<User[], User>({
    basePath: "/users/me"
  });
  return (
    <>
      <AppHeader title={"My profile"} />
      <Content style={{ margin: 32 }}>
        <Row gutter={16}>
          <Col className="gutter-row" span={8}>
            <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
              aaa
            </Card>
          </Col>
          <Col span={16}>
            <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
              aaa
            </Card>
          </Col>
        </Row>
        <Button onClick={() => logout({ returnTo: window.location.origin })} type="primary" danger
                icon={<LogoutOutlined />}>
          Logout
        </Button>
      </Content>

    </>
  );
};
