import { FC } from "react";
import { useApiFactory } from "../../services/apiFactory";
import { DayOff, DayOffResponse, DayOffStatus } from "../../shared/dayOff.interface";
import { ErrorsBlock } from "../ErrorsBlock";
import { AxiosError } from "axios";
import { Gutter } from "../Gutter";
import { Button, Card, List, Space, Tag, Typography } from "antd";
import { renderUserCell } from "../table/RenderUserCell";
import { TypeLabels } from "../../sections/dayOff";
import { formatDate } from "../../utils/formatters";
import { queryClient } from "../../services/queryClient";

type Props = {}
const { Title } = Typography;
export const ConfirmDayOffWidget: FC<Props> = (props) => {
  const {
    data: pendingDaysOff,
    editMutation,
    messageContext
  } = useApiFactory<DayOffResponse[], DayOff>({
    basePath: "/days_off",
    get: {
      path: "/days_off/pending",
      queryKeys: ["days_off_pending"]
    },
    edit: {
      path: "/days_off/confirm", onSuccess: () => {
        queryClient.invalidateQueries("days_off_pending");
      }
    }
  });

  return (
    <>
      {messageContext}
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
                  {renderUserCell(item.userId)}
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
    </>
  );
};
