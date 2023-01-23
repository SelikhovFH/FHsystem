import {useAuth0} from "@auth0/auth0-react";
import {useQuery} from "react-query";
import {API} from "../services/api";

export const useMe = () => {
    const {getAccessTokenSilently, user} = useAuth0()
    console.log(user)
    const query = useQuery('/users/me', async () => {
        const token = await getAccessTokenSilently()
        const res = await API.get('/users/me', {headers: {"Authorization": `Bearer ${token}`}})
        return res.data
    })

    console.log(query)
}
