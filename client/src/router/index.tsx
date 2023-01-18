import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {ErrorPage} from "../pages/ErrorPage";
import {DefaultLayout} from "../layouts/DefaultLayout";
import {HomePage} from "../pages/HomePage";
import {AuthLayout} from "../layouts/AuthLayout";
import {AdminRoutes, AppRoutes, AuthRoutes} from "./AppRoutes";
import {BookDayOffPage} from "../pages/BookDayOffPage";
import {ProfilePage} from "../pages/ProfilePage";
import {ManageUsersPage} from "../pages/admin/ManageUsersPage";
import {ConfirmDayOffPage} from "../pages/admin/ConfirmDayOffPage";
import {LoginPage} from "../pages/auth/LoginPage";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            {/*    TODO authorized guard*/}
            <Route
                path="/"
                element={<DefaultLayout/>}
                errorElement={<ErrorPage/>}
            >
                <Route index element={<HomePage/>}/>
                <Route
                    path={AppRoutes.bookDayOff}
                    element={<BookDayOffPage/>}
                    // loader={contactLoader}
                    // action={contactAction}
                />
                <Route
                    path={AppRoutes.profile}
                    element={<ProfilePage/>}
                />
                {/*    TODO Admin role guard*/}
                <Route
                    path={AdminRoutes.manageUsers}
                    element={<ManageUsersPage/>}
                />
                <Route
                    path={AdminRoutes.confirmDayOff}
                    element={<ConfirmDayOffPage/>}
                />
            </Route>
            <Route element={<AuthLayout/>}>
                <Route
                    path={AuthRoutes.login}
                    element={<LoginPage/>}
                />
            </Route>
        </>
    )
);
