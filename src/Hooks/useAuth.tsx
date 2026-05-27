import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { api } from './useAxiosInterceptor';

export type AuthDetails = {
    userId: string;
    accessToken: string;
}

type AuthContext = {
    authDetails: AuthDetails | null;
    setAuthDetails: React.Dispatch<React.SetStateAction<AuthDetails | null>>
}
export const AuthContext = createContext<AuthContext>({
    authDetails: null,
    setAuthDetails: () => { }
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);

    useEffect(() => {
        const fetchAuthDetails = async () => {
            try {
                const res = await api.post("/refresh_token", {}, { withCredentials: true })
                setAuthDetails(res.data);
            } catch (error) {
                console.log(axios.isAxiosError(error) ? error?.response?.data : error)
            }
        };
        fetchAuthDetails();
    }, [])

    return (
        <AuthContext.Provider value={{ authDetails, setAuthDetails }}>
            {children}
        </AuthContext.Provider>
    );
}
