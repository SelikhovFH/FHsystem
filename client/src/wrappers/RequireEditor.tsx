import React, {FC} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {Outlet, useNavigate} from "react-router-dom";
import {AppRoutes} from "../router/AppRoutes";
import {UserRole} from "../shared/user.interface";

export const useIsEditor = () => {
    const {user,} = useAuth0();
    return user?.role === UserRole.admin || user?.role === UserRole.editor
}
const RequireEditor: FC = () => {
    const isEditor = useIsEditor()
    const navigate = useNavigate()
    if (!isEditor) {
        navigate(AppRoutes.index);
        return null
    }
    return <Outlet/>;
};
export default RequireEditor;
