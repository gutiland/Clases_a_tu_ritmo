import { createContext, useContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider=({children})=>{

    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')

    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null)
    const [token, setToken] = useState(storedToken || null)

    const login =(userData, tokenData)=>{
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', tokenData)

        setUser(userData)
        setToken(tokenData)
    }

    const logout =(userData, tokenData)=>{
            localStorage.removeItem('user')
            localStorage.removeItem('token')

            setUser(null)
            setToken(null)
        }

    const value ={
        user,
        token,
        login,
        logout,
        isAuthenticated: Boolean(token),
        isTrainer: user?.role === 'trainer' || user?.role === 'admin',
        isAdmin: user?.role === 'admin'
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
    }

    export const useAuth=()=>{
        return useContext(AuthContext)
    }
