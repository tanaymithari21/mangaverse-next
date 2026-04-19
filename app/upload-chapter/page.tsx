"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Upload, ArrowLeft, Search, X, ChevronLeft, ChevronRight, Star, BookPlus, Sparkles, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImagesToCloudinary } from "@/services/uploadToCloudinary";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const PAGE_SIZE = 12;

interface MangaItem {
  id: number; title: string; cover: string;
  status: "Ongoing" | "Completed"; rating?: number; chaptersCount?: number;
}
interface PagedResponse {
  content: MangaItem[]; totalElements: number; totalPages: number; hasNext: boolean;
}

// Auto-generates chapter SEO meta tags
function generateChapterMeta(mangaTitle: string, chapterNumber: number, chapterTitle: string) {
  if (!mangaTitle) return null;
  const chapterLabel = chapterTitle.trim() ? `Chapter ${chapterNumber}: ${chapterTitle}` : `Chapter ${chapterNumber}`;
  const metaTitle = `${mangaTitle} ${chapterLabel} — Read Free | MangaVerse`;
  const metaDesc = `Read ${mangaTitle} ${chapterLabel} online free on MangaVerse. No signup required, instant access to all pages.`;
  const keywords = [
    `${mangaTitle} ${chapterLabel}`,
    `${mangaTitle} chapter ${chapterNumber}`,
    `read ${mangaTitle} online`,
    `${mangaTitle} free`,
    "read manga online free",
    "MangaVerse",
  ].join(", ");

  return { metaTitle, metaDesc, keywords };
}

