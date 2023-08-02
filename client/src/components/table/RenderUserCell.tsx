import { User } from "../../shared/user.interface";
import { FC, ReactNode } from "react";
import { theme, Typography } from "antd";
import { Link as NavLink } from "react-router-dom";
import { getUserProfileRoute } from "../../router/AppRoutes";

const { Link, Title } = Typography;

export const UserCell: FC<{ user: User; title?: boolean }> = ({
  user,
  title,
}) => {
  const userName = `${user.name} ${user.surname}`;
  const { token } = theme.useToken();
  return (
    <NavLink to={getUserProfileRoute(user._id)}>
      <Link>
        {title ? (
          <Title style={{ color: token.colorLink }} level={3}>
            {userName}
          </Title>
        ) : (
          <>
            {userName}

            <div style={{ fontSize: "0.75em", whiteSpace: "nowrap" }}>
              ({user.email})
            </div>
          </>
        )}
      </Link>
    </NavLink>
  );
};

export const renderUserCell = (user?: User): ReactNode => {
  if (!user) {
    return null;
  }
  return <UserCell user={user} />;
};

export const renderMultipleUsersCell = (users?: User[]): ReactNode => {
  if (!users) {
    return null;
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {users?.map((u) => (
        <UserCell user={u} key={u._id} />
      ))}
    </div>
  );
};
