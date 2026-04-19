import { Star, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Manga {
  id: number; title: string; cover: string; author?: string; year?: number;
  description?: string; rating?: number; status?: string; genres?: string[];
  chapters?: any[]; chaptersCount?: number;
}

const FeaturedManga = ({ manga }: { manga: Manga | null }) => {
  if (!manga) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute inset-0">
        <img src={manga.cover || "/placeholder.png"} alt={manga.title} className="h-full w-full object-cover opacity-20 blur-2xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/60" />
      </div>
      <div className="relative flex flex-col md:flex-row gap-6 p-6 md:p-10">
        <div className="flex-shrink-0">
          <img src={manga.cover || "/placeholder.png"} alt={manga.title} className="w-48 md:w-56 rounded-xl shadow-card border border-border/50" />
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Featured</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-1" style={{ fontFamily: "var(--font-heading)" }}>{manga.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">by {manga.author || "Unknown"} · {manga.year || "N/A"}</p>
          </div>
          <p className="text-sm text-secondary-foreground max-w-lg leading-relaxed">{manga.description || "No description available."}</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /><span className="text-sm font-semibold text-foreground">{manga.rating ?? "N/A"}</span></div>
            <span className="text-sm text-muted-foreground">{manga.chaptersCount ?? manga.chapters?.length ?? 0} Chapters</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${manga.status === "Ongoing" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{manga.status || "Unknown"}</span>
          </div>
          <div className="flex flex-wrap gap-2">{manga.genres?.map((g, i) => <span key={i} className="genre-chip text-xs">{g}</span>)}</div>
          <div className="flex gap-3 pt-2">
            <Link href={`/manga/${manga.id}`}>
              <Button className="bg-gradient-orange shadow-glow hover:opacity-90 transition-opacity">
                <BookOpen className="h-4 w-4 mr-2" />Start Reading
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedManga;
