"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
    const { login, googleLogin, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // Initialize Google Sign-In
        const initGoogle = () => {
            if (typeof window !== "undefined" && window.google) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: "759718894379-bm4ph319iktfqj36e1f54q2790dmbjlj.apps.googleusercontent.com",
                        callback: handleGoogleCredentialResponse
                    });
                    
                    const btn = document.getElementById("google-signin-btn");
                    if (btn) {
                        window.google.accounts.id.renderButton(btn, {
                            theme: "outline",
                            size: "large",
                            width: "100%",
                            shape: "circle",
                            text: "signin_with"
                        });
                    }
                } catch (e) {
                    console.error("Google script initialization failed", e);
                }
            }
        };

        // Retry if script loads slowly
        const timer = setTimeout(initGoogle, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleGoogleCredentialResponse = async (response) => {
        try {
            const tokenParts = response.credential.split('.');
            const payload = JSON.parse(atob(tokenParts[1].replace(/-/g, '+').replace(/_/g, '/')));
            
            const profile = {
                name: payload.name,
                email: payload.email,
                photoUrl: payload.picture
            };

            await googleLogin(profile);
            toast.success(`Welcome, ${profile.name}!`);
        } catch (err) {
            console.error("Google Sign-In Error:", err);
            toast.error(err.message || "Google Sign-In failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            return toast.error("Please fill in all fields.");
        }

        try {
            await login(email, password);
            toast.success("Welcome back!");
        } catch (err) {
            toast.error(err.message || "Failed to login. Please try again.");
        }
    };

    return (
        <section className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-8 sm:p-10 rounded-3xl shadow-xl"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Log in to manage your vehicle rentals.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Email Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : (
                            <>
                                <LogIn size={18} /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="relative flex items-center justify-center py-2">
                    <hr className="w-full border-zinc-200 dark:border-zinc-800" />
                    <span className="absolute bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-500">
                        Or continue with
                    </span>
                </div>

                {/* Google Sign-in Button */}
                <div className="flex justify-center">
                    <div id="google-signin-btn" className="w-full"></div>
                </div>

                <div className="text-center pt-2">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="inline-flex items-center gap-0.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Register <ArrowRight size={14} />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
