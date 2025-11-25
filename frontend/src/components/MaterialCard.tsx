import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FileText, Presentation, Image as ImageIcon, FileType, Archive, File, Download, ExternalLink, Video, Link as LinkIcon, Check, Trash2, Copy } from "lucide-react";
import { useState } from "react";
export interface Material {
    id: string;
    title: string;
    url: string;
    type: 'pdf' | 'doc' | 'ppt' | 'image' | 'text' | 'archive' | 'video' | 'other';
    createdAt: any; // Firestore Timestamp
    size?: number;
    originalName?: string;
}
interface MaterialCardProps {
    material: Material;
    onDelete?: (material: Material) => void;
}
import { memo } from "react";

export const MaterialCard = memo(function MaterialCard({ material, onDelete }: MaterialCardProps) {
    const [copied, setCopied] = useState(false);
    const [titleCopied, setTitleCopied] = useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-8 h-8 text-rose-600" />;
            case 'doc': return <FileText className="w-8 h-8 text-blue-600" />;
            case 'ppt': return <Presentation className="w-8 h-8 text-orange-600" />;
            case 'image': return <ImageIcon className="w-8 h-8 text-emerald-600" />;
            case 'video': return <Video className="w-8 h-8 text-violet-600" />;
            case 'text': return <FileType className="w-8 h-8 text-blue-600" />;
            case 'archive': return <Archive className="w-8 h-8 text-purple-600" />;
            default: return <File className="w-8 h-8 text-slate-600" />;
        }
    };
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    };
    const isNew = (timestamp: any) => {
        if (!timestamp) return false;
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        return diff < 24 * 60 * 60 * 1000;
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(material.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const handleCopyTitle = () => {
        navigator.clipboard.writeText(material.title);
        setTitleCopied(true);
        setTimeout(() => setTitleCopied(false), 2000);
    };
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleDownload = () => {
        const downloadUrl = `/api/download?url=${encodeURIComponent(material.url)}&filename=${encodeURIComponent(material.originalName || material.title)}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = material.originalName || material.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-sm overflow-hidden hover:bg-gray-100 dark:hover:bg-white/10">
            <CardContent className="p-3">
                <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-xl bg-gray-200 dark:bg-white/5 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        {getIcon(material.type)}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 bg-gray-200 dark:bg-white/5 px-2 py-0.5 rounded-full">
                            {formatDate(material.createdAt)}
                        </span>
                        {material.size && (
                            <>
                                {!isNew(material.createdAt) && <span className="w-1 h-1 bg-slate-600 rounded-full" />}
                                <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 bg-gray-200 dark:bg-white/5 px-2 py-0.5 rounded-full">
                                    {formatSize(material.size)}
                                </span>
                            </>
                        )}
                        {isNew(material.createdAt) && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                                NEW
                            </span>
                        )}
                        {!isNew(material.createdAt) && <span className="w-1 h-1 bg-slate-600 rounded-full" />}
                        <button
                            onClick={handleCopyLink}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Copy Link"
                        >
                            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <LinkIcon className="w-3 h-3" />}
                        </button>
                        {!isNew(material.createdAt) && <span className="w-1 h-1 bg-slate-600 rounded-full" />}
                        <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 bg-gray-200 dark:bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            {material.type}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-2 mb-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100 truncate cursor-help text-left flex-1">
                                    {material.title}
                                </h3>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs break-words">{material.title}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <button
                        onClick={handleCopyTitle}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
                        title="Copy Filename"
                    >
                        {titleCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1 h-9 text-xs border-gray-200 dark:border-white/10 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                    onClick={() => window.open(material.url, '_blank')}
                >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    View
                </Button>
                <Button
                    className="flex-1 h-9 text-xs bg-black dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-500 text-white shadow-sm dark:shadow-indigo-600/20"
                    onClick={handleDownload}
                >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Download
                </Button>
                <Button
                    variant="ghost"
                    className="h-9 w-9 p-0 text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => onDelete && onDelete(material)}
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
});
