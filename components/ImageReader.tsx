"use client";

import { useState, useEffect, useRef } from "react";
import {
    X,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    BookMarked,
    Maximize2,
    Minimize2,
} from "lucide-react";
import AdCard from "@/components/AdCard";

/* ───────────────────────────────────────────── */

const SLIDE_CSS = `
@keyframes slideInLeft  { from { transform: translateX(-6%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX( 6%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
`;

if (typeof document !== "undefined" && !document.getElementById("ir-slide-css")) {
    const s = document.createElement("style");
    s.id = "ir-slide-css";
    s.textContent = SLIDE_CSS;
    document.head.appendChild(s);
}

/* ───────────────────────────────────────────── */

const playPageTurn = () => {
    try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const t = ctx.currentTime;
        const dur = 0.18;

        const len = Math.floor(ctx.sampleRate * dur);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);

        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

        const src = ctx.createBufferSource();
        src.buffer = buf;

        const bpf = ctx.createBiquadFilter();
        bpf.type = "bandpass";
        bpf.Q.value = 0.8;
        bpf.frequency.setValueAtTime(800, t);
        bpf.frequency.linearRampToValueAtTime(2200, t + 0.08);
        bpf.frequency.linearRampToValueAtTime(1000, t + dur);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        src.connect(bpf);
        bpf.connect(gain);
        gain.connect(ctx.destination);

        src.start(t);
        src.stop(t + dur + 0.01);
        src.onended = () => ctx.close();
    } catch { }
};

/* ───────────────────────────────────────────── */

interface ImageReaderProps {
    images: string[];
    title?: string;
    onClose: () => void;
}

type VirtualPage =
    | { type: "page"; realIndex: number }
    | { type: "ad"; adIndex: number };

/* ───────────────────────────────────────────── */

const buildVirtualPages = (total: number): VirtualPage[] => {
    const result: VirtualPage[] = [];
    let adCount = 0;

    for (let i = 0; i < total; i++) {
        result.push({ type: "page", realIndex: i });

        if ((i + 1) % 8 === 0 && i + 1 < total) {
            result.push({ type: "ad", adIndex: adCount++ });
        }
    }

    return result;
};

/* ───────────────────────────────────────────── */

const ImageReader = ({ images, title, onClose }: ImageReaderProps) => {
    const virtualPages = buildVirtualPages(images.length);

    const [vIndex, setVIndex] = useState(0);
    const [loaded, setLoaded] = useState<boolean[]>(new Array(images.length).fill(false));
    const [rtl, setRtl] = useState(false);
    const [twoPage, setTwoPage] = useState(false);
    const [immersive, setImmersive] = useState(false);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
    const [adLocked, setAdLocked] = useState(false);
    const [adCountdown, setAdCountdown] = useState(0);

    const animKey = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const current = virtualPages[vIndex];
    const isAdPage = current?.type === "ad";
    const currentRealIndex = current?.type === "page" ? current.realIndex : -1;

    /* ───────────────────────────────────────────── */
    /* 7 SECOND AD LOCK */
    useEffect(() => {
        if (isAdPage) {
            setAdLocked(true);
            setAdCountdown(7);

            const interval = setInterval(() => {
                setAdCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setAdLocked(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setAdLocked(false);
            setAdCountdown(0);
        }
    }, [vIndex]);

    /* ───────────────────────────────────────────── */

    const goToV = (i: number) => {
        if (adLocked) return;
        const clamped = Math.max(0, Math.min(virtualPages.length - 1, i));
        setVIndex(clamped);
        containerRef.current?.scrollTo({ top: 0 });
    };

    const goNext = () => {
        if (adLocked) return;

        playPageTurn();
        setAnimDir(rtl ? "left" : "right");
        animKey.current += 1;

        goToV(vIndex + 1);
    };

    const goPrev = () => {
        if (adLocked) return;

        playPageTurn();
        setAnimDir(rtl ? "right" : "left");
        animKey.current += 1;

        goToV(vIndex - 1);
    };

    /* ───────────────────────────────────────────── */

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (adLocked) return;

            if (e.key === "ArrowRight") rtl ? goPrev() : goNext();
            else if (e.key === "ArrowLeft") rtl ? goNext() : goPrev();
            else if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [adLocked, rtl, vIndex]);

    /* ───────────────────────────────────────────── */

    const markLoaded = (i: number) => {
        setLoaded(prev => {
            const copy = [...prev];
            copy[i] = true;
            return copy;
        });
    };

    /* ───────────────────────────────────────────── */

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "#0a0a0a",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999
        }}>

            {/* HEADER */}
            <div style={{
                padding: 10,
                background: "#111",
                color: "#aaa",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <span>{title}</span>
                <button onClick={onClose}><X /></button>
            </div>

            {/* VIEWER */}
            <div
                ref={containerRef}
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative"
                }}
            >
                {/* AD LOCK OVERLAY */}
                {isAdPage && adLocked && (
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 20,
                        zIndex: 50
                    }}>
                        Ad ends in {adCountdown}s
                    </div>
                )}

                <div
                    key={animKey.current}
                    style={{
                        animation: animDir
                            ? `${animDir === "left" ? "slideInLeft" : "slideInRight"} 0.2s`
                            : undefined,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {isAdPage ? (
                        <AdCard variant="reader" />
                    ) : (
                        <img
                            src={images[currentRealIndex]}
                            style={{
                                maxHeight: "100%",
                                maxWidth: "100%",
                                objectFit: "contain"
                            }}
                        />
                    )}
                </div>
            </div>

            {/* NAV */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                padding: 10,
                background: "#111"
            }}>
                <button onClick={goPrev} disabled={adLocked}>Prev</button>
                <button onClick={goNext} disabled={adLocked}>Next</button>
            </div>
        </div>
    );
};

export default ImageReader;