"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-zinc-50 dark:bg-black border-t border-zinc-200/50 dark:border-zinc-800/50 transition-colors duration-300 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand column */}
                    <div className="space-y-4">
                        <Link href="/" className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-500 text-transparent bg-clip-text">
                            DriveFleet
                        </Link>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Rent the perfect car for your next journey. Premium service, flexible booking options, and verified listings.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-150 uppercase tracking-wider mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Explore Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    Register
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-150 uppercase tracking-wider mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <span>123 Rental Ave, Suite 100, Cityville</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <span>+1 (555) 019-2834</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                                <span>support@drivefleet.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social links */}
                    <div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-150 uppercase tracking-wider mb-4">
                            Follow Us
                        </h4>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Facebook size={18} />
                            </a>
                            {/* X (Twitter) Logo replacing the old bird */}
                            <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="X (formerly Twitter)">
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center text-xs text-zinc-500 dark:text-zinc-500">
                    &copy; {new Date().getFullYear()} DriveFleet Car Rental. All rights reserved. Recruiter-friendly assignment portfolio.
                </div>
            </div>
        </footer>
    );
}
