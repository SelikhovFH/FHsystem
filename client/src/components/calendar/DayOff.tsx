import {FC} from "react";
import {DayOff as DayOffType, DayOffStatus} from "../../shared/dayOff.interface";
import {StatusLabels, TypeLabels} from "../../sections/dayOff";
import {theme, Typography} from "antd";

type Props = {
    dayOff: Pick<DayOffType, 'status' | 'type'>
}

const {Text} = Typography

export const DayOff: FC<Props> = ({dayOff}) => {
    const {token} = theme.useToken()
    const {status, type} = dayOff
    const getColorForStatus = () => {
        switch (status) {
            case DayOffStatus.pending:
                return token.colorInfoBg
            case DayOffStatus.approved:
                return token.colorSuccessBg
            case DayOffStatus.declined:
                return token.colorErrorBg
        }
    }

    return (
        <div style={{
            background: getColorForStatus(),
            height: "100%",
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center'
        }}>
            <Text>{TypeLabels[type]}</Text>
            <Text italic>{StatusLabels[status]}</Text>
        </div>
    );
}
