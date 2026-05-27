import axios from "axios";
import { useContext, useEffect } from "react"
import { AuthContext, AuthDetails } from "./useAuth";
import { jwtDecode } from "jwt-decode";

export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL
});

export const protectedApi = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL
});

const AxiosInterceptorProvider = ({ children }: { children: React.ReactNode }) => {
    const { authDetails, setAuthDetails } = useContext(AuthContext);

    useEffect(() => {
        if (!authDetails?.accessToken) return;

        const tokenInjector = protectedApi.interceptors.request.use(
            async function (config) {
                try {
                    const decoded = jwtDecode(authDetails?.accessToken);
                    if (!decoded.exp) return config;

                    // Check if access token has expired - decoded.exp is in seconds 
                    if (Date.now() > (decoded.exp - 60) * 1000) {
                        console.log("Access token expired")
                        const res = await api.post("refresh_token", {}, { withCredentials: true })
                        const newAuthDetails: AuthDetails = res.data;
                        config.headers.Authorization = `Bearer ${newAuthDetails.accessToken}`;
                        setAuthDetails(newAuthDetails);
                    } else {
                        config.headers.Authorization = `Bearer ${authDetails.accessToken}`;
                    }
                } catch (error) {
                    console.log(axios.isAxiosError(error) ? error?.response?.data : error)
                }
                return config;
            },
            null,
            {}
        );

        return () => {
            api.interceptors.request.eject(tokenInjector);
        }

    }, [authDetails?.accessToken])


    return children;

}

export default AxiosInterceptorProvider;