import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css';
import reportWebVitals from './reportWebVitals';
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import {Auth0Provider} from "@auth0/auth0-react";
import Auth0Ready from "./wrappers/Auth0Ready";
import {QueryClient, QueryClientProvider} from "react-query";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const queryClient = new QueryClient()
root.render(
    <React.StrictMode>
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN!}
            clientId={process.env.REACT_APP_AUTH0_CLIENTID!}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE!}
            redirectUri={process.env.REACT_APP_ATH0_REDIRECT_URI!}
            scope="openid profile email"
            useRefreshTokens={true}
            cacheLocation={"localstorage"}
        >
            <QueryClientProvider client={queryClient}>
                <Auth0Ready>
                    <RouterProvider router={router}/>
                </Auth0Ready>
            </QueryClientProvider>
        </Auth0Provider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
