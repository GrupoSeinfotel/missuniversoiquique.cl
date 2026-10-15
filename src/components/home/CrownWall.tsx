"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "date-fns";
import { es } from "date-fns/locale";

interface Post {
    id: string;
    content: string;
    imageUrl?: string;
    mediaJson?: string;
    legacyLikes?: number;
    legacyShares?: number;
    createdAt: string;
    author: {
        username?: string;
        role: string;
        candidate?: { fullName: string };
    };
}

export default function CrownWall() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/feed")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading feed", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
            <div className="spinner"></div>
            <p style={{ color: "var(--text-gray)", marginTop: "20px" }}>Cargando el Muro...</p>
        </div>
    );

    if (posts.length === 0) return null;

    return (
        <section id="crown-wall" className="section-padding" style={{ background: "var(--secondary-bg)" }}>
            <div className="container" style={{ maxWidth: "800px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h3 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Actualizaciones en Vivo</h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "3px" }}>
                        MURO DE LA <span className="accent-text">CORONA</span>
                    </h2>
                    <div style={{ width: "40px", height: "2px", background: "var(--accent-pink)", margin: "20px auto" }}></div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    {posts.map((post, idx) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                                background: "var(--primary-bg)",
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.05)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                            }}
                        >
                            {/* Header */}
                            <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: "15px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    background: "var(--accent-pink)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "800",
                                    fontSize: "14px"
                                }}>
                                    {post.author.username?.[0]?.toUpperCase() || "M"}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "14px", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
                                        {post.author.candidate?.fullName || post.author.username || "Organización"}
                                    </h4>
                                    <span style={{ fontSize: "10px", color: "var(--accent-pink)", textTransform: "uppercase", fontWeight: "700" }}>
                                        {post.author.role} • {formatDate(new Date(post.createdAt), "dd 'de' MMMM", { locale: es })}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: "25px", color: "white", lineHeight: "1.6", fontSize: "15px" }}>
                                {post.content}
                            </div>

                            {/* Media (Images/Videos) */}
                            {(() => {
                                let media: any[] = [];
                                try {
                                    media = post.mediaJson ? JSON.parse(post.mediaJson) : (post.imageUrl ? [{ type: "IMAGE", url: post.imageUrl }] : []);
                                } catch (e) {
                                    media = post.imageUrl ? [{ type: "IMAGE", url: post.imageUrl }] : [];
                                }

                                if (media.length === 0) return null;

                                return (
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: media.length > 1 ? "repeat(2, 1fr)" : "1fr",
                                        gap: "2px",
                                        background: "rgba(0,0,0,0.1)",
                                        maxHeight: "600px",
                                        overflow: "hidden"
                                    }}>
                                        {media.slice(0, 4).map((m: any, mi: number) => (
                                            <div key={mi} style={{ position: "relative", height: media.length === 1 ? "auto" : "250px" }}>
                                                {m.type === "VIDEO" ? (
                                                    <video
                                                        src={m.url}
                                                        autoPlay
                                                        muted
                                                        loop
                                                        playsInline
                                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                    />
                                                ) : (
                                                    <img
                                                        src={m.url}
                                                        alt="Update"
                                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                                    />
                                                )}
                                                {media.length > 4 && mi === 3 && (
                                                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: "900" }}>
                                                        +{media.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* Footer / Interaction */}
                            <div style={{ padding: "15px 20px", display: "flex", gap: "25px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <span style={{ fontSize: "13px", color: "var(--accent-pink)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                                    ♥ {post.legacyLikes || 0} <span style={{ opacity: 0.5, fontWeight: "normal" }}>Me gusta</span>
                                </span>
                                <span style={{ fontSize: "13px", color: "#3b82f6", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
                                    💬 {post.legacyShares || 0} <span style={{ opacity: 0.5, fontWeight: "normal" }}>Compartidos</span>
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <p style={{ color: "var(--text-gray)", fontSize: "14px" }}>
                        Sigue todas las actualizaciones oficiales minuto a minuto.
                    </p>
                </div>
            </div>
        </section>
    );
}
