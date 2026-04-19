import Link from "next/link";
import { Upload, BookOpen, Pencil, Tag, BookPlus, ChevronRight } from "lucide-react";

const menuItems = [
  { icon: BookOpen, label: "Browse Manga", desc: "Go to the main catalog", to: "/home", color: "#555" },
  { icon: Upload, label: "Upload Manga", desc: "Add a new manga with cover and details", to: "/upload-manga", color: "#e05c2a" },
  { icon: BookPlus, label: "Upload Chapter", desc: "Add pages to an existing manga", to: "/upload-chapter", color: "#e05c2a" },
  { icon: Pencil, label: "Edit Manga", desc: "Edit details, chapters and pages of any manga", to: "/admin/edit-manga", color: "#3b82f6", note: "Pick a manga from catalog first" },
  { icon: Tag, label: "Manage Genres", desc: "Add, rename or delete genres across all manga", to: "/genres", color: "#a855f7" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2 font-mono">mangaverse</p>
          <h1 className="text-4xl font-black text-primary mb-1">Admin</h1>
          <p className="text-sm text-muted-foreground">Manage your manga library</p>
        </div>
        <nav className="space-y-2">
          {menuItems.map(item => (
            <Link key={item.to + item.label} href={item.to} className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-secondary/50 transition-all group">
              <div style={{ color: item.color, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: `${item.color}18`, borderRadius: 10, flexShrink: 0 }}>
                <item.icon size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {item.note ? <span className="text-amber-500/80">{item.note}</span> : item.desc}
                </div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </nav>
        <p className="text-xs text-muted-foreground/40 text-center mt-10 font-mono">accessible at /admin</p>
      </div>
    </div>
  );
}
