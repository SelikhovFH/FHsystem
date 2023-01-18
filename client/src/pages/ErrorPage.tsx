import {FC} from "react";
import {useRouteError} from "react-router-dom";

type Props = {}

export const ErrorPage: FC<Props> = (props) => {
    const error: any = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    )
}
