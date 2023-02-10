import { FC } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { Button, Card, Layout, List, Space, Tag, Typography } from "antd";
import { DayOff, DayOffResponse, DayOffStatus } from "../../shared/dayOff.interface";
import { TypeLabels } from "../../sections/dayOff";
import { formatDate } from "../../utils/formatters";
import { useApiFactory } from "../../services/apiFactory";
import { renderUserCell } from "../../components/table/RenderUserCell";

type Props = {}
const { Content } = Layout;
const { Title } = Typography;

export const ConfirmDayOffPage: FC<Props> = (props) => {
  const {
    data: pendingDaysOff,
    editMutation,
    messageContext
  } = useApiFactory<DayOffResponse[], DayOff>({
    basePath: "/days_off",
    get: {
      path: "/days_off/pending"
    },
    edit: {
      path: "/days_off/confirm"
    }
  });

  return (
    <>
      {messageContext}
      <AppHeader title={"Confirm day off"} />
      <Content style={{ margin: 32 }}>
        <ErrorsBlock
          errors={[pendingDaysOff.error as AxiosError, editMutation.error as AxiosError]} />
        <Gutter size={2} />
        <Card bordered={false} style={{ boxShadow: "none", borderRadius: 4 }}>
          <List
            style={{ background: "white" }}
            className="demo-loadmore-list"
            loading={pendingDaysOff.isLoading || editMutation.isLoading}
            itemLayout="horizontal"
            dataSource={pendingDaysOff.data ?? []}
            header={<Title level={5}>Pending days off</Title>}
            renderItem={(item) => (
              <List.Item
                actions={[<Button
                  onClick={() => editMutation.mutate({
                    id: item._id,
                    status: DayOffStatus.declined
                  } as any)}
                  danger type="link">Decline</Button>,
                  <Button onClick={() => editMutation.mutate({
                    id: item._id,
                    status: DayOffStatus.approved
                  } as any)}
                          type="link">Approve</Button>]}
              >
                <List.Item.Meta
                  description={<Space direction={"vertical"} size={"small"}>
                    {renderUserCell(item.user)}
                    <span>
                      {TypeLabels[item.type]}
                      {" "}
                      <b>{formatDate(item.startDate)}</b>
                      {" "}
                      -
                      {" "}
                      <b>{formatDate(item.finishDate)}</b>
                     </span>
                  </Space>}
                />
                {item.dayOffExceedsLimit && <Tag color="warning">Day off exceeds user limit</Tag>}

              </List.Item>
            )}
          />
        </Card>
      </Content>
    </>
  );
};
