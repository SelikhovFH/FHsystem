import {FC, useEffect} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";

type Props = {}

export const HomePage: FC<Props> = (props) => {
    const {user, isAuthenticated, isLoading,} = useAuth0();
    const {getAccessTokenSilently} = useAuth0()
    useEffect(() => {
        const f = async () => {
            const token = await getAccessTokenSilently()
            const res = await axios.get(process.env.REACT_APP_API_SERVER_URL!, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(res)
        }
        f()
    }, [])
    return (
        <div>
            <h1>
                Welcome to FHSystem
            </h1>
        </div>
    )
}
