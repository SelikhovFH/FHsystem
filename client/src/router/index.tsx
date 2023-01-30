import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {ErrorPage} from "../pages/ErrorPage";
import {DefaultLayout} from "../layouts/DefaultLayout";
import {HomePage} from "../pages/HomePage";
import {AdminRoutes, AppRoutes, EditorRoutes} from "./AppRoutes";
import {BookDayOffPage} from "../pages/BookDayOffPage";
import {ProfilePage} from "../pages/ProfilePage";
import {ManageUsersPage} from "../pages/admin/ManageUsersPage";
import {ConfirmDayOffPage} from "../pages/editor/ConfirmDayOffPage";
import {RequireAuth} from "../wrappers/RequireAuth";
import RequireAdmin from "../wrappers/RequireAdmin";
import RequireEditor from "../wrappers/RequireEditor";
import {HolidaysAndCelebrationsPage} from "../pages/editor/HolidaysAndCelebrations";

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
                    <Route element={<RequireEditor/>}>
                        <Route
                            path={EditorRoutes.confirmDayOff}
                            element={<ConfirmDayOffPage/>}
                        />
                        <Route
                            path={EditorRoutes.holidaysAndCelebrations}
                            element={<HolidaysAndCelebrationsPage/>}
                        />
                    </Route>
                    <Route element={<RequireAdmin/>}>
                        <Route
                            path={AdminRoutes.manageUsers}
                            element={<ManageUsersPage/>}
                        />
                    </Route>
                </Route>
            </Route>
        </>
    )
);
