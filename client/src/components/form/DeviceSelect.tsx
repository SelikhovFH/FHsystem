import { ComponentProps, FC, useMemo } from "react";
import { Select } from "antd";
import { useQuery } from "react-query";
import { API, getRequestConfig } from "../../services/api";
import { useAuth0 } from "@auth0/auth0-react";
import { DeviceResponse } from "../../shared/device.interface";

type Props = ComponentProps<typeof Select>

export const DeviceSelect: FC<Props> = (props) => {
    const { getAccessTokenSilently } = useAuth0();
    const { data, isLoading } = useQuery<DeviceResponse[]>(["/devices"], async () => {
        const token = await getAccessTokenSilently();
        // TODO dont forget about pagination later
        const res = await API.get(`/devices`, getRequestConfig(token));
        return res.data.data;
    });

    const options = useMemo(() => data?.map(item => ({
        value: item._id,
        label: `${item.name} ${item.assignedToId ? `(${item.assignedToUser.name} ${item.assignedToUser.surname} ${item.assignedToUser.email})` : ""}`,
        disabled: Boolean(item.assignedToId)
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
