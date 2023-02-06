import {ComponentProps, FC, useMemo} from "react";
import {Select} from "antd";
import {useQuery} from "react-query";
import {API, getRequestConfig} from "../../services/api";
import {useAuth0} from "@auth0/auth0-react";
import {Item} from "../../shared/item.interface";

type Props = ComponentProps<typeof Select>

export const ItemSelect: FC<Props> = (props) => {
    const {getAccessTokenSilently} = useAuth0()
    const {data, isLoading} = useQuery<Item[]>(["/items"], async () => {
        const token = await getAccessTokenSilently()
        // TODO dont forget about pagination later
        const res = await API.get(`/items`, getRequestConfig(token))
        return res.data.data
    },)

    const options = useMemo(() => data?.map(item => ({
        value: item._id,
        label: `${item.name} ${item.size || ''} (${item.quantity})`,
        disabled: item.quantity <= 0
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
