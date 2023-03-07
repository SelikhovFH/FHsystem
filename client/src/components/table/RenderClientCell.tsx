import { FC, ReactNode } from "react";
import { theme, Typography } from "antd";
import { Link as NavLink } from "react-router-dom";
import { getClientProfileRoute } from "../../router/AppRoutes";
import { Client } from "../../shared/client.interface";

const { Link, Text, Title } = Typography;


export const ClientCell: FC<{ client: Client, title?: boolean }> = ({ client, title }) => {
  const { token } = theme.useToken();
  return (
    <NavLink to={getClientProfileRoute(client._id)}>
      <Link>
        {title ? <Title style={{ color: token.colorLink }} level={3}>{client.name}</Title> : <>
          {client.name}
          <div style={{ fontSize: "0.75em", whiteSpace: "nowrap" }}>({client.website ?? client.email})</div>
        </>}
      </Link>
    </NavLink>
  );


};

export const renderClientCell = (client?: Client): ReactNode => {
  if (!client) {
    return null;
  }
  return <ClientCell client={client} />;
};
