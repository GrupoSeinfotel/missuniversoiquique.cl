"use client";
import { useState, useEffect } from "react";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import CitySpotGrid from "@/components/ui/CitySpotGrid";

export default function DiscoverIquique() {
    const [spots, setSpots] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const spotsJson = data.find((s: any) => s.key === "UI_SPOTS")?.value;
                    if (spotsJson) {
                        try {
                            const parsed = JSON.parse(spotsJson);
                            // Ensure backward compatibility
                            setSpots(parsed.map((s: any) => ({
                                ...s,
                                media: s.media || (s.image ? [{ type: "IMAGE", url: s.image }] : [])
                            })));
                            return;
                        } catch (e) { console.error("Error parsing spots", e); }
                    }
                }
                // Fallback to defaults
                setSpots([
                    {
                        title: "Playa Cavancha",
                        desc: "El corazón de Iquique. Una playa de arenas blancas y aguas templadas protegidas por la Península, ideal para el surf y paseos al atardecer.",
                        media: [{ type: "IMAGE", url: "https://images.unsplash.com/photo-1590510326493-f35c602c3498?q=80&w=1200" }]
                    },
                    {
                        title: "Paseo Baquedano",
                        desc: "Un viaje al siglo XIX. Casas de pino oregón con arquitectura georgiana que narran la época de oro del salitre en la región.",
                        media: [{ type: "IMAGE", url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1200" }]
                    }
                ]);
            });
    }, []);

    return (
        <div style={{ background: "var(--primary-bg)", color: "white" }}>
            <HeaderExact />

            <main style={{ paddingTop: "120px" }}>
                <section className="section-padding">
                    <div className="container">
                        <div style={{ textAlign: "center", marginBottom: "80px" }}>
                            <h4 className="serif-italic accent-text" style={{ fontSize: "1.5rem" }}>Tierra de Campeones</h4>
                            <h1 style={{ fontSize: "3.5rem", textTransform: "uppercase", letterSpacing: "5px", margin: "20px 0" }}>
                                DESCUBRE <span className="accent-text">IQUIQUE</span>
                            </h1>
                            <p style={{ maxWidth: "700px", margin: "0 auto", color: "var(--text-gray)", lineHeight: "1.8" }}>
                                Miss Universe Iquique no es solo un certamen de belleza, es una plataforma para proyectar nuestra cultura, paisajes y patrimonio al mundo entero.
                            </p>
                        </div>

                        <div style={{ display: "grid", gap: "100px" }}>
                            {spots.map((spot, i) => (
                                <ScrollReveal key={i} direction={i % 2 === 0 ? "left" : "right"}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: i % 2 === 0 ? "1.2fr 1fr" : "1fr 1.2fr",
                                        gap: "50px",
                                        alignItems: "center"
                                    }} className="spot-grid">
                                        {i % 2 !== 0 && (
                                            <div style={{ textAlign: "right" }}>
                                                <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", marginBottom: "20px" }}>{spot.title}</h2>
                                                <p style={{ color: "var(--text-gray)", lineHeight: "1.8" }}>{spot.desc}</p>
                                            </div>
                                        )}

                                        {/* Media Gallery for the spot */}
                                        <div style={{
                                            display: "flex",
                                            gap: "10px",
                                            overflowX: "auto",
                                            paddingBottom: "20px",
                                            scrollbarWidth: "none"
                                        }}>
                                            {(spot.media || []).map((m: any, mi: number) => (
                                                <div key={mi} style={{
                                                    minWidth: (spot.media || []).length > 1 ? "80%" : "100%",
                                                    height: "450px",
                                                    borderRadius: "20px",
                                                    overflow: "hidden",
                                                    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    position: "relative"
                                                }}>
                                                    {m.type === "VIDEO" ? (
                                                        <video src={m.url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "contain", background: "black" }} />
                                                    ) : (
                                                        <img src={m.url} alt={spot.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    )}
                                                </div>
                                            ))}
                                            {(!spot.media || spot.media.length === 0) && (
                                                <div style={{ height: "450px", width: "100%", background: "#222", borderRadius: "20px" }} />
                                            )}
                                        </div>

                                        {i % 2 === 0 && (
                                            <div>
                                                <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", marginBottom: "20px" }}>{spot.title}</h2>
                                                <p style={{ color: "var(--text-gray)", lineHeight: "1.8" }}>{spot.desc}</p>
                                            </div>
                                        )}
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                <CitySpotGrid />

                <section style={{ padding: "100px 0", background: "linear-gradient(to bottom, transparent, var(--secondary-bg))", textAlign: "center" }}>
                    <div className="container">
                        <h2 style={{ fontSize: "30px", marginBottom: "30px", textTransform: "uppercase" }}>Iquique te espera</h2>
                        <p style={{ color: "var(--text-gray)", marginBottom: "40px", maxWidth: "600px", margin: "0 auto 40px" }}>
                            Únete a nosotros en la gala final y vive la experiencia de una ciudad que combina la modernidad con la mística del desierto y el mar.
                        </p>
                        <a href="/#models" className="btn-primary">VER CANDIDATAS</a>
                    </div>
                </section>
            </main>

            <FooterExact />

            <style jsx>{`
                .zoom-img:hover { transform: scale(1.05); }
                @media (max-width: 900px) {
                    .spot-grid { grid-template-columns: 1fr !important; gap: 30px !important; text-align: center !important; }
                }
            `}</style>
        </div>
    );
}
