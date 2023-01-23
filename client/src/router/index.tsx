import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {ErrorPage} from "../pages/ErrorPage";
import {DefaultLayout} from "../layouts/DefaultLayout";
import {HomePage} from "../pages/HomePage";
import {AdminRoutes, AppRoutes} from "./AppRoutes";
import {BookDayOffPage} from "../pages/BookDayOffPage";
import {ProfilePage} from "../pages/ProfilePage";
import {ManageUsersPage} from "../pages/admin/ManageUsersPage";
import {ConfirmDayOffPage} from "../pages/admin/ConfirmDayOffPage";
import {RequireAuth} from "../wrappers/RequireAuth";
import RequireAdmin from "../wrappers/RequireAdmin";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<RequireAuth/>}>

                <Route
                    path="/"
                    element={<DefaultLayout/>}
                    errorElement={<ErrorPage/>}
                >
                    <Route index element={<HomePage/>}/>
                    <Route
                        path={AppRoutes.bookDayOff}
                        element={<BookDayOffPage/>}
                    />
                    <Route
                        path={AppRoutes.profile}
                        element={<ProfilePage/>}
                    />
                    <Route element={<RequireAdmin/>}>
                        <Route
                            path={AdminRoutes.manageUsers}
                            element={<ManageUsersPage/>}
                        />
                        <Route
                            path={AdminRoutes.confirmDayOff}
                            element={<ConfirmDayOffPage/>}
                        />
                    </Route>
                </Route>
            </Route>
        </>
    )
);
