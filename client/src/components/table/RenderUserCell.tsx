import { User } from "../../shared/user.interface";
import { FC, ReactNode } from "react";
import { theme, Typography } from "antd";
import { Link as NavLink } from "react-router-dom";
import { getUserProfileRoute } from "../../router/AppRoutes";
import { useIsAdmin } from "../../wrappers/RequireAdmin";

const { Link, Text, Title } = Typography;


export const UserCell: FC<{ user: User, title?: boolean }> = ({ user, title }) => {
  const userName = `${user.name} ${user.surname}`;
  const { token } = theme.useToken();
  const isAdmin = useIsAdmin();
  if (isAdmin) {
    return (
      <NavLink to={getUserProfileRoute(user._id)}>
        <Link>
          {title ? <Title style={{ color: token.colorLink }} level={3}>{userName}</Title> : <>
            {userName}

            <div style={{ fontSize: "0.75em", whiteSpace: "nowrap" }}>({user.email})</div>
          </>}

        </Link>
      </NavLink>
    );
  }
  return title ? <Title level={3}>{userName}</Title> : <Text>
    {userName}
    <div style={{ fontSize: "0.75em", whiteSpace: "nowrap" }}>({user.email})</div>
  </Text>;

};

export const renderUserCell = (user?: User): ReactNode => {
  if (!user) {
    return null;
  }
  return <UserCell user={user} />;
};
