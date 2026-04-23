"use client";

import { useEffect, useRef, useState } from "react";

const ADSENSE_CLIENT = "ca-pub-3844369896775247";
const ADSENSE_SLOT = "5129147754";

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
    const [adLoaded, setAdLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const timer = setTimeout(() => {
            try {
                if (adLoaded) return;

                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
                setAdLoaded(true);
            } catch (err) {
                console.log("AdSense error:", err);
                setShowFallback(true);
            }
        }, 1000); // delay helps avoid policy issues

        return () => clearTimeout(timer);
    }, [adLoaded]);

    return (
        <div
            ref={adRef}
            className="relative overflow-hidden border border-border bg-card rounded-xl"
            style={{
                width: "100%",
                minHeight: "250px",
            }}
        >
            {/* AdSense */}
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={ADSENSE_CLIENT}
                data-ad-slot={ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />

            {/* Fallback */}
            {showFallback && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <span className="text-white text-sm">Ad loading...</span>
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