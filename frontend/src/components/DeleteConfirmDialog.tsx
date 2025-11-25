import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => Promise<void>;
    title?: string;
    count?: number;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, count = 1 }: DeleteConfirmDialogProps) {
    const [password, setPassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        if (!password) return;
        setIsDeleting(true);
        try {
            await onConfirm(password);
            onClose();
        } catch (error) {

        } finally {
            setIsDeleting(false);
            setPassword("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95vw] sm:w-full sm:max-w-md bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 rounded-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Material
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-zinc-400">
                        {count > 1 ? (
                            <>Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-zinc-200">{count} items</span>?</>
                        ) : (
                            <>Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-zinc-200 break-all">"{title}"</span>?</>
                        )}
                        <br />This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <label className="text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2 block">
                        Cast The Magic Spell
                    </label>
                    <Input
                        type="password"
                        placeholder="Enter secret password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 focus:border-red-500/50"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleConfirm();
                        }}
                    />
                </div>

                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="hover:bg-gray-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={!password || isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Forever"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
