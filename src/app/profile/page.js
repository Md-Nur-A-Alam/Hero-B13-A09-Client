"use client";

import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, Calendar, Edit3, Image, Upload, Check, X, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
    const { user, loading: authLoading, updateProfile } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
        if (user) {
            setName(user.name || "");
            setPhotoUrl(user.photoUrl || "");
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return <Spinner fullPage />;
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Size check (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large. Maximum size is 5MB.");
            return;
        }

        setUploading(true);
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "91a7be74f122f97a1b69d3f8818a160b";
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload failed");
            
            const data = await res.json();
            if (data?.data?.url) {
                setPhotoUrl(data.data.url);
                toast.success("Profile photo uploaded successfully!");
            } else {
                throw new Error("Invalid response structure from ImgBB");
            }
        } catch (error) {
            console.error("ImgBB upload error:", error);
            toast.error("Failed to upload image. Please try again or paste a URL.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name is required");
            return;
        }

        setSaveLoading(true);
        try {
            await updateProfile(name, photoUrl);
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || "Failed to update profile.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleCancel = () => {
        setName(user.name || "");
        setPhotoUrl(user.photoUrl || "");
        setIsEditing(false);
    };

    return (
        <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-black/95 transition-colors duration-300">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        Manage your profile details, avatar, and system role.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-xl overflow-hidden">
                    {/* Cover Banner Decoration */}
                    <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
                    </div>

                    <div className="px-6 pb-8 sm:px-10 relative">
                        {/* Profile Photo Display */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-8 gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                                <div className="relative group">
                                    <img
                                        src={photoUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80"}
                                        alt={user.name}
                                        className="w-28 h-28 rounded-full border-4 border-white dark:border-zinc-950 object-cover shadow-md bg-zinc-100 dark:bg-zinc-900"
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" }}
                                    />
                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 rounded-full cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={20} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full text-white text-xs font-semibold">
                                            Uploading...
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                        {user.name}
                                    </h2>
                                    <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 capitalize">
                                            <Shield size={12} />
                                            {user.role || "User"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl transition-all shadow-sm"
                                >
                                    <Edit3 size={15} /> Edit Profile
                                </button>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            {!isEditing ? (
                                <motion.div
                                    key="view-profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                                        <div className="flex items-start gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-2xl">
                                            <User className="text-indigo-500 mt-0.5 flex-shrink-0" size={20} />
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Full Name</span>
                                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.name}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-2xl">
                                            <Mail className="text-indigo-500 mt-0.5 flex-shrink-0" size={20} />
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Email Address</span>
                                                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{user.email}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-2xl">
                                            <Shield className="text-indigo-500 mt-0.5 flex-shrink-0" size={20} />
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">System Access Role</span>
                                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{user.role || "User"}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-zinc-50/50 dark:bg-zinc-900/10 border border-zinc-100 dark:border-zinc-900 rounded-2xl">
                                            <Calendar className="text-indigo-500 mt-0.5 flex-shrink-0" size={20} />
                                            <div className="space-y-0.5">
                                                <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Profile Photo URL</span>
                                                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate block max-w-[200px]" title={user.photoUrl}>
                                                    {user.photoUrl || <span className="text-zinc-300 italic">None set</span>}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="edit-profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    onSubmit={handleSave}
                                    className="space-y-6 pt-4 border-t border-zinc-100 dark:border-zinc-900"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                                placeholder="Enter full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                                Profile Photo Source
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex flex-col justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-indigo-500 transition-colors">
                                                    <div className="text-center space-y-2">
                                                        <Upload className="mx-auto text-zinc-400" size={24} />
                                                        <span className="text-xs font-semibold text-zinc-500 block">
                                                            {uploading ? "Uploading file..." : "Upload Profile Picture"}
                                                        </span>
                                                        <label className="inline-block px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold cursor-pointer hover:bg-indigo-100 transition-colors">
                                                            Select File
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                className="hidden"
                                                                disabled={uploading || saveLoading}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                                    <div>
                                                        <span className="text-xs font-bold text-zinc-500 flex items-center gap-1 mb-1.5">
                                                            <Image size={13} /> Or Paste Image URL
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={photoUrl}
                                                            onChange={(e) => setPhotoUrl(e.target.value)}
                                                            className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs text-zinc-850 dark:text-zinc-150 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                                            placeholder="Paste raw photo URL (e.g. https://...)"
                                                            disabled={uploading || saveLoading}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-zinc-400 mt-2 block">
                                                        Accepts all direct image formats (PNG, JPG, WebP, etc.).
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-900">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex items-center gap-1.5 px-4.5 py-2.5 text-sm font-semibold rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                                            disabled={uploading || saveLoading}
                                        >
                                            <X size={15} /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={uploading || saveLoading}
                                            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                                        >
                                            {saveLoading ? (
                                                "Saving..."
                                            ) : (
                                                <>
                                                    <Check size={15} /> Save Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
