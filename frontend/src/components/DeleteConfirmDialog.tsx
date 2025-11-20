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
    title: string;
}

export function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title }: DeleteConfirmDialogProps) {
    const [password, setPassword] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        if (!password) return;
        setIsDeleting(true);
        try {
            await onConfirm(password);
            onClose();
        } catch (error) {
            // Error handling is done in parent
        } finally {
            setIsDeleting(false);
            setPassword("");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        Delete Material
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Are you sure you want to delete <span className="font-semibold text-zinc-200">"{title}"</span>?
                        This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <label className="text-sm font-medium text-zinc-300 mb-2 block">
                        Say The Magic Spell
                    </label>
                    <Input
                        type="password"
                        placeholder="Enter secret password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-900 border-zinc-800 focus:border-red-500/50"
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
                        className="hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
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
