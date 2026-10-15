"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaExternalLinkAlt, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

export default function CitySpotGrid() {
    const [spots, setSpots] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/public/city-content")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setSpots(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading spots:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner"></div>
            <p style={{ marginTop: "15px", color: "var(--text-gray)" }}>Cargando recomendaciones...</p>
        </div>
    );

    if (spots.length === 0) return null;

    return (
        <section style={{ padding: "80px 0", background: "rgba(0,0,0,0.2)", borderRadius: "30px", margin: "40px 0" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                    <h2 className="serif-italic accent-text" style={{ fontSize: "1.2rem" }}>Contenido Exclusivo</h2>
                    <h2 style={{ fontSize: "2rem", textTransform: "uppercase", letterSpacing: "3px", marginTop: "10px" }}>
                        LA CIUDAD POR NUESTRAS <span className="accent-text">CANDIDATAS</span>
                    </h2>
                    <div style={{ width: "60px", height: "3px", background: "var(--accent-pink)", margin: "20px auto" }}></div>
                </div>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
                    gap: "30px" 
                }}>
                    {spots.map((spot) => (
                        <motion.div 
                            key={spot.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            style={{ 
                                background: "#111", 
                                borderRadius: "20px", 
                                overflow: "hidden", 
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                            }}
                        >
                            {/* Media Section */}
                            <div style={{ position: "relative", height: "220px", background: "#000" }}>
                                {spot.mediaUrl ? (
                                    <div style={{ width: "100%", height: "100%", position: "relative" }}>
                                        <img 
                                            src={spot.mediaUrl} 
                                            alt={spot.title} 
                                            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} 
                                        />
                                        <div style={{ 
                                            position: "absolute", 
                                            inset: 0, 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center" 
                                        }}>
                                            {spot.socialLink ? (
                                                <a 
                                                    href={spot.socialLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ 
                                                        width: "50px", 
                                                        height: "50px", 
                                                        background: "var(--accent-pink)", 
                                                        borderRadius: "50%", 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        justifyContent: "center",
                                                        color: "white",
                                                        boxShadow: "0 0 20px rgba(245, 36, 95, 0.4)"
                                                    }}
                                                >
                                                    <FaPlay size={18} />
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ 
                                        width: "100%", 
                                        height: "100%", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center",
                                        background: "linear-gradient(45deg, #111, #222)"
                                    }}>
                                        <FaMapMarkerAlt size={40} style={{ color: "#333" }} />
                                    </div>
                                )}
                                
                                <div style={{ 
                                    position: "absolute", 
                                    bottom: "15px", 
                                    left: "15px", 
                                    background: "rgba(0,0,0,0.7)", 
                                    padding: "5px 12px", 
                                    borderRadius: "20px",
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                    color: "white"
                                }}>
                                    {spot.title}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div style={{ padding: "20px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                                    <div style={{ 
                                        width: "30px", 
                                        height: "30px", 
                                        background: "var(--accent-pink)", 
                                        borderRadius: "50%", 
                                        display: "flex", 
                                        alignItems: "center", 
                                        justifyContent: "center",
                                        fontSize: "0.8rem",
                                        fontWeight: "bold",
                                        color: "white"
                                    }}>
                                        {spot.candidateName.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{spot.candidateName}</div>
                                        <a 
                                            href={`/candidata/${spot.candidateSlug}`} 
                                            style={{ fontSize: "0.75rem", color: "var(--accent-pink)", textDecoration: "none" }}
                                        >
                                            Ver Perfil & Votar
                                        </a>
                                    </div>
                                </div>

                                <p style={{ 
                                    fontSize: "0.85rem", 
                                    color: "var(--text-gray)", 
                                    lineHeight: "1.6",
                                    minHeight: "40px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                }}>
                                    {spot.comment || "Descubre los mejores rincones de nuestra ciudad con nuestras candidatas."}
                                </p>

                                {spot.socialLink && (
                                    <a 
                                        href={spot.socialLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ 
                                            display: "flex", 
                                            alignItems: "center", 
                                            gap: "8px", 
                                            marginTop: "15px", 
                                            fontSize: "0.8rem", 
                                            color: "rgba(255,255,255,0.4)", 
                                            textDecoration: "none" 
                                        }}
                                    >
                                        <FaExternalLinkAlt size={10} /> Ver contenido original
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    border-top-color: var(--accent-pink);
                    animation: spin 1s ease-in-out infinite;
                    margin: 0 auto;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
}
