import { createContext, useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';


export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            setUser({token})
        }
        // console.log(token)
    },[]);

    const login = (token) => {
        localStorage.setItem('token', token);
        setUser({token});
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null)
        navigate('/login')
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
    
}