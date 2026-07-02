"use client";

import { useEffect, useState } from "react";
import { fetchCars } from "../../actions/carActions";
import CarCard from "../../components/cars/CarCard";
import Spinner from "../../components/common/Spinner";
import { Search, Filter, RefreshCw } from "lucide-react";

export default function ExploreCarsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");

    const carTypes = ["SUV", "Sedan", "Hatchback", "Luxury", "Truck", "Van", "Hybrid", "Electric"];

    const getCars = async () => {
        setLoading(true);
        try {
            const data = await fetchCars(search, type);
            setCars(data);
        } catch (error) {
            console.error("Failed to fetch cars:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCars();
    }, [type]); // Trigger on type filter change automatically

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        getCars();
    };

    const handleReset = () => {
        setSearch("");
        setType("");
        // Setting state updates trigger fetch in useEffect by checking
        // But since search is manually submitted, let's call fetch directly
        setTimeout(async () => {
            setLoading(true);
            try {
                const data = await fetchCars("", "");
                setCars(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 50);
    };

    return (
        <section className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center sm:text-left space-y-2">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Explore Our Vehicles
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Search or filter our high-performance cars to find the perfect rental.
                    </p>
                </div>

                {/* Search & Filter Controls */}
                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 p-4 sm:p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                                <Search size={18} />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search cars by name..."
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shrink-0"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex w-full md:w-auto items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                        {/* Type Select */}
                        <div className="relative flex-1 sm:flex-initial w-full sm:w-48">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                                <Filter size={16} />
                            </span>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full pl-9 pr-8 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 text-sm transition-all appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-150">All Types</option>
                                {carTypes.map((t) => (
                                    <option key={t} value={t} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-150">{t}</option>
                                ))}
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 pointer-events-none text-[10px]">
                                ▼
                            </span>
                        </div>

                        {/* Reset Filters */}
                        <button
                            onClick={handleReset}
                            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all flex items-center justify-center gap-1.5 font-semibold text-sm shrink-0"
                            title="Reset filters"
                        >
                            <RefreshCw size={16} />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <Spinner />
                ) : cars.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl">
                        <p className="text-zinc-500 dark:text-zinc-400">No cars match your search criteria.</p>
                        <button
                            onClick={handleReset}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-sm"
                        >
                            Clear search and filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <CarCard key={car._id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
