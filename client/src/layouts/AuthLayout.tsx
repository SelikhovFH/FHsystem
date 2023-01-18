import {FC} from "react";
import {Outlet} from "react-router-dom";

type Props = {}

export const AuthLayout: FC<Props> = (props) => {
    return (
        <Outlet />
    )
}
