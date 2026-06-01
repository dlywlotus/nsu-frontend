import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { jwtDecode } from 'jwt-decode';

export type AuthDetails = {
    userId: string;
    accessToken: string;
}

type AuthContext = {
    authDetails: AuthDetails | null
    getAuthDetails: () => Promise<AuthDetails | null>;
    setAuthDetails: React.Dispatch<React.SetStateAction<AuthDetails | null>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL
});

export const AuthContext = createContext<AuthContext>({
    authDetails: null,
    getAuthDetails: () => new Promise((resolve, _) => resolve(null)),
    setAuthDetails: () => { },
    isLoading: true,
    setIsLoading: () => { }
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    // Returns the authentication details of the user, refreshing the access token if it has expired
    const getAuthDetails = async () => {
        if (!authDetails) return null;

        const decodedToken = jwtDecode(authDetails.accessToken);
        if (!decodedToken.exp) {
            console.error("Expiration field is missing from access token!")
            return null;
        }

        // Check if access token has expired - decoded.exp is in seconds 
        if (Date.now() > (decodedToken.exp - 60) * 1000) {
            console.log("Access token expired")
            const res = await api.post("refresh_token", {}, { withCredentials: true })
            const newAuthDetails: AuthDetails = res.data;
            setAuthDetails(newAuthDetails);
            return newAuthDetails;
        } else {
            return authDetails;
        }
    }


    useEffect(() => {
        const fetchAuthDetails = async () => {
            try {
                const res = await api.post("/refresh_token", {}, { withCredentials: true })
                setAuthDetails(res.data);
            } catch (error) {
                console.log(axios.isAxiosError(error) ? error?.response?.data : error)
            } finally {
                setIsLoading(false);
            }
        };
        fetchAuthDetails();
    }, [])

    if (isLoading) {
        return <div style={{ height: "100svh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <LoadingSpinner isLoading={isLoading} />
        </div>
    }

    return (
        <AuthContext.Provider value={{ authDetails, getAuthDetails, setAuthDetails, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
