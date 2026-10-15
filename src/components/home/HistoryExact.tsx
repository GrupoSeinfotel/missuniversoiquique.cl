"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HistoryExact() {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/settings", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const historyJson = data.find((s: any) => s.key === "UI_HISTORY")?.value;
                    if (historyJson) {
                        try {
                            setHistory(JSON.parse(historyJson));
                            return;
                        } catch (e) { console.error("Error parsing history", e); }
                    }
                }
                // Fallback to defaults
                setHistory([
                    { year: "2023", title: "EL COMIENZO", text: "Relanzamiento de la franquicia en Iquique con una visión moderna de liderazgo femenino." },
                    { year: "2024", title: "EVOLUCIÓN", text: "Nuestras candidatas destacaron a nivel nacional, llevando la belleza de Tarapacá al epicentro del país." },
                    { year: "2025", title: "EL FUTURO", text: "Buscamos a la próxima embajadora que rompa esquemas y lidere con propósito e impacto social." }
                ]);
            });
    }, []);

    return (
        <section id="history" className="section-padding" style={{ background: "var(--primary-bg)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h3 className="serif-italic" style={{ color: "var(--accent-pink)", fontSize: "24px", marginBottom: "10px" }}>
                        Nuestro Legado
                    </h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>
                        LA HISTORIA DE LA <span className="accent-text">FRANQUICIA</span>
                    </h2>
                    <p style={{ maxWidth: "700px", margin: "20px auto", color: "var(--text-gray)", lineHeight: "1.6" }}>
                        Miss Universo Iquique nace con el propósito de encontrar a la mujer que represente la fuerza, el carisma y la autenticidad de la mujer iquiqueña ante Chile y el mundo.
                    </p>
                </div>

                <div className="history-grid">
                    {history.map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="history-card"
                            style={{ display: 'flex', flexDirection: 'column' }}
                        >
                            <div className="history-year">
                                {item.year}
                            </div>

                            {/* Media Preview for History */}
                            {item.media && item.media.length > 0 && (
                                <div style={{ height: "150px", borderRadius: "10px", overflow: "hidden", marginBottom: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    {item.media[0].type === "VIDEO" ? (
                                        <video src={item.media[0].url} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <img src={item.media[0].url} style={{ width: "100%", height: "100%", objectFit: "contain", background: "rgba(0,0,0,0.5)" }} />
                                    )}
                                </div>
                            )}

                            <h4 style={{ fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>{item.title}</h4>
                            <p style={{ color: "var(--text-gray)", fontSize: "14px", lineHeight: "1.7" }}>{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
