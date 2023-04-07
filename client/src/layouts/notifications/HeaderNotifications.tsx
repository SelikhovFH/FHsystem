import { FC, useEffect, useState } from "react";
import { Avatar, Badge, Button, List, notification, Popover, Tabs, TabsProps, theme, Typography } from "antd";
import { BellOutlined, CloseOutlined, InfoOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { Notification, NotificationType } from "../../shared/notification.interface";
import { formatDate } from "../../utils/formatters";
import styles from "./HeaderNotifications.module.css";
import { useMutation, useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../services/queryClient";

type Props = {}
const audio = new Audio("notificationSound.mp3");

const { Text, Link } = Typography;

export const HeaderNotifications: FC<Props> = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | null>(null);
  const { token: themeToken } = theme.useToken();
  const navigate = useNavigate();
  const unreadNotifications = useQuery<Notification[]>("/notifications", async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/notifications/unread`, getRequestConfig(token));
    return res.data.data;
  });
  const allNotifications = useQuery<Notification[]>("/notifications/all", async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/notifications`, getRequestConfig(token));
    return res.data.data;
  });

  const markAsReadMutation = useMutation(async (id: string) => {
    const token = await getAccessTokenSilently();
    const res = await API.patch(`/notifications/${id}`, {}, getRequestConfig(token));
    return res.data.data;
  }, {
    onSuccess: () => {
      Promise.all([queryClient.invalidateQueries({ queryKey: ["/notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["/notifications/all"] })]);
    }
  });

  const markAllAsReadMutation = useMutation(async () => {
    const token = await getAccessTokenSilently();
    const res = await API.patch(`/notifications/all`, {}, getRequestConfig(token));
    return res.data.data;
  }, {
    onSuccess: () => {
      Promise.all([queryClient.invalidateQueries({ queryKey: ["/notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["/notifications/unread"] })]);
    }
  });

  useEffect(() => {
    getAccessTokenSilently().then(setToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    const source = new EventSourcePolyfill(process.env.REACT_APP_API_SERVER_URL + "/notifications/subscribe", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    source.addEventListener("message", event => {
      const newMessage = JSON.parse(event.data) as Notification;
      audio.play();
      notification.open({
        message: newMessage.title,
        description: newMessage.description,
        type: newMessage.type,
        placement: "topRight",
        duration: 5
      });
      Promise.all([queryClient.invalidateQueries({ queryKey: ["/notifications"] }),
        queryClient.invalidateQueries({ queryKey: ["/notifications/unread"] })]);
    });

    return () => {
      source.close();
    };
  }, [token]);

  const StatusToIcon: Record<NotificationType, JSX.Element> = {
    [NotificationType.info]: <Avatar style={{ background: themeToken.colorInfo }} icon={<InfoOutlined />} />,
    [NotificationType.warning]: <Avatar style={{ background: themeToken.colorWarning }} icon={<InfoOutlined />} />,
    [NotificationType.error]: <Avatar style={{ background: themeToken.colorError }} icon={<CloseOutlined />} />
  };

  const renderItem = (item: Notification) => {
    return (
      <List.Item onClick={() => {
        !item.isRead && markAsReadMutation.mutate(item._id);
        item.link && navigate(item.link);
      }}
                 className={item.isRead ? styles.isRead : styles.listItem}>
        <List.Item.Meta
          avatar={StatusToIcon[item.type]}
          title={item.title}
          description={<>
            {item.description && <>
              <Text type={"secondary"}>{item.description}</Text>
              <br />
            </>}
            <Text style={{ fontWeight: "bold" }} type={"secondary"}>{formatDate(item.createdAt)}</Text>
            <br />
          </>}
        />
      </List.Item>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Unread`,
      children: <List
        loading={unreadNotifications.isLoading || markAllAsReadMutation.isLoading || markAsReadMutation.isLoading}
        itemLayout="horizontal"
        dataSource={unreadNotifications.data}
        renderItem={renderItem}
      />
    },
    {
      key: "2",
      label: `All`,
      children: <List
        loading={allNotifications.isLoading || markAllAsReadMutation.isLoading || markAsReadMutation.isLoading}
        itemLayout="horizontal"
        dataSource={allNotifications.data}
        renderItem={renderItem}
      />
    }
  ];

  const content = (
    <div style={{ width: 400, maxHeight: 640 }}>
      <div style={{ overflowY: "auto", maxHeight: 600 }}>
        <Tabs centered defaultActiveKey="1" items={items} />
      </div>
      <div style={{
        width: "100%",
        height: 40,
        borderTop: `1px solid ${themeToken.colorBorderSecondary}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Link onClick={() => markAllAsReadMutation.mutate()}>Mark all as read</Link>
      </div>
    </div>

  );

  return (
    <Popover overlayInnerStyle={{ padding: 0 }} showArrow={false} content={content} placement={"bottomRight"}
             trigger="click">
      <Badge count={unreadNotifications.data?.length ?? undefined}>
        <Button type="text" icon={<BellOutlined />} onClick={() => {
        }} />
      </Badge>
    </Popover>
  );
};
