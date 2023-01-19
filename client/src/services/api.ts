import axios from 'axios';
import {useAuth0} from "@auth0/auth0-react";


export const useGetAxios = () => {
    const {getAccessTokenSilently} = useAuth0()
    const Axios = axios.create({
        baseURL: process.env.REACT_APP_API_SERVER_URL,
    });
    Axios.defaults.headers.common["Authorization"] = `Bearer ${getAccessTokenSilently()}`
    return Axios
}

