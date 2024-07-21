import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, user: null, isadmin: false, superUser: false });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8080/check-auth', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.isAuthenticated) {
                    setAuth({
                        isAuthenticated: true,
                        user: data.user,
                        isadmin: data.user.isadmin || false, 
                    });
                } else {
                    setAuth({ isAuthenticated: false, user: null, isadmin: false });
                }
            } catch (error) {
                console.error('Error fetching auth status:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
