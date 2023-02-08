import { User } from "../../shared/user.interface";
import { ReactNode } from "react";
import { Typography } from "antd";
import { Link as NavLink } from "react-router-dom";
import { getUserProfileRoute } from "../../router/AppRoutes";

const { Link } = Typography;


export const renderUserCell = (user: User): ReactNode => {
  if (!user) {
    return null;
  }
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
};
