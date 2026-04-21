"use client";
import { useState, useEffect, useRef } from "react";

// ── Inject slide-animation CSS once ──────────────────────────────
const SLIDE_CSS = `
@keyframes slideInLeft  { from { transform: translateX(-6%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX( 6%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;
if (typeof document !== "undefined" && !document.getElementById("ir-slide-css")) {
    const s = document.createElement("style");
    s.id = "ir-slide-css"; s.textContent = SLIDE_CSS;
    document.head?.appendChild(s);
}

// ── Page-turn sound ───────────────────────────────────────────────
const playPageTurn = () => {
    try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return;
        const ctx = new AC(); const t = ctx.currentTime; const dur = 0.18;
        const len = Math.floor(ctx.sampleRate * dur);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource(); src.buffer = buf;
        const bpf = ctx.createBiquadFilter(); bpf.type = "bandpass"; bpf.Q.value = 0.8;
        bpf.frequency.setValueAtTime(800, t);
        bpf.frequency.linearRampToValueAtTime(2200, t + 0.08);
        bpf.frequency.linearRampToValueAtTime(1000, t + dur);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        src.connect(bpf); bpf.connect(gain); gain.connect(ctx.destination);
        src.start(t); src.stop(t + dur + 0.01);
        src.onended = () => ctx.close();
    } catch { }
};

import { X, ChevronLeft, ChevronRight, BookOpen, BookMarked, Maximize2, Minimize2 } from "lucide-react";
import AdCard from "@/components/AdCard";

interface ImageReaderProps {
    images: string[];
    title?: string;
    onClose: () => void;
}

// ── Virtual pages (ads every 8 pages) ────────────────────────────
type VirtualPage =
    | { type: "page"; realIndex: number }
    | { type: "ad"; adIndex: number };

const buildVirtualPages = (totalImages: number): VirtualPage[] => {
    const result: VirtualPage[] = [];
    let adCount = 0;
    for (let i = 0; i < totalImages; i++) {
        result.push({ type: "page", realIndex: i });
        if ((i + 1) % 8 === 0 && i + 1 < totalImages) {
            result.push({ type: "ad", adIndex: adCount++ });
        }
    }
    return result;
};

// ────────────────────────────────────────────────────────────────

const ImageReader: React.FC<ImageReaderProps> = ({ images, title, onClose }) => {
    const virtualPages = buildVirtualPages(images.length);

    const [vIndex, setVIndex] = useState(0);
    const [rtl, setRtl] = useState(false);
    const [twoPage, setTwoPage] = useState(false);
    const [immersive, setImmersive] = useState(false);

    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
    const animKey = useRef(0);

    // ── AD LOCK STATE (NEW) ───────────────────────────────
    const [adLocked, setAdLocked] = useState(false);
    const [adTimer, setAdTimer] = useState(7);

    const containerRef = useRef<HTMLDivElement>(null);

    const current = virtualPages[vIndex];
    const isAdPage = current?.type === "ad";

    const currentRealIndex = current?.type === "page" ? current.realIndex : -1;

    // ── AD LOCK EFFECT (7 seconds) ─────────────────────────
    useEffect(() => {
        if (!isAdPage) {
            setAdLocked(false);
            setAdTimer(7);
            return;
        }

        setAdLocked(true);
        setAdTimer(7);

        const interval = setInterval(() => {
            setAdTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setAdLocked(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [vIndex]);

    const goToV = (idx: number) => {
        if (isAdPage && adLocked) return;

        const clamped = Math.max(0, Math.min(virtualPages.length - 1, idx));
        setVIndex(clamped);
        containerRef.current?.scrollTo({ top: 0 });
    };

    const goNext = () => {
        if (isAdPage && adLocked) return;

        playPageTurn();
        setAnimDir(rtl ? "left" : "right");
        animKey.current++;

        goToV(vIndex + 1);
    };

    const goPrev = () => {
        if (isAdPage && adLocked) return;

        playPageTurn();
        setAnimDir(rtl ? "right" : "left");
        animKey.current++;

        goToV(vIndex - 1);
    };

    const onClickLeft = () => rtl ? goNext() : goPrev();
    const onClickRight = () => rtl ? goPrev() : goNext();

    return (
        <div style={{ position: "fixed", inset: 0, background: "#0a0a0a" }}>

            {/* ── VIEWER ── */}
            <div
                ref={containerRef}
                style={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >

                {/* CLICK ZONES */}
                {!isAdPage && (
                    <>
                        <div onClick={onClickLeft} style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "30%" }} />
                        <div onClick={onClickRight} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "30%" }} />
                    </>
                )}

                {/* AD PAGE */}
                {isAdPage ? (
                    <>
                        <AdCard variant="reader" />

                        {/* 🔥 SMALL TIMER (NO UI IMPACT) */}
                        <div
                            style={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                fontSize: 11,
                                fontFamily: "monospace",
                                background: "rgba(0,0,0,0.6)",
                                padding: "4px 8px",
                                borderRadius: 4,
                                color: adLocked ? "#e05c2a" : "#4caf50",
                                pointerEvents: "none",
                            }}
                        >
                            {adLocked ? `Ad · wait ${adTimer}s` : "Ad ready"}
                        </div>
                    </>
                ) : (
                    <img
                        src={images[currentRealIndex]}
                        style={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ImageReader;