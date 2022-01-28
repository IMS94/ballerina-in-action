import { useAuthContext } from "@asgardeo/auth-react";
import axios from "axios";

const client = axios.create({
    baseURL: "http://localhost:8080/"
});

const secureClient = axios.create({
    baseURL: "http://localhost:8080/",
});

let token;

secureClient.interceptors.request.use((config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

function setToken(authToken) {
    token = authToken;
}


export {
    client,
    secureClient,
    setToken
}
