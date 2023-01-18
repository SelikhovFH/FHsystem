import {createBrowserRouter, createRoutesFromElements, Route, Routes} from "react-router-dom";
import {ErrorPage} from "../pages/ErrorPage";
import {DefaultLayout} from "../layouts/DefaultLayout";
import {HomePage} from "../pages/HomePage";
import {AuthLayout} from "../layouts/AuthLayout";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Routes>
            <Route
                path="/"
                element={<DefaultLayout/>}
                errorElement={<ErrorPage/>}
            >
                <Route index element={<HomePage/>}/>
                <Route
                    path="book_day_off"
                    element={<Contact/>}
                    loader={contactLoader}
                    action={contactAction}
                />
            </Route>
            <Route element={<AuthLayout/>}>

            </Route>
        </Routes>
    )
);
