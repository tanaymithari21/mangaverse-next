

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Upload, ImagePlus, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadToCloudinary } from "@/services/uploadToCloudinary";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const SITE_URL = "https://mangaverse.dpdns.org";

// Auto-generates SEO meta tags from manga fields
function generateMetaTags(title: string, author: string, description: string, genres: string[], year: number, status: string) {
  if (!title.trim()) return null;

  const genreStr = genres.slice(0, 3).join(", ") || "manga";
  const metaTitle = `${title} — Read Online Free | MangaVerse`;
  const metaDesc = description.trim()
    ? description.trim().slice(0, 155) + (description.length > 155 ? "..." : "")
    : `Read ${title} by ${author || "Unknown"} online free on MangaVerse. ${status} ${year ? `(${year})` : ""}. Genre: ${genreStr}. No signup required.`;

  const keywords = [
    title,
    `${title} manga`,
    `read ${title} online`,
    `${title} free`,
    author && `${author} manga`,
    ...genres.map(g => `${g.toLowerCase()} manga`),
    "read manga online free",
    "MangaVerse",
  ].filter(Boolean).join(", ");

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  return { metaTitle, metaDesc, keywords, slug };
}

const UploadManga = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState<"Ongoing" | "Completed">("Ongoing");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreOptions, setGenreOptions] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSeo, setShowSeo] = useState(false);

  // Live-preview of generated meta tags
  const seo = useMemo(
    () => generateMetaTags(title, author, description, selectedGenres, year, status),
    [title, author, description, selectedGenres, year, status]
  );

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/genres`)
      .then(res => res.json())
      .then(data => setGenreOptions(data))
      .catch(err => console.error("Failed to fetch genres:", err));
  }, []);

  const toggleGenre = (genre: string) => {
    if (genre === "All") return;
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile || !title.trim()) {
      alert("Please add a cover image and title.");
      return;
    }

    setSubmitting(true);
    try {
      const coverRes = await uploadToCloudinary(coverFile, title);
      const coverUrl = coverRes.secure_url;

      const body = {
        title,
        author,
        description,
        year,
        status,
        genres: selectedGenres,
        cover: coverUrl,
        // SEO fields — auto-generated
        metaTitle: seo?.metaTitle || "",
        metaDescription: seo?.metaDesc || "",
        metaKeywords: seo?.keywords || "",
      };

      const res = await fetch(`${API_BASE_URL}/api/manga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      alert(`✅ Manga uploaded! ID: ${data.id}`);
      router.push(`/manga/${data.id}`);
    } catch (err) {
      alert("❌ Upload failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2 text-primary" style={{ fontFamily: "var(--font-heading)" }}>
          Upload Manga
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          After uploading, use the <strong>Upload Chapter</strong> page to add chapters and pages.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cover */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Cover Image</label>
            <div className="flex items-start gap-4">
              {coverPreview ? (
                <div className="relative w-40 h-56 rounded-lg overflow-hidden border border-border">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }} className="absolute top-1 right-1 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-40 h-56 rounded-lg border-2 border-dashed border-border bg-card hover:border-primary/50 cursor-pointer transition-colors">
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Select Cover</span>
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Manga title" required className="bg-card border-border" />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Author</label>
            <Input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author name" className="bg-card border-border" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Manga description..."
              rows={4}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Year & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Year</label>
              <Input type="number" value={year} onChange={e => setYear(Number(e.target.value))} className="bg-card border-border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as "Ongoing" | "Completed")} className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Genres</label>
            {genreOptions.length === 0 ? (
              <p className="text-xs text-muted-foreground">Loading genres...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {genreOptions.map(genre => (
                  <button key={genre} type="button" onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedGenres.includes(genre) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                    {genre}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auto SEO Preview */}
          {seo && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSeo(!showSeo)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
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
                    <p className={`text-xs mt-1 ${seo.metaDesc.length > 155 ? "text-destructive" : "text-muted-foreground"}`}>{seo.metaDesc.length}/155 chars</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Keywords</p>
                    <p className="text-xs bg-card border border-border rounded px-3 py-2 text-foreground font-mono leading-relaxed">{seo.keywords}</p>
                  </div>
                  <p className="text-xs text-muted-foreground/60 italic">These are saved automatically with the manga.</p>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={!coverFile || !title.trim() || submitting} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            {submitting ? "Uploading..." : "Upload Manga"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadManga;
