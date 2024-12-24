import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const getUserDetails = () => {
        try {
            return JSON.parse(localStorage.getItem("UserDetails")) || null;
        } catch (error) {
            console.error("Error parsing user details:", error);
            return null;
        }
    };

    useEffect(() => {
        const userDetails = getUserDetails();
        const tokenExpiry = userDetails?.expiry;

        if (tokenExpiry && tokenExpiry > new Date().getTime()) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            localStorage.removeItem("UserDetails"); // Clear expired data
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("UserDetails");
        setIsLoggedIn(false);
        setTimeout(() => navigate("/login"), 0);
    };

    const login = (details) => {
        const expiryTime = new Date().getTime() + 12 * 60 * 60 * 1000; // 12 hours
        const userDetailsWithExpiry = {
            ...details,
            expiry: expiryTime,
        };
        localStorage.setItem("UserDetails", JSON.stringify(userDetailsWithExpiry));
        setIsLoggedIn(true);
    };

    useEffect(() => {
        const checkTokenExpiry = () => {
            const userDetails = getUserDetails();
            const tokenExpiry = userDetails?.expiry;

            if (tokenExpiry && tokenExpiry <= new Date().getTime()) {
                logout();
            }
        };

        checkTokenExpiry(); // Initial check
        const interval = setInterval(checkTokenExpiry, 3600 * 1000); // Re-check every minute

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
