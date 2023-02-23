import { ComponentProps, FC, useMemo } from "react";
import { Select } from "antd";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { Project } from "../../shared/project.interface";

type Props = ComponentProps<typeof Select>

export const ProjectSelect: FC<Props> = (props) => {
  const { getAccessTokenSilently } = useAuth0();
  const { data, isLoading } = useQuery<Project[]>(["/projects"], async () => {
    const token = await getAccessTokenSilently();
    // TODO dont forget about pagination later
    const res = await API.get(`/projects`, getRequestConfig(token));
    return res.data.data;
  });

  const options = useMemo(() => data?.map(projects => ({
    value: projects._id,
    label: projects.name
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
