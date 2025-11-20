import { useState, useEffect, lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MaterialGrid } from "@/components/MaterialGrid";
import type { Material } from "@/components/MaterialCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { uploadFile, deleteFile } from "@/lib/api";
import { Search, Upload, Filter, FileText, Presentation, Image as ImageIcon, Video, FileType, Archive, CheckCircle2, AlertCircle } from "lucide-react";
import { get, del } from "idb-keyval";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";


const UploadModal = lazy(() => import("@/components/UploadModal").then(module => ({ default: module.UploadModal })));

function App() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [initialFile, setInitialFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Fetch materials
  useEffect(() => {
    console.log("Initializing Firestore listener...");
    const q = query(collection(db, "materials"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore snapshot received. Docs count:", snapshot.docs.length);
      const fetchedMaterials = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Material[];
      setMaterials(fetchedMaterials);
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to database: " + error.message,
        className: "bg-red-950 border-red-900 text-red-100",
        action: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check for shared file (PWA Share Target)
  useEffect(() => {
    const checkSharedFile = async () => {
      try {
        const shared = await get('shared-file');
        if (shared && shared.file) {
          setMaterials((prev) => prev);
          setInitialFile(shared.file);
          if (shared.title) {
          }
          setIsUploadModalOpen(true);
          await del('shared-file');
        }
      } catch (e) {
        console.error("Error checking shared file", e);
      }
    };
    checkSharedFile();
  }, []);

  // Global Drag and Drop
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setInitialFile(file);
        setIsUploadModalOpen(true);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Filter and Sort
  useEffect(() => {
    let result = [...materials];

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(lowerQuery) ||
          m.type.toLowerCase().includes(lowerQuery)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((m) => m.type === typeFilter);
    }

    if (sortOrder === "oldest") {
      result.reverse();
    } else if (sortOrder === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredMaterials(result);
  }, [materials, searchQuery, typeFilter, sortOrder]);

  const handleUpload = async (file: File, title: string) => {
    try {
      // 1. Upload to R2 via backend
      const { url } = await uploadFile(file);

      // 2. Determine type
      const ext = file.name.split('.').pop()?.toLowerCase() || 'other';
      let type = 'other';
      if (ext === 'pdf') type = 'pdf';
      else if (['doc', 'docx'].includes(ext)) type = 'doc';
      else if (['ppt', 'pptx'].includes(ext)) type = 'ppt';
      else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) type = 'image';
      else if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) type = 'video';
      else if (['txt', 'md'].includes(ext)) type = 'text';
      else if (['zip', 'rar', '7z'].includes(ext)) type = 'archive';

      // 3. Save metadata to Firestore
      await addDoc(collection(db, "materials"), {
        title,
        url,
        type,
        size: file.size,
        createdAt: serverTimestamp(),
        originalName: file.name
      });

      toast({
        title: "Success",
        description: "Material uploaded successfully",
        className: "bg-emerald-950 border-emerald-900 text-emerald-100",
        action: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload material",
        className: "bg-red-950 border-red-900 text-red-100",
        action: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      throw error;
    }
  };

  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);

  const handleDeleteClick = (material: Material) => {
    setMaterialToDelete(material);
  };

  const handleConfirmDelete = async (password: string) => {
    if (!materialToDelete) return;

    try {

      await deleteFile(materialToDelete.originalName || materialToDelete.title, password);

      // 2. Delete from Firestore
      await deleteDoc(doc(db, "materials", materialToDelete.id));

      toast({
        title: "Deleted",
        description: "Material deleted successfully",
        className: "bg-emerald-950 border-emerald-900 text-emerald-100",
        action: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      const message = error.response?.data?.error || "Failed to delete material";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
        className: "bg-red-950 border-red-900 text-red-100",
        action: <AlertCircle className="w-5 h-5 text-red-500" />,
      });
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-indigo-500/30">
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Share. Learn. Grow.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Course materials, presentations, and resources from your learning community.
          </p>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-6 text-base font-semibold shadow-lg shadow-indigo-600/30"
          >
            Upload material
          </Button>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Search title, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/20 border-white/10 focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div className="lg:col-span-4 flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full bg-black/20 border-white/10">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span>All types</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-rose-600" />
                      <span>PDF</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="doc">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Documents</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ppt">
                    <div className="flex items-center gap-2">
                      <Presentation className="w-4 h-4 text-orange-600" />
                      <span>Presentations</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>Images</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-violet-600" />
                      <span>Videos</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileType className="w-4 h-4 text-blue-600" />
                      <span>Text</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="archive">
                    <div className="flex items-center gap-2">
                      <Archive className="w-4 h-4 text-purple-600" />
                      <span>Archives</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] bg-black/20 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <MaterialGrid
          materials={filteredMaterials}
          isLoading={isLoading}
          onDelete={handleDeleteClick}
        />
      </main>

      <Footer />

      <Suspense fallback={null}>
        {isUploadModalOpen && (
          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => {
              setIsUploadModalOpen(false);
              setInitialFile(null);
            }}
            onUpload={handleUpload}
            initialFile={initialFile}
          />
        )}
      </Suspense>

      <DeleteConfirmDialog
        isOpen={!!materialToDelete}
        onClose={() => setMaterialToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={materialToDelete?.title || ""}
      />

      <Toaster />

      {/* Global Drag Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-indigo-500/20 backdrop-blur-sm border-4 border-dashed border-indigo-500 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl text-center animate-bounce">
            <Upload className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white">Drop file to upload</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