// ── Step 1: Manga Picker ─────────────────────────────────────────
const MangaPicker = ({ onSelect }: { onSelect: (manga: MangaItem) => void }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PagedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true); setError(null);
    const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) });
    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    fetch(`${API}/api/manga?${params}`)
      .then(r => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  const totalPages = data?.totalPages ?? 0;
  const mangas = data?.content ?? [];

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title..." autoFocus
          className="w-full rounded-xl border border-border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>}
      </div>

      {!loading && data && <p className="text-xs text-muted-foreground">{data.totalElements} manga{data.totalElements !== 1 ? "s" : ""}{debouncedSearch ? ` for "${debouncedSearch}"` : ""}</p>}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border bg-card animate-pulse"><div className="aspect-[3/4] bg-secondary" /><div className="p-2.5 space-y-1.5"><div className="h-3 bg-secondary rounded w-4/5" /><div className="h-2.5 bg-secondary rounded w-1/2" /></div></div>
          ))}
        </div>
      )}
      {!loading && error && <div className="text-center py-20 text-destructive text-sm">{error}</div>}
      {!loading && !error && mangas.length === 0 && <div className="text-center py-20 text-muted-foreground text-sm">No manga found.</div>}

      {!loading && !error && mangas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mangas.map(manga => (
            <button key={manga.id} onClick={() => onSelect(manga)}
              className="group relative overflow-hidden rounded-xl bg-card border border-border text-left transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50">
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={manga.cover} alt={manga.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/90 rounded-full p-2.5 shadow-lg"><BookPlus size={16} className="text-primary" /></div>
                </div>
              </div>
              <div className="absolute top-2 right-2"><span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${manga.status === "Ongoing" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{manga.status}</span></div>
              <div className="p-2.5 space-y-1">
                <h3 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">{manga.title}</h3>
                {manga.rating !== undefined && <div className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-primary text-primary" /><span className="text-[10px] text-muted-foreground">{manga.rating}</span></div>}
                <p className="text-[9px] text-muted-foreground/50 font-mono">ID: {manga.id}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
          <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
};

// ── Step 2: Chapter Upload Form ──────────────────────────────────
const ChapterForm = ({ manga, onBack }: { manga: MangaItem; onBack: () => void }) => {
  const [chapterNumber, setChapterNumber] = useState(manga.chaptersCount !== undefined ? manga.chaptersCount + 1 : 1);
  const [chapterTitle, setChapterTitle] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [showSeo, setShowSeo] = useState(false);
  const dragIdx = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const onDragStart = (idx: number) => { dragIdx.current = idx; };
  const onDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const onDrop = (idx: number) => {
    if (dragIdx.current === null || dragIdx.current === idx) return;
    setImageFiles(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx.current!, 1);
      arr.splice(idx, 0, moved);
      return arr;
    });
    dragIdx.current = null;
    setDragOverIdx(null);
  };
  const onDragEnd = () => { dragIdx.current = null; setDragOverIdx(null); };

  const seo = useMemo(
    () => generateChapterMeta(manga.title, chapterNumber, chapterTitle),
    [manga.title, chapterNumber, chapterTitle]
  );

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
    setImageFiles(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (idx: number) => setImageFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (imageFiles.length === 0) return;
    setSubmitting(true); setProgress(0);
    try {
      const urls = await uploadImagesToCloudinary(imageFiles, chapterTitle || `Chapter ${chapterNumber}`, setProgress);
      const res = await fetch(`${API}/api/manga/${manga.id}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: chapterNumber,
          title: chapterTitle,
          imageUrls: urls,
          // SEO fields — auto-generated
          metaTitle: seo?.metaTitle || "",
          metaDescription: seo?.metaDesc || "",
          metaKeywords: seo?.keywords || "",
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setDone(true);
    } catch (err) {
      alert("❌ Upload failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-4xl">✅</div>
        <h2 className="text-xl font-bold text-foreground">Chapter uploaded!</h2>
        <p className="text-sm text-muted-foreground">Chapter {chapterNumber} added to <span className="text-foreground font-medium">{manga.title}</span></p>
        <div className="flex gap-3 justify-center pt-2">
          <Button variant="outline" onClick={() => { setDone(false); setImageFiles([]); setChapterTitle(""); setProgress(0); }}>Upload another chapter</Button>
          <Button onClick={onBack}>Pick different manga</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected manga strip */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
        <img src={manga.cover} alt={manga.title} className="w-12 h-16 object-cover rounded-lg shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">Uploading chapter for</p>
          <p className="text-sm font-bold text-foreground truncate">{manga.title}</p>
          {manga.chaptersCount !== undefined && <p className="text-xs text-muted-foreground">{manga.chaptersCount} chapter{manga.chaptersCount !== 1 ? "s" : ""} so far</p>}
        </div>
        <button onClick={onBack} className="shrink-0 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors hover:border-primary/40">Change</button>
      </div>

      {/* Chapter Number */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Chapter Number</label>
        <input type="number" value={chapterNumber} onChange={e => setChapterNumber(Number(e.target.value))} min={1}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
      </div>

      {/* Chapter Title */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Chapter Title <span className="text-muted-foreground/50">(optional)</span></label>
        <input type="text" value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} placeholder="e.g. The Beginning"
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
      </div>

      {/* Auto SEO Preview */}
      {seo && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
          <button type="button" onClick={() => setShowSeo(!showSeo)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
            <span className="flex items-center gap-2"><Sparkles size={14} /> Auto-generated SEO tags</span>
            {showSeo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showSeo && (
            <div className="px-4 pb-4 space-y-3 border-t border-primary/10">
              <div>
                <p className="text-xs text-muted-foreground mb-1 mt-3">Meta Title</p>
                <p className="text-xs bg-card border border-border rounded px-3 py-2 text-foreground font-mono">{seo.metaTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Meta Description</p>
                <p className="text-xs bg-card border border-border rounded px-3 py-2 text-foreground font-mono leading-relaxed">{seo.metaDesc}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Keywords</p>
                <p className="text-xs bg-card border border-border rounded px-3 py-2 text-foreground font-mono leading-relaxed">{seo.keywords}</p>
              </div>
              <p className="text-xs text-muted-foreground/60 italic">These are saved automatically with the chapter.</p>
            </div>
          )}
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Pages — {imageFiles.length} selected</label>
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all">
          <Upload size={20} className="text-muted-foreground mb-1.5" />
          <span className="text-sm text-muted-foreground">Click or drag images here</span>
          <input type="file" multiple accept="image/*" onChange={handleFilesChange} className="hidden" />
        </label>
        {imageFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {imageFiles.map((file, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={e => onDragOver(e, idx)}
                onDrop={() => onDrop(idx)}
                onDragEnd={onDragEnd}
                className={`relative group aspect-[3/4] rounded-lg border overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                  dragOverIdx === idx ? "border-primary ring-2 ring-primary scale-95" : "border-border"
                }`}
              >
                <img src={URL.createObjectURL(file)} alt={`page-${idx + 1}`} className="w-full h-full object-cover pointer-events-none" />
                {/* Page number */}
                <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] bg-black/60 text-white py-0.5">{idx + 1}</span>
                {/* Drag handle */}
                <div className="absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={10} className="text-white drop-shadow" />
                </div>
                {/* Remove button */}
                <button onClick={() => removeFile(idx)} className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 bg-black/70 hover:bg-red-600 rounded-full p-0.5 transition-all">
                  <X size={9} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress */}
      {submitting && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground"><span>Uploading pages...</span><span>{progress.toFixed(0)}%</span></div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={imageFiles.length === 0 || submitting} className="w-full gap-2">
        <Upload className="h-4 w-4" />
        {submitting ? `Uploading... ${progress.toFixed(0)}%` : `Upload Chapter ${chapterNumber}`}
      </Button>
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────
const UploadChapter = () => {
  const [selectedManga, setSelectedManga] = useState<MangaItem | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"><BookPlus size={20} className="text-primary" /></div>
          <div>
            <h1 className="text-2xl font-black text-foreground leading-tight">Upload Chapter</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{selectedManga ? `Adding chapter to ${selectedManga.title}` : "Select a manga to add a new chapter"}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${!selectedManga ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"}`}>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${!selectedManga ? "bg-primary-foreground text-primary" : "bg-secondary"}`}>1</span>Pick Manga
          </div>
          <div className="h-px w-6 bg-border" />
          <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${selectedManga ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border opacity-50"}`}>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${selectedManga ? "bg-primary-foreground text-primary" : "bg-secondary"}`}>2</span>Upload Chapter
          </div>
        </div>

        {!selectedManga ? <MangaPicker onSelect={setSelectedManga} /> : <ChapterForm manga={selectedManga} onBack={() => setSelectedManga(null)} />}
      </div>
    </div>
  );
};

export default UploadChapter;
