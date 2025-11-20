import { MaterialCard } from "./MaterialCard";
import type { Material } from "./MaterialCard";
import { FileQuestion } from "lucide-react";

interface MaterialGridProps {
    materials: Material[];
    isLoading: boolean;
    onDelete?: (material: Material) => void;
}

export function MaterialGrid({ materials, isLoading, onDelete }: MaterialGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-[200px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        );
    }

    if (materials.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <FileQuestion className="w-12 h-12 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">No materials found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Upload your first file to get started, or try adjusting your search filters.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {materials.map((material) => (
                <MaterialCard key={material.id} material={material} onDelete={onDelete} />
            ))}
        </div>
    );
}
