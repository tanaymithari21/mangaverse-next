"use client";
import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, BookOpen, BookMarked, Maximize2, Minimize2 } from "lucide-react";

interface ImageReaderProps {
    images: string[];
    title?: string;
    onClose: () => void;
}

// Slide animation
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

// Page turn sound
const playPageTurn = () => {
    try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        const t = ctx.currentTime;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, t);

        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(800, t);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(t + 0.1);
    } catch { }
};

const ImageReader: React.FC<ImageReaderProps> = ({ images, title, onClose }) => {
    const [index, setIndex] = useState(0);
    const [rtl, setRtl] = useState(false);
    const [twoPage, setTwoPage] = useState(false);
    const [immersive, setImmersive] = useState(false);
    const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);

    const animKey = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const total = images.length;

    const goNext = () => {
        if (index >= total - 1) return;
        playPageTurn();
        setAnimDir(rtl ? "left" : "right");
        animKey.current++;
        setIndex(prev => Math.min(prev + (twoPage ? 2 : 1), total - 1));
    };

    const goPrev = () => {
        if (index <= 0) return;
        playPageTurn();
        setAnimDir(rtl ? "right" : "left");
        animKey.current++;
        setIndex(prev => Math.max(prev - (twoPage ? 2 : 1), 0));
    };

    const onClickLeft = () => rtl ? goNext() : goPrev();
    const onClickRight = () => rtl ? goPrev() : goNext();

    // Keyboard
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") rtl ? goPrev() : goNext();
            else if (e.key === "ArrowLeft") rtl ? goNext() : goPrev();
            else if (e.key === "Escape") onClose();
            else if (e.key.toLowerCase() === "f") setImmersive(v => !v);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [index, rtl, twoPage]);

    const renderPage = (i: number) => {
        if (i < 0 || i >= total) return null;

        return (
            <img
                key={i}
                src={images[i]}
                alt={`Page ${i + 1}`}
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                }}
            />
        );
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0a0a0a",
            display: "flex",
            flexDirection: "column"
        }}>

            {/* Top Bar */}
            {!immersive && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 10,
                    background: "#111"
                }}>
                    <span>{title}</span>

                    <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={() => setTwoPage(v => !v)}>2P</button>
                        <button onClick={() => setRtl(v => !v)}>RTL</button>
                        <button onClick={() => setImmersive(v => !v)}>
                            {immersive ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                        <button onClick={onClose}><X size={16} /></button>
                    </div>
                </div>
            )}

            {/* Viewer */}
            <div
                ref={containerRef}
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative"
                }}
            >
                <div onClick={onClickLeft} style={{ position: "absolute", left: 0, width: "30%", height: "100%" }} />
                <div onClick={onClickRight} style={{ position: "absolute", right: 0, width: "30%", height: "100%" }} />

                <div
                    key={animKey.current}
                    style={{
                        display: "flex",
                        gap: 10,
                        animation: animDir
                            ? `${animDir === "left" ? "slideInLeft" : "slideInRight"} 0.2s`
                            : undefined
                    }}
                >
                    {renderPage(index)}
                    {twoPage && renderPage(index + 1)}
                </div>
            </div>

            {/* Footer */}
            {!immersive && (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    padding: 10,
                    background: "#111"
                }}>
                    <button onClick={goPrev}><ChevronLeft /></button>
                    <span>{index + 1} / {total}</span>
                    <button onClick={goNext}><ChevronRight /></button>
                </div>
            )}
        </div>
    );
};

export default ImageReader;