
import { Search, BookOpen, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span
            className="text-xl font-bold tracking-tight text-gradient-orange"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            MangaVerse
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/home" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Browse
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/genres-guide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Genres
          </Link>
          <Link href="/how-to-read" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How to Read
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <Link href="/home" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link href="/home" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            Browse
          </Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/genres-guide" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            Genres
          </Link>
          <Link href="/how-to-read" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-muted-foreground hover:text-foreground">
            How to Read
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
