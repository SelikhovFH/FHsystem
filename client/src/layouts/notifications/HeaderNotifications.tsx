import { FC, useEffect, useState } from "react";
import { Badge, Button, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useAuth0 } from "@auth0/auth0-react";
import { EventSourcePolyfill } from "event-source-polyfill";

type Props = {}

export const HeaderNotifications: FC<Props> = (props) => {
  const [messages, setMessages] = useState<string[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

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
      console.log(event);
      setMessages(prevMessages => [...prevMessages, event.data]);
    });

    return () => {
      source.close();
    };
  }, [token]);

  const content = (
    <div style={{ width: 300, height: 450 }}>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  return (
    <Popover showArrow={false} content={content} placement={"bottomRight"} title="Notifications" trigger="click">
      <Badge count={5}>
        <Button type="text" icon={<BellOutlined />} onClick={() => {
        }} />
      </Badge>
    </Popover>
  );
};
