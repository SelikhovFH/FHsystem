import { FC } from "react";
import { AppHeader } from "../../layouts/Header";
import { ErrorsBlock } from "../../components/ErrorsBlock";
import { AxiosError } from "axios/index";
import { Gutter } from "../../components/Gutter";
import { useRequestMessages } from "../../hooks/useRequestMessages";
import { Avatar, Button, Card, Layout, List, Tag, Typography } from "antd";
import { useMutation, useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0, User } from "@auth0/auth0-react";
import { DayOff, DayOffStatus } from "../../shared/dayOff.interface";
import { TypeLabels } from "../../sections/dayOff";
import { formatDate } from "../../utils/dates";
import { queryClient } from "../../services/queryClient";

type Props = {}
const {Content} = Layout;
const {Title} = Typography

export const ConfirmDayOffPage: FC<Props> = (props) => {
    const requestMessages = useRequestMessages('USER_REGISTER')
  const { getAccessTokenSilently } = useAuth0();
  const pendingDaysOff = useQuery<(DayOff & { user: User, dayOffExceedsLimit: boolean })[]>("/days_off/pending", async () => {
    const token = await getAccessTokenSilently({ scope: "editor:editor" });
    const res = await API.get(`/days_off/pending`, getRequestConfig(token));
    return res.data.data;
  });
  const mutation = useMutation(async (data) => {
    const token = await getAccessTokenSilently({ scope: "editor:editor" });
    requestMessages.onLoad();
    const res = await API.patch("/days_off/confirm", data, getRequestConfig(token));
    return res.data.data;
  }, {
        onSuccess: async () => {
            requestMessages.onSuccess()
            await queryClient.invalidateQueries({queryKey: ['/days_off/pending']})
        },
        onError: async () => {
            requestMessages.onError()
        },
    })
    console.log(pendingDaysOff)
    return (
        <>
            {requestMessages.contextHolder}
            <AppHeader title={"Confirm day off"}/>
            <Content style={{margin: 32}}>
                <ErrorsBlock
                    errors={[pendingDaysOff.error as AxiosError, mutation.error as AxiosError]}/>
                <Gutter size={2}/>
                <Card bordered={false} style={{boxShadow: "none", borderRadius: 4}}>
                    <List
                        style={{background: "white"}}
                        className="demo-loadmore-list"
                        loading={pendingDaysOff.isLoading || mutation.isLoading}
                        itemLayout="horizontal"
                        dataSource={pendingDaysOff.data ?? []}
                        header={<Title level={5}>Pending days off</Title>}
                        renderItem={(item) => (
                            <List.Item
                                actions={[<Button
                                    onClick={() => mutation.mutate({
                                        id: item._id,
                                        status: DayOffStatus.declined
                                    } as any)}
                                    danger type="link">Decline</Button>,
                                    <Button onClick={() => mutation.mutate({
                                        id: item._id,
                                        status: DayOffStatus.approved
                                    } as any)}
                                            type="link">Approve</Button>]}
                            >
                              <List.Item.Meta
                                avatar={<Avatar src={item.user.name} />}
                                title={<a
                                  href="https://ant.design">{`${item.user.name} ${item.user.surname} (${item.user.email})`}</a>}
                                description={<span>
                                        {TypeLabels[item.type]}
                                  {" "}
                                  <b>{formatDate(item.startDate)}</b>
                                  {" "}
                                  -
                                  {" "}
                                  <b>{formatDate(item.finishDate)}</b>
                                    </span>}
                              />
                                {item.dayOffExceedsLimit && <Tag color="warning">Day off exceeds user limit</Tag>}

                            </List.Item>
                        )}
                    />
                </Card>
            </Content>
        </>
    )
}
