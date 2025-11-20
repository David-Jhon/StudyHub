import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function Header({ onUploadClick }: { onUploadClick: () => void }) {
    return (
        <header className="sticky top-0 z-40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white grid place-items-center shadow-md shadow-indigo-600/30">
                                <svg
                                    width="120"
                                    height="120"
                                    viewBox="0 0 120 120"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                >
                                    <rect width="120" height="120" rx="24" fill="#6366F1" />
                                    <rect x="28" y="36" width="64" height="48" rx="8" fill="#fff" />
                                    <rect x="33" y="41" width="54" height="38" rx="4" fill="#EEF2FF" />
                                    <path
                                        d="m50 65.5 8 7.5 16-16"
                                        stroke="#6366F1"
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <rect x="36" y="54" width="18" height="3" rx="1.5" fill="#A5B4FC" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                                    StudyHub
                                </h1>
                                <p className="text-xs text-slate-400">
                                    Share. Learn. Grow.
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-1 ml-6">
                                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 h-8 text-sm">
                                    Home
                                </Button>
                                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 h-8 text-sm">
                                    Materials
                                </Button>
                                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/5 h-8 text-sm">
                                    Community
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={onUploadClick}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 rounded-xl"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
