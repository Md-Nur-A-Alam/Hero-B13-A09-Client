"use client";

import { useEffect, useState, useRef } from "react";
import { fetchStats } from "../../actions/carActions";
import { FaCar, FaCalendarCheck, FaUsers } from "react-icons/fa";

function CountUp({ target, duration = 1800 }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started || target === 0) return;
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [started, target, duration]);

    return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsBar() {
    const [stats, setStats] = useState({ totalCars: 0, totalBookings: 0, totalUsers: 0 });

    useEffect(() => {
        fetchStats()
            .then(setStats)
            .catch(() => {});
    }, []);

    const statItems = [
        {
            icon: <FaCar className="w-7 h-7 text-indigo-500" />,
            label: "Vehicles Listed",
            value: stats.totalCars,
            suffix: "+"
        },
        {
            icon: <FaCalendarCheck className="w-7 h-7 text-violet-500" />,
            label: "Bookings Completed",
            value: stats.totalBookings,
            suffix: "+"
        },
        {
            icon: <FaUsers className="w-7 h-7 text-sky-500" />,
            label: "Happy Renters",
            value: stats.totalUsers,
            suffix: "+"
        }
    ];

    return (
        <section className="py-14 bg-white dark:bg-black border-y border-zinc-100 dark:border-zinc-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {statItems.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                                {item.icon}
                            </div>
                            <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                                <CountUp target={item.value} />
                                <span className="text-indigo-500">{item.suffix}</span>
                            </p>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
