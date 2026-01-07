import { createContext, useEffect, useState } from "react";
import axiosConfig from '../config/api';

const AuthContext = createContext(null);

export default function UserProvider({children}) {
    const [user , setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const login = (userData) => setUser(userData);

    const logout = async () => {
        setLoading(true);

        try {
            await axiosConfig.post('/logout');

            setLoading(false);

            setUser(null);
        } catch {
           setLoading(false);  

           setUser(null);
        } 
    };

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);

            try {
                const result = await axiosConfig.get('/me');

                setUser(result.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [])

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext }

