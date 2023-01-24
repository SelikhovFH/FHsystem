import axios from "axios";


export const API = axios.create({
    baseURL: process.env.REACT_APP_API_SERVER_URL,
});

export const getRequestConfig = (token: string) => ({
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
