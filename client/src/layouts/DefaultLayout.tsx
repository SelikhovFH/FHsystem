import {FC} from "react";
import {Outlet} from "react-router-dom";

type Props = {}

export const DefaultLayout: FC<Props> = (props) => {
    return (
        <Outlet />
    )
}
