"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Search, X, ChevronLeft, ChevronRight, Star } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const PAGE_SIZE = 12;

interface MangaItem { id: number; title: string; cover: string; status: "Ongoing" | "Completed"; rating?: number; chaptersCount?: number; }
interface PagedResponse { content: MangaItem[]; totalElements: number; totalPages: number; }

export default function EditMangaSelectPage() {
  const router = useRouter();
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
      .then(r => { if (!r.ok) throw new Error("Failed to load manga list"); return r.json(); })
      .then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [debouncedSearch, page]);

  const totalPages = data?.totalPages ?? 0;
  const mangas = data?.content ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={14} /> Back to menu
        </Link>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0"><Pencil size={20} className="text-blue-400" /></div>
          <div>
            <h1 className="text-2xl font-black text-foreground leading-tight">Edit Manga</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Select a manga to edit its details and chapters</p>
          </div>
        </div>
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title..." autoFocus className="w-full rounded-xl border border-border bg-card pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>}
        </div>
        {!loading && data && <p className="text-xs text-muted-foreground mb-4">{data.totalElements} manga{data.totalElements !== 1 ? "s" : ""}{debouncedSearch ? ` for "${debouncedSearch}"` : ""}{totalPages > 1 && ` — page ${page + 1} of ${totalPages}`}</p>}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border bg-card animate-pulse"><div className="aspect-[3/4] bg-secondary" /><div className="p-2.5 space-y-1.5"><div className="h-3 bg-secondary rounded w-4/5" /><div className="h-2.5 bg-secondary rounded w-1/2" /></div></div>
            ))}
          </div>
        )}
        {!loading && error && <div className="text-center py-20 text-destructive text-sm">{error}</div>}
        {!loading && !error && mangas.length === 0 && <div className="text-center py-20 text-muted-foreground text-sm">No manga found{debouncedSearch ? ` for "${debouncedSearch}"` : ""}.</div>}
        {!loading && !error && mangas.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mangas.map(manga => (
              <button key={manga.id} onClick={() => router.push(`/edit-manga/${manga.id}`)} className="group relative overflow-hidden rounded-xl bg-card border border-border text-left transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img src={manga.cover} alt={manga.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-background/90 rounded-full p-2.5 shadow-lg"><Pencil size={16} className="text-blue-400" /></div>
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
          <div className="flex items-center justify-center gap-2 mt-8">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={16} /></button>
            <span className="text-sm text-muted-foreground">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={16} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
