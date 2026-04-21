"use client";

import { useEffect, useRef, useState } from "react";

const ADSENSE_CLIENT = "ca-pub-3844369896775247";
const ADSENSE_SLOT = "5129147754";

// TypeScript fix
declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

interface AdCardProps {
    variant?: "grid" | "reader";
}

const AdCard = ({ variant = "grid" }: AdCardProps) => {
    const adRef = useRef<HTMLDivElement>(null);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        try {
            if (typeof window === "undefined") return;

            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});

            // fallback delay (visual only)
            timer = setTimeout(() => {
                setShowFallback(true);
            }, 2500);
        } catch (err) {
            console.log("AdSense error:", err);
            setShowFallback(true);
        }

        return () => clearTimeout(timer);
    }, []);

    const AdUnit = (
        <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "100%" }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={ADSENSE_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
        />
    );

    const Fallback = (
        <div className="relative w-full h-full bg-black flex items-center justify-center">
            <img
                src="https://i.imgur.com/rBoRbuP.gif"
                alt="Tuturu~"
                className="max-w-full max-h-full object-contain"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <p className="text-white font-bold text-sm">Tuturu~</p>
            </div>

            <span className="absolute top-2 right-2 text-[9px] font-mono bg-black/70 text-white/50 px-1.5 py-0.5 rounded">
                AD
            </span>
        </div>
    );

    return (
        <div
            ref={adRef}
            className="relative overflow-hidden border border-border bg-card rounded-xl"
            style={{
                aspectRatio: variant === "grid" ? "3/4" : "auto",
                width: "100%",
                height: "100%",
            }}
        >
            {/* AdSense always renders */}
            {AdUnit}

            {/* Fallback overlay */}
            {showFallback && (
                <div className="absolute inset-0">
                    {Fallback}
                </div>
            )}

            {/* AD badge */}
            <span className="absolute top-2 right-2 text-[9px] font-mono bg-black/70 text-white/50 px-1.5 py-0.5 rounded">
                AD
            </span>
        </div>
    );
};

export default AdCard;