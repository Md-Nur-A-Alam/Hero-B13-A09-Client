"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const data = await apiFetch("/api/auth/me");
                if (data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Session check failed:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    useEffect(() => {
        if (loading) return;
        
        const privateRoutes = ["/my-bookings", "/my-cars", "/add-car"];
        const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));
        
        if (isPrivateRoute && !user) {
            router.push("/login");
        }
    }, [user, loading, pathname, router]);

    const register = async (name, email, photoUrl, password) => {
        setLoading(true);
        try {
            const data = await apiFetch("/api/auth/register", {
                method: "POST",
                body: { name, email, photoUrl, password }
            });
            return data;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await apiFetch("/api/auth/login", {
                method: "POST",
                body: { email, password }
            });
            if (data.success && data.user) {
                setUser(data.user);
                router.push("/");
            }
            return data;
        } finally {
            setLoading(false);
        }
    };

    const googleLogin = async (profile) => {
        setLoading(true);
        try {
            const data = await apiFetch("/api/auth/google", {
                method: "POST",
                body: profile
            });
            if (data.success && data.user) {
                setUser(data.user);
                router.push("/");
            }
            return data;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            router.push("/login");
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
