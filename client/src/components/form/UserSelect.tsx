import { ComponentProps, FC, useMemo } from "react";
import { Select } from "antd";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../../shared/user.interface";

type Props = ComponentProps<typeof Select>

export const UserSelect: FC<Props> = (props) => {
    const {getAccessTokenSilently} = useAuth0()
    const {data, isLoading} = useQuery<User[]>(["users"], async () => {
        const token = await getAccessTokenSilently();
      const res = await API.get(`/users/display_info`, getRequestConfig(token));
        return res.data.data
    },)

    const options = useMemo(() => data?.map(user => ({
      value: user._id,
      label: `${user.name} ${user.surname} (${user.email})`
    })) ?? [], [data])
    return (
        <Select
            {...props}
            loading={isLoading}
            allowClear
            options={options}
        />
    )
}
