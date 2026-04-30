import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BookOpen, ChevronRight, Info, Layers, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "About MangaVerse — Read Manga Online Free",
  description: "Learn about MangaVerse — a free online platform to read manga. Discover genres, explore guides, and enjoy thousands of manga chapters without signup.",
  keywords: "about mangaverse, read manga online free, manga website, manga reader platform",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "https://mangaverse.dpdns.org/about" },
};

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="py-16 px-4 text-center border-b border-border/50">
          <div className="max-w-3xl mx-auto space-y-4">
            <nav className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight size={10} />
              <span className="text-foreground">About</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              About{" "}
              <span style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                MangaVerse
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              MangaVerse is a modern, fast, and completely free platform to read manga online. Built for readers who want a clean experience without ads, accounts, or downloads.
            </p>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
          <section>
            <h2 className="text-2xl font-black mb-3 flex items-center gap-2"><Info size={20} className="text-primary" />What is MangaVerse?</h2>
            <p className="text-muted-foreground leading-relaxed">MangaVerse is a browser-based manga reading platform that allows users to explore, discover, and read manga instantly. Whether you're a beginner or a long-time fan, MangaVerse makes it simple to jump into your favorite stories.</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">No login required. No app installation. Just open and start reading.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Layers size={20} className="text-primary" />Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {["Free manga reading — no subscription required", "Fast and responsive reader experience", "Mobile-friendly design with swipe navigation", "Clean UI with immersive reading mode", "Multiple genres and categories", "No account needed — instant access"].map((feature, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 text-sm text-muted-foreground">• {feature}</div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Compass size={20} className="text-primary" />Explore MangaVerse</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { href: "/home", title: "Browse Manga", desc: "Explore all available manga and discover new series." },
                { href: "/home", title: "Home", desc: "View featured manga, trending titles, and updates." },
                { href: "/genres-guide", title: "Genres Guide", desc: "Learn about different manga genres and find your taste." },
                { href: "/how-to-read", title: "How to Read", desc: "Complete beginner guide to reading manga online." },
              ].map(item => (
                <Link key={item.href + item.title} href={item.href} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition">
                  <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-3">Why MangaVerse?</h2>
            <p className="text-muted-foreground leading-relaxed">MangaVerse focuses on simplicity and performance. Unlike heavy platforms, it is optimized for speed, accessibility, and ease of use. Whether you're reading on mobile, tablet, or desktop, the experience remains smooth.</p>
            <p className="text-muted-foreground mt-4 leading-relaxed">It's designed especially for users who want a distraction-free reading experience with quick navigation and minimal loading time.</p>
          </section>
        </main>

        <section className="py-16 px-4 text-center border-t border-border/50">
          <div className="max-w-xl mx-auto space-y-5">
            <h2 className="text-2xl font-black">Start Reading Now</h2>
            <p className="text-muted-foreground text-sm">Thousands of manga are waiting for you — completely free.</p>
            <Link href="/home" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm" style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", color: "#fff" }}>
              <BookOpen size={15} /> Browse Manga
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
