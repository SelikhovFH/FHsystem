import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { ErrorPage } from "../pages/ErrorPage";
import { DefaultLayout } from "../layouts/DefaultLayout";
import { HomePage } from "../pages/HomePage";
import { AdminRoutes, AppRoutes, EditorRoutes } from "./AppRoutes";
import { BookDayOffPage } from "../pages/BookDayOffPage";
import { MyProfilePage } from "../pages/MyProfilePage";
import { ManageUsersPage } from "../pages/admin/ManageUsersPage";
import { ConfirmDayOffPage } from "../pages/editor/ConfirmDayOffPage";
import { RequireAuth } from "../wrappers/RequireAuth";
import RequireAdmin from "../wrappers/RequireAdmin";
import RequireEditor from "../wrappers/RequireEditor";
import { HolidaysAndCelebrationsPage } from "../pages/editor/HolidaysAndCelebrations";
import { ManageDevicesPage } from "../pages/editor/ManageDevices";
import { ManageItemsPage } from "../pages/editor/ManageItems";
import { ManageDeliveriesPage } from "../pages/editor/ManageDeliveries";
import { UserProfilePage } from "../pages/admin/UserProfilePage";

// TODO Dynamic module import

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
                      element={<MyProfilePage />}
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
                        <Route
                            path={EditorRoutes.manageDevices}
                            element={<ManageDevicesPage/>}
                        />
                        <Route
                            path={EditorRoutes.manageItems}
                            element={<ManageItemsPage/>}
                        />
                        <Route
                          path={EditorRoutes.manageDeliveries}
                          element={<ManageDeliveriesPage />}
                        />
                    </Route>
                    <Route element={<RequireAdmin />}>
                        <Route
                          path={AdminRoutes.manageUsers}
                          element={<ManageUsersPage />}
                        />
                        <Route
                          path={AdminRoutes.user}
                          element={<UserProfilePage />}
                        />
                    </Route>
                </Route>
            </Route>
        </>
    )
);
