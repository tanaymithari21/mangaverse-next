"use client";

import { useEffect, useRef, useState } from "react";

const ADSENSE_CLIENT = "ca-pub-3844369896775247";
const ADSENSE_SLOT = "5129147754";

const TUTURU_IMAGE = "https://i.imgur.com/7QsJ1bI.png";

// ✅ FIX TYPE ERROR HERE
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
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});

            timer = setTimeout(() => {
                setShowFallback(true);
            }, 2500);
        } catch (err) {
            setShowFallback(true);
        }

        return () => clearTimeout(timer);
    }, []);

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
            <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%", height: "100%" }}
                data-ad-client={ADSENSE_CLIENT}
                data-ad-slot={ADSENSE_SLOT}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />

            {showFallback && (
                <div className="absolute inset-0">
                    <img
                        src={TUTURU_IMAGE}
                        className="w-full h-full object-cover"
                        alt="Tuturu~"
                    />
                </div>
            )}

            <span className="absolute top-2 right-2 text-[9px] font-mono bg-black/70 text-white/50 px-1.5 py-0.5 rounded">
                AD
            </span>
        </div>
    );
};

export default AdCard;