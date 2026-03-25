import { useContext } from "react";
import { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getMeAPI, loginAPI } from "../utils/api";


const Authcontext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            getMeAPI()
                .then((res) => setUser(res.data))
                .catch(() => logout())
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        setLoading(true)
        try {
            const res = await loginAPI({ email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            return res.data.user
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null)
    }

    return (
        <>
            <Authcontext.Provider value={{ user, login, logout, loading }}>
                {children}
            </Authcontext.Provider>
        </>
    )
};

export const useAuth = () => useContext(Authcontext)