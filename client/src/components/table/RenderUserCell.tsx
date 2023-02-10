import { User } from "../../shared/user.interface";
import { FC, ReactNode } from "react";
import { Typography } from "antd";
import { Link as NavLink } from "react-router-dom";
import { getUserProfileRoute } from "../../router/AppRoutes";
import { useIsAdmin } from "../../wrappers/RequireAdmin";

const { Link, Text } = Typography;


const UserCell: FC<{ user: User }> = ({ user }) => {
  const isAdmin = useIsAdmin();
  if (isAdmin) {
    return (
      <NavLink to={getUserProfileRoute(user._id)}>
        <Link>
          {user.name}
          {" "}
          {user.surname}
          <div style={{ fontSize: "0.75em", whiteSpace: "nowrap" }}>({user.email})</div>
        </Link>
      </NavLink>
    );
  }
  return <Text>
    {user.name}
    {" "}
    {user.surname}
    <div style={{ fontSize: "0.75em", whiteSpace: "nowrap" }}>({user.email})</div>
  </Text>;

};

export const renderUserCell = (user: User): ReactNode => {
  if (!user) {
    return null;
  }
  return <UserCell user={user} />;
};
