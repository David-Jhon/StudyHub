import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File, title: string) => Promise<void>;
    initialFile?: File | null;
}

export function UploadModal({
    isOpen,
    onClose,
    onUpload,
    initialFile,
}: UploadModalProps) {
    const [file, setFile] = useState<File | null>(initialFile || null);
    const [title, setTitle] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialFile) {
            setFile(initialFile);
            setTitle(initialFile.name);
        }
    }, [initialFile]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (!title) setTitle(selectedFile.name);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            if (!title) setTitle(droppedFile.name);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        try {
            setIsUploading(true);
            await onUpload(file, title);
            onClose();
            // Reset state
            setFile(null);
            setTitle("");
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-xl bg-zinc-950 text-zinc-50 border-zinc-800"
                onInteractOutside={(e) => {
                    e.preventDefault();
                    onClose();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Upload material</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Drag Zone */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 cursor-pointer transition-all select-none",
                            isDragging
                                ? "border-indigo-500 bg-indigo-500/10"
                                : "border-slate-700 bg-slate-900/50 hover:bg-slate-900",
                            file ? "border-indigo-500/50" : ""
                        )}
                    >
                        {file ? (
                            <div className="text-center">
                                <FileText className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                                <p className="text-indigo-300 font-medium text-sm">{file.name}</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                                <span className="text-slate-400 text-sm font-medium">
                                    Drag & drop your file here, or click to select
                                </span>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileSelect}
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp,.txt,.zip,.rar,.mp4,.mov,.avi,.webm"
                        />
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Will default to file name"
                            className="bg-slate-900 border-slate-700 focus:ring-indigo-500"
                        />
                    </div>

                    {/* File Selection (Alternative) */}
                    <div className="space-y-2">
                        <Label>File</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white border-0"
                            >
                                Choose File
                            </Button>
                            <span className="text-sm text-slate-400 truncate max-w-[200px]">
                                {file ? file.name : "No file chosen"}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Supported formats: PDF, DOC/DOCX, PPT/PPTX, IMAGE, VIDEO, TEXT, ARCHIVE.
                        </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-slate-700 hover:bg-slate-800 text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!file || !title || isUploading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[80px]"
                        >
                            {isUploading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                "Upload"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
