import { MaterialCard } from "./MaterialCard";
import type { Material } from "./MaterialCard";
import { FileQuestion } from "lucide-react";

interface MaterialGridProps {
    materials: Material[];
    isLoading: boolean;
    onDelete?: (material: Material) => void;
    selectedIds?: Set<string>;
    onToggleSelection?: (id: string) => void;
    isSelectionMode?: boolean;
}

export function MaterialGrid({ materials, isLoading, onDelete, selectedIds, onToggleSelection, isSelectionMode }: MaterialGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden h-[180px] flex flex-col">
                        <div className="p-3 space-y-3 flex-1">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
                                <div className="flex gap-1">
                                    <div className="w-12 h-4 rounded-full bg-white/10 animate-pulse" />
                                    <div className="w-8 h-4 rounded-full bg-white/10 animate-pulse" />
                                </div>
                            </div>
                            <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse mt-4" />
                        </div>
                        <div className="p-3 pt-0 flex gap-2">
                            <div className="flex-1 h-9 rounded bg-white/10 animate-pulse" />
                            <div className="flex-1 h-9 rounded bg-white/10 animate-pulse" />
                        </div>
                    </div>
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
                <MaterialCard
                    key={material.id}
                    material={material}
                    onDelete={onDelete}
                    isSelected={selectedIds?.has(material.id)}
                    isSelectionMode={isSelectionMode}
                    onToggleSelection={onToggleSelection}
                />
            ))}
        </div>
    );
}
