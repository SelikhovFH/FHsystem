import React, {FC} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {Outlet, useNavigate} from "react-router-dom";
import {AppRoutes} from "../router/AppRoutes";
import {UserRole} from "../shared/user.interface";


export const useIsAdmin = () => {
    const {user,} = useAuth0();
    return user?.role === UserRole.admin
}

const RequireAdmin: FC = () => {
    const isAdmin = useIsAdmin()
    const navigate = useNavigate()
    if (!isAdmin) {
        navigate(AppRoutes.index);
        return null
    }
    return <Outlet/>;
};
export default RequireAdmin;
