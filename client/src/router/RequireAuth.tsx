import {FC} from "react";
import {withAuthenticationRequired} from "@auth0/auth0-react";
import {Loader} from "../components/Loader";
import {Outlet} from "react-router-dom";

export const RequireAuth: FC = ({}) => {
    const Component = withAuthenticationRequired(Outlet, {
        onRedirecting: () => <Loader/>,
    });

    return <Component/>;
};