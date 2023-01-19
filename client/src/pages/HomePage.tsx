import {FC} from "react";
import {useAuth0} from "@auth0/auth0-react";

type Props = {}

export const HomePage: FC<Props> = (props) => {
    const {user, isAuthenticated, isLoading,} = useAuth0();
    console.log(user)
    return (
        <div>
            <h1>
                Welcome to FHSystem
            </h1>
        </div>
    )
}
