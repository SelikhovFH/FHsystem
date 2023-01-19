import {FC} from "react";
import {Button} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";

type Props = {}

export const ProfilePage: FC<Props> = (props) => {
    const {logout} = useAuth0();
    return (
        <div>
            profile page
            <Button onClick={() => logout({returnTo: window.location.origin})} type="primary" danger
                    icon={<LogoutOutlined/>}>
                Logout
            </Button>
        </div>
    )
}
