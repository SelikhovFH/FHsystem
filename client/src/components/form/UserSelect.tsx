import {FC, useMemo} from "react";
import {Select} from "antd";
import {useQuery} from "react-query";
import {API, getRequestConfig} from "../../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {User} from "../../shared/user.interface";

type Props = React.ComponentProps<typeof Select>

export const UserSelect: FC<Props> = (props) => {
    const {getAccessTokenSilently} = useAuth0()
    const {data, isLoading} = useQuery<User[]>(["users"], async () => {
        const token = await getAccessTokenSilently()
        // TODO dont forget about pagination later
        const res = await API.get(`/users?page=${0}&per_page=${100}`, getRequestConfig(token))
        return res.data.data
    },)
    // @ts-ignore TODO check if this will work after user updates

    const options = useMemo(() => data?.map(user => ({
        value: user.user_metadata.db_id,
        label: user.email
    })) ?? [], [data])
    console.log(options)
    return (
        <Select
            {...props}
            loading={isLoading}
            allowClear
            options={options}
        />
    )
}
