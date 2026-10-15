"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
    id: string;
    url: string;
    type: string;
}

interface CandidateGalleryProps {
    photos: Photo[];
    fullName: string;
}

export default function CandidateGallery({ photos, fullName }: CandidateGalleryProps) {
    const [index, setIndex] = useState<number | null>(null);

    useEffect(() => {
        if (index !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [index]);

    const next = () => setIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
    const prev = () => setIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (index === null) return;
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "Escape") setIndex(null);
        };
        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [index]);

    return (
        <div className="gallery-section">
            {/* Masonry-like Grid Layout - RESPONSIVE */}
            <div className="masonry-grid">
                {photos.slice(0, 3).map((photo, i) => (
                    <div
                        key={photo.id}
                        onClick={() => setIndex(i)}
                        className={`masonry-item item-${i}`}
                    >
                        <img
                            src={photo.url}
                            alt={`${fullName} - ${i}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            className="gallery-image"
                        />
                    </div>
                ))}
            </div>

            {/* Extended Portfolio Title */}
            <div style={{ textAlign: "center", margin: "120px 0 60px" }}>
                <h2 className="responsive-title" style={{ fontFamily: "var(--font-lora)", fontWeight: "400", letterSpacing: "8px", fontSize: "2rem", color: "white" }}>
                    PORTFOLIO <span style={{ color: "#dfc06d", fontWeight: "700" }}>EXTENDIDO</span>
                </h2>
                <div style={{ width: "60px", height: "2px", background: "#dfc06d", margin: "20px auto", opacity: 0.5 }}></div>
            </div>

            {/* Tight Grid Layout - RESPONSIVE */}
            <div className="portfolio-grid">
                {photos.map((photo, i) => (
                    <div
                        key={photo.id}
                        onClick={() => setIndex(i)}
                        className="portfolio-item"
                    >
                        <img
                            src={photo.url}
                            className="portfolio-thumb"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                ))}
            </div>

            {/* LIGHTBOX COMPONENT */}
            <AnimatePresence>
                {index !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.95)",
                            zIndex: 9999,
                            display: "flex",
                            flexDirection: "column",
                            color: "white"
                        }}
                    >
                        {/* Top Bar */}
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 20px", alignItems: "center" }}>
                            <div style={{ fontSize: "12px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)" }}>
                                {index + 1} / {photos.length}
                            </div>
                            <button onClick={() => setIndex(null)} style={{ background: "none", border: "none", color: "white", fontSize: "28px", cursor: "pointer" }}>✕</button>
                        </div>

                        {/* Main Image Area */}
                        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                            <button className="nav-btn prev" onClick={(e) => { e.stopPropagation(); prev(); }}>←</button>
                            <button className="nav-btn next" onClick={(e) => { e.stopPropagation(); next(); }}>→</button>

                            <motion.img
                                key={photos[index].url}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={photos[index].url}
                                style={{ maxHeight: "75vh", maxWidth: "100%", objectFit: "contain" }}
                            />
                        </div>

                        {/* Caption Area - Compact on Mobile */}
                        <div style={{ textAlign: "center", padding: "20px 0", background: "rgba(0,0,0,0.8)" }}>
                            <h3 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>{fullName}</h3>
                            <p style={{ color: "var(--accent-pink)", fontSize: "10px", marginTop: "5px", textTransform: "uppercase" }}>MU IQUIQUE 2026</p>
                        </div>

                        {/* Thumbnail Strip - Hidden on small mobile for space */}
                        <div className="desktop-only" style={{ height: "100px", background: "#000", borderTop: "1px solid rgba(223,192,109,0.2)", display: "flex", gap: "10px", padding: "15px", justifyContent: "center", overflowX: "auto" }}>
                            {photos.map((photo, i) => (
                                <div
                                    key={photo.id}
                                    onClick={() => setIndex(i)}
                                    style={{
                                        height: "100%",
                                        width: "60px",
                                        flexShrink: 0,
                                        cursor: "pointer",
                                        border: index === i ? "1px solid #dfc06d" : "1px solid transparent",
                                        opacity: index === i ? 1 : 0.4,
                                        transition: "all 0.3s ease",
                                        borderRadius: "4px",
                                        overflow: "hidden"
                                    }}
                                >
                                    <img src={photo.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
