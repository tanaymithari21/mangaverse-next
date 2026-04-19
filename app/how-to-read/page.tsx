import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BookOpen, ChevronRight, Smartphone, Monitor, Keyboard, Eye, Maximize2, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Read Manga Online — Beginner's Guide | MangaVerse",
  description: "Complete beginner's guide to reading manga online. Learn manga reading direction, panel order, reader controls, keyboard shortcuts, and tips for new readers.",
  keywords: "how to read manga, manga reading direction, manga online guide, read manga right to left, manga panel order",
  alternates: { canonical: "https://mangaverse.dpdns.org/how-to-read" },
  openGraph: { title: "How to Read Manga Online — Beginner's Guide | MangaVerse", description: "Everything a beginner needs to know about reading manga online.", url: "https://mangaverse.dpdns.org/how-to-read", images: [{ url: "https://mangaverse.dpdns.org/og-howto.jpg" }] },
};

const HOWTO_JSONLD = {
  "@context": "https://schema.org", "@type": "HowTo",
  "name": "How to Read Manga Online on MangaVerse",
  "step": [
    { "@type": "HowToStep", "name": "Visit MangaVerse", "position": 1 },
    { "@type": "HowToStep", "name": "Find a Manga", "position": 2 },
    { "@type": "HowToStep", "name": "Open the Manga Page", "position": 3 },
    { "@type": "HowToStep", "name": "Select a Chapter", "position": 4 },
    { "@type": "HowToStep", "name": "Navigate Pages", "position": 5 },
  ]
};

const TIPS = [
  { Icon: Eye, title: "Reading Direction Matters", desc: "Traditional Japanese manga reads right-to-left, top-to-bottom. MangaVerse has a RTL/LTR toggle in the reader so you can set whichever feels natural.", color: "#e05c2a" },
  { Icon: Keyboard, title: "Use Keyboard Shortcuts", desc: "Arrow keys navigate pages. Left/Right arrows move between pages. F toggles fullscreen/immersive mode. Escape closes the reader.", color: "#3b82f6" },
  { Icon: Smartphone, title: "Swipe on Mobile", desc: "On phones and tablets, swipe left or right to turn pages. The swipe threshold is 40px so accidental touches don't trigger page turns.", color: "#22c55e" },
  { Icon: Monitor, title: "Two-Page Spread Mode", desc: "Enable 2P mode in the reader for a side-by-side two-page layout — ideal on large screens and perfect for reading double-spread panels correctly.", color: "#a855f7" },
  { Icon: Maximize2, title: "Immersive / Fullscreen Mode", desc: "Press F or click the fullscreen icon to hide all UI and read with the manga filling your entire screen.", color: "#f59e0b" },
  { Icon: RotateCcw, title: "Start from Any Chapter", desc: "Caught up on a series? Click any chapter in the list to jump directly to it. No need to scroll through from Chapter 1 every time.", color: "#ec4899" },
];

const BEGINNERS_MISTAKES = [
  { mistake: "Reading panels out of order", fix: "In RTL manga, scan each page from top-right to bottom-left. Within a panel, read bubbles from top-right downward." },
  { mistake: "Skipping volumes to 'catch up' faster", fix: "Manga paces its emotional beats deliberately. Skipping volumes means missing character development that makes later moments hit harder." },
  { mistake: "Only reading the most famous series", fix: "The most popular manga are popular for a reason — but the medium's true diversity lives in lesser-known titles. Explore genre filters." },
  { mistake: "Not using the immersive reader", fix: "The MangaVerse fullscreen/immersive mode hides all UI and maximises the reading area. Press F or tap the fullscreen button." },
  { mistake: "Giving up after one chapter", fix: "Many manga take 3–5 chapters to find their footing. Give series at least 3 chapters before deciding if it's for you." },
];

export default function HowToReadPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_JSONLD) }} />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <section className="py-16 px-4 text-center border-b border-border/50">
          <div className="max-w-3xl mx-auto space-y-4">
            <nav className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-4" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight size={10} /><span className="text-foreground">How to Read Manga</span>
            </nav>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              How to Read{" "}
              <span style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Manga Online</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">New to manga? Or just want to get the most out of the MangaVerse reader? This guide covers everything.</p>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-4 py-12 space-y-20">
          <section>
            <h2 className="text-2xl font-black mb-2">Getting Started in 5 Steps</h2>
            <p className="text-muted-foreground text-sm mb-8">Reading manga on MangaVerse takes about 30 seconds to set up — and costs exactly nothing.</p>
            <ol className="space-y-6">
              {[
                { n: "01", title: "Open MangaVerse", desc: "Visit the site in any browser — Chrome, Safari, Firefox, Edge. No app download required. The site works on any device.", detail: "MangaVerse is fully browser-based. Bookmarking the site on your phone's home screen gives you an app-like experience." },
                { n: "02", title: "Find a Manga", desc: "Use the search bar at the top of the home page to find a specific title, or browse the genre filter chips to explore by category.", detail: "Try searching for 'One Piece', 'Demon Slayer', or 'Attack on Titan' to start with a familiar title." },
                { n: "03", title: "Open the Manga Detail Page", desc: "Click any manga card to open its full detail page — you'll see the title, cover, author, year, rating, synopsis, genres, and the full chapter list.", detail: "The detail page also shows how many chapters are available and whether the series is still ongoing or completed." },
                { n: "04", title: "Start Reading", desc: "Hit 'Read Now' to jump straight to Chapter 1, or click any specific chapter from the list.", detail: "The chapter list makes it easy to jump back to exactly where you left off." },
                { n: "05", title: "Navigate the Reader", desc: "Use arrow keys on keyboard, swipe gestures on touch screens, or click the left/right zones of the screen to turn pages. Press F for fullscreen.", detail: "Bookmark the chapter URL in your browser to easily return to where you left off between sessions." },
              ].map((step, i) => (
                <li key={step.n} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm" style={i === 0 ? { background: "linear-gradient(135deg,#e05c2a,#f0943a)", color: "#fff" } : { border: "2px solid #2a2a2a" }}>
                      {step.n}
                    </div>
                  </div>
                  <div className="pb-6">
                    <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground mb-3">{step.desc}</p>
                    <div className="bg-card border border-border/50 rounded-lg px-4 py-3 text-xs text-muted-foreground">💡 <strong className="text-foreground">Tip:</strong> {step.detail}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-8">MangaVerse Reader Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {TIPS.map(({ Icon, title, desc, color }) => (
                <div key={title} className="bg-card border border-border rounded-xl p-5 space-y-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div style={{ color, background: `${color}18`, width: 38, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-foreground text-sm">{title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2"><Keyboard size={14} className="text-primary" /> Keyboard Shortcuts</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { key: "→ Right Arrow", action: "Next page (LTR) / Previous page (RTL)" },
                    { key: "← Left Arrow", action: "Previous page (LTR) / Next page (RTL)" },
                    { key: "↓ Down Arrow", action: "Always go to next page" },
                    { key: "↑ Up Arrow", action: "Always go to previous page" },
                    { key: "F", action: "Toggle fullscreen / immersive mode" },
                    { key: "Escape", action: "Close the reader" },
                  ].map((row, i) => (
                    <tr key={row.key} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-secondary/20"}`}>
                      <td className="px-5 py-3 font-mono text-xs text-primary w-44">{row.key}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-8">Common Beginner Mistakes</h2>
            <div className="space-y-4">
              {BEGINNERS_MISTAKES.map(({ mistake, fix }) => (
                <div key={mistake} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-border/50 bg-destructive/5">
                    <span className="text-destructive text-xs font-bold uppercase tracking-wider">Mistake:</span>
                    <span className="text-sm font-semibold text-foreground">{mistake}</span>
                  </div>
                  <div className="px-5 py-3 flex items-start gap-3">
                    <span className="text-green-500 text-xs font-bold uppercase tracking-wider mt-0.5 flex-shrink-0">Fix:</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <section className="py-16 px-4 text-center border-t border-border/50">
          <div className="max-w-xl mx-auto space-y-5">
            <h2 className="text-2xl font-black">You're Ready. Start Reading.</h2>
            <p className="text-muted-foreground text-sm">MangaVerse has thousands of series waiting — free, instant, no account needed.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/home" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm" style={{ background: "linear-gradient(135deg,#e05c2a,#f0943a)", color: "#fff" }}>
                <BookOpen size={15} /> Browse the Library
              </Link>
              <Link href="/genres-guide" className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-sm border border-border bg-card text-foreground hover:border-primary/40 transition-all">
                Explore Genres <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
