import { Button, Result } from "antd";
import { FC } from "react";
import { Link, useRouteError } from "react-router-dom";
import { AppRoutes } from "../router/AppRoutes";

type Props = {}

export const ErrorPage: FC<Props> = (props) => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <Result
        status={error.status ?? "Error"}
        title={error.message}
        subTitle="Sorry, the page you visited does not exist."
        extra={<Link to={AppRoutes.index}><Button type="primary">Back Home</Button></Link>}
      />
    </div>
  )
}
