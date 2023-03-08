import { ComponentProps, FC, useMemo } from "react";
import { Select } from "antd";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { Client } from "../../shared/client.interface";

type Props = ComponentProps<typeof Select>

export const ClientSelect: FC<Props> = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const { data, isLoading } = useQuery<Client[]>(["clients"], async () => {
    const token = await getAccessTokenSilently();
    const res = await API.get(`/clients`, getRequestConfig(token));
    return res.data.data;
  });

  const options = useMemo(() => data?.map(client => ({
    value: client._id,
    label: `${client.name} (${client.website ?? client.email})`
  })) ?? [], [data]);
  return (
    <Select
      {...props}
      loading={isLoading}
      allowClear
      options={options}
    />
  );
};
