import { FC } from "react";
import { AppHeader } from "../../layouts/Header";
import { useApiFactory } from "../../services/apiFactory";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { useParams } from "react-router-dom";
import { Client, ClientProfile } from "../../shared/client.interface";
import styles from "../../components/profile/Profile.module.css";
import { Avatar, Card, Col, Descriptions, Divider, Row, theme, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import { formatDate } from "../../utils/formatters";
import { renderMultipleUsersCell, renderUserCell } from "../../components/table/RenderUserCell";
import { renderProjectStatus } from "../../sections/project";

type Props = {}
const { Text, Title } = Typography;

export const ClientProfilePage: FC<Props> = (props) => {
  const { id } = useParams();
  const { token } = theme.useToken();

  const {
    data: clientProfile
  } = useApiFactory<ClientProfile, Partial<Client>>({
    basePath: `/clients/${id}`
  });

  const client = clientProfile?.data;
  const avatarText = client ? client?.name[0] + client?.name[1] : "";

  return (
    <>
      <AppHeader title={"Client profile"} />
      <ErrorsBlock errors={[clientProfile.error]} />
      <Content className={styles.content} style={{ margin: 32 }}>
        <Row className={styles.fullHeight} gutter={[16, 16]}>
          <Col className="gutter-row" sm={24} xl={8}>
            <div className={styles.fullHeight} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Card loading={clientProfile.isLoading} bordered={false}
                    style={{ boxShadow: "none", borderRadius: 4, flex: 1 }}>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <Avatar style={{ background: token.colorPrimary }} size={96}>
                    <Text strong style={{ fontSize: 28, lineHeight: "96px", margin: 0, color: token.colorWhite }}>
                      {avatarText}
                    </Text>
                  </Avatar>
                  <Title style={{ marginBottom: 0, marginTop: 8 }} level={4}>
                    {client?.name}
                  </Title>
                </div>
                <Divider />
                <Descriptions size={"small"} column={1} title={"Client info"}>
                  <Descriptions.Item label="Email">{client?.email}</Descriptions.Item>
                  <Descriptions.Item label="Website">{client?.website}</Descriptions.Item>
                  <Descriptions.Item label="Additional contacts">{client?.additionalContacts}</Descriptions.Item>
                  <Descriptions.Item label="Work start date">{formatDate(client?.workStartDate)}</Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          </Col>
          <Col className={styles.fullHeight} sm={24} xl={16}>
            <Card loading={clientProfile.isLoading} bordered={false} className={styles.fullHeight}
                  style={{ boxShadow: "none", borderRadius: 4 }}>
              <Title level={4}>
                Projects
              </Title>
              <Divider />
              <Row gutter={[16, 16]}>

                {clientProfile?.data?.projects.map(project => (<Col xxl={12} xl={12} sm={24} key={project._id}>
                  <Card title={project.name} style={{ height: "100%" }} size={"small"}>
                    <Descriptions size={"small"} column={1}>
                      <Descriptions.Item label="Status">{renderProjectStatus(project.status)}</Descriptions.Item>
                      <Descriptions.Item
                        label="Start date">{formatDate(project.startDate)}</Descriptions.Item>
                      <Descriptions.Item label="Manager">{renderUserCell(project.manager)}</Descriptions.Item>
                      <Descriptions.Item label="Workers">
                        {renderMultipleUsersCell(project.workers)}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>))}
              </Row>
            </Card>
          </Col>
        </Row>
      </Content>
    </>
  );
};
