import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "@ant-design/flowchart/dist/index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Auth0Provider } from "@auth0/auth0-react";
import Auth0Ready from "./wrappers/Auth0Ready";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./services/queryClient";
import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import dayOfYear from "dayjs/plugin/dayOfYear";

dayjs.extend(dayOfYear);
dayjs.extend(isBetween);


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENTID!}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE!}
      redirectUri={process.env.REACT_APP_ATH0_REDIRECT_URI!}
      scope="openid profile email admin:admin editor:editor"
      useRefreshTokens={true}
      cacheLocation={"localstorage"}
    >
      <QueryClientProvider client={queryClient}>
        <Auth0Ready>
          <RouterProvider router={router} />
        </Auth0Ready>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
