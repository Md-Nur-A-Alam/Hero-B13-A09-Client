export default function Spinner({ fullPage = false }) {
    return (
        <div className={`flex items-center justify-center w-full ${fullPage ? "min-h-[calc(100vh-4rem)]" : "min-h-[200px]"}`}>
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
}
