"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function HallOfFameExact() {
    const [winners, setWinners] = useState([
        { year: "2024", name: "Valentina Sánchez", title: "Miss Universe Iquique 2024", photo: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=1964&auto=format&fit=crop" },
        { year: "2023", name: "Constanza Morales", title: "Miss Universe Iquique 2023", photo: "https://images.unsplash.com/photo-1549474843-ed830030f926?q=80&w=2070&auto=format&fit=crop" }
    ]);
    const [content, setContent] = useState({
        subtitle: "Nuestro Legado",
        description: "Honramos a las mujeres que han llevado la banda de nuestra ciudad con orgullo, inteligencia y propósito."
    });

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                const hf = data.find((s: any) => s.key === "UI_HALL_OF_FAME")?.value;
                if (hf) setWinners(JSON.parse(hf));

                const sub = data.find((s: any) => s.key === "HOF_SUBTITLE")?.value;
                const desc = data.find((s: any) => s.key === "HOF_DESCRIPTION")?.value;
                if (sub || desc) setContent({
                    subtitle: sub || content.subtitle,
                    description: desc || content.description
                });
            })
            .catch(err => console.error("HOF fetch error", err));
    }, []);

    return (
        <section id="hall-of-fame" className="section-padding" style={{ background: "var(--primary-bg)", overflow: "hidden" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "80px" }}>
                    <h3 className="serif-italic accent-text" style={{ fontSize: "1.4rem", marginBottom: "15px" }}>{content.subtitle}</h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "5px", marginBottom: "20px" }}>
                        SALÓN DE LA <span className="accent-text">FAMA</span>
                    </h2>
                    <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--text-gray)", lineHeight: "1.6" }}>
                        {content.description}
                    </p>
                    <div style={{ width: "60px", height: "1px", background: "var(--accent-pink)", margin: "40px auto" }}></div>
                </div>

                <div className="hof-grid">
                    {winners.map((winner, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -15 }}
                            className="hof-card"
                        >
                            <div className="hof-photo-wrapper">
                                <img src={winner.photo} alt={winner.name} className="hof-img" />
                                <div className="hof-overlay">
                                    <div className="hof-year">{winner.year}</div>
                                </div>
                            </div>
                            <div className="hof-info">
                                <h4 style={{ fontSize: "18px", color: "white", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 5px 0" }}>{winner.name}</h4>
                                <p style={{ color: "var(--accent-pink)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>{winner.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hof-grid {
                    display: flex;
                    justify-content: center;
                    gap: 60px;
                    flex-wrap: wrap;
                }
                .hof-card {
                    width: 350px;
                    text-align: center;
                    cursor: pointer;
                }
                .hof-photo-wrapper {
                    position: relative;
                    height: 500px;
                    overflow: hidden;
                    margin-bottom: 25px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .hof-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background: #050505;
                    transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .hof-card:hover .hof-img { transform: scale(1.1); }
                
                .hof-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding-bottom: 40px;
                }
                .hof-year {
                    font-size: 80px;
                    font-weight: 900;
                    color: white;
                    opacity: 0.1;
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    line-height: 1;
                }
                .hof-info { transition: all 0.3s ease; }

                @media (max-width: 768px) {
                    .hof-grid { gap: 30px; }
                    .hof-card { width: 100%; max-width: 380px; }
                    .hof-photo-wrapper { height: 450px; }
                    .hof-year { font-size: 60px; }
                }
            `}</style>
        </section>
    );
}
