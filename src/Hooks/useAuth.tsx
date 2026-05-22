import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export type AuthDetails = {
    userId: string;
    accessToken: string;
}

type AuthContext = {
    authDetails: AuthDetails | null;
    setAuthDetails: React.Dispatch<React.SetStateAction<AuthDetails | null>>
}

export const AuthContext = createContext<AuthContext>({ authDetails: null, setAuthDetails: () => { } });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);

    useEffect(() => {
        const getAuthDetails = async () => {
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_SERVER_API_URL}/refresh_token`, {}, {
                    withCredentials: true
                });
                setAuthDetails(res.data);
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
        };
        getAuthDetails();
    }, [])

    return (
        <AuthContext.Provider value={{ authDetails, setAuthDetails }}>
            {children}
        </AuthContext.Provider>
    );
}
