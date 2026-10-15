"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function InstagramExact() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch("https://feeds.behold.so/BnMJWGRMWvVKtFsQ0I0d")
            .then(res => {
                if (!res.ok) {
                    console.warn("Instagram feed currently unavailable (Status: " + res.status + ")");
                    return { posts: [] };
                }
                return res.json();
            })
            .then(data => {
                if (data.posts && Array.isArray(data.posts)) {
                    setPosts(data.posts.slice(0, 6));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching Instagram feed", err);
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <section id="instagram" style={{ background: "#050505", padding: "100px 0" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h3 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Nuestro Día a Día</h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "5px", marginBottom: "15px" }}>SÍGUENOS EN <span className="accent-text">INSTAGRAM</span></h2>
                    <a
                        href="https://instagram.com/missuniversoiquique.cl"
                        target="_blank"
                        className="accent-text"
                        style={{ textDecoration: "none", fontWeight: "bold", fontSize: "16px", letterSpacing: "2px" }}
                    >
                        @MISSUNIVERSOIQUIQUE.CL
                    </a>
                </div>

                <div className="ig-grid">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="ig-item loading-skeleton"></div>
                        ))
                    ) : error || posts.length === 0 ? (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-gray)" }}>
                            <p>No se pudo cargar el feed en este momento.</p>
                            <a href="https://instagram.com/missuniversoiquique.cl" target="_blank" className="btn-primary" style={{ marginTop: "20px", display: "inline-block" }}>VER INSTAGRAM DIRECTO</a>
                        </div>
                    ) : (
                        posts.map((post, i) => {
                            const imageUrl = post.sizes?.medium?.mediaUrl || post.thumbnailUrl || post.mediaUrl;
                            return (
                                <motion.a
                                    key={post.id}
                                    href={post.permalink}
                                    target="_blank"
                                    whileHover={{ scale: 1.05 }}
                                    className="ig-item"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <img src={imageUrl} alt="Instagram post" className="ig-img" />
                                    <div className="ig-overlay">
                                        <span style={{ fontSize: "24px" }}>{post.mediaType === 'VIDEO' ? '▶' : '♥'}</span>
                                    </div>
                                </motion.a>
                            );
                        })
                    )}
                </div>

                {!loading && !error && posts.length > 0 && (
                    <div style={{ textAlign: "center", marginTop: "50px" }}>
                        <a href="https://instagram.com/missuniversoiquique.cl" target="_blank" className="btn-hero-outline" style={{ fontSize: '12px' }}>VER MÁS EN INSTAGRAM</a>
                    </div>
                )}
            </div>

            <style jsx>{`
                .ig-grid {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 15px;
                }
                .ig-item {
                    position: relative;
                    aspect-ratio: 1;
                    overflow: hidden;
                    display: block;
                    background: #111;
                    border-radius: 8px;
                }
                .loading-skeleton {
                    background: linear-gradient(90deg, #0a0a0a 25%, #151515 50%, #0a0a0a 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                }
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .ig-img { width: 100%; height: 100%; object-fit: cover; }
                .ig-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(245, 36, 95, 0.4);
                    opacity: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.3s ease;
                    color: white;
                }
                .ig-item:hover .ig-overlay { opacity: 1; }

                @media (max-width: 1024px) {
                    .ig-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 600px) {
                    .ig-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
                    h2 { font-size: 1.5rem !important; }
                }
            `}</style>
        </section>
    );
}
