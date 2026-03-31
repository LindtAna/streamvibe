import { useState, createContext, useEffect } from 'react'


const AuthContext = createContext({})


export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
       // Initialisierung aus localStorage beim loading
        const savedUser = localStorage.getItem('user')
        return savedUser ? JSON.parse(savedUser) : null
    })

   // Synchronisiert mit localStorage bei auth-Änderungen
    useEffect(() => {
        if (auth) {
            localStorage.setItem('user', JSON.stringify(auth))
        } else {
            localStorage.removeItem('user')
        }
    }, [auth])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext