"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SponsorsExact() {
    const [sponsors, setSponsors] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/settings", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const sponsorsJson = data.find((s: any) => s.key === "UI_SPONSORS")?.value;
                    if (sponsorsJson) setSponsors(JSON.parse(sponsorsJson));
                    else {
                        setSponsors([
                            { name: "Sponsor 1", logo: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=200&auto=format&fit=crop" },
                            { name: "Sponsor 2", logo: "https://images.unsplash.com/photo-1549474843-ed830030f926?q=80&w=200&auto=format&fit=crop" },
                            { name: "Sponsor 3", logo: "https://images.unsplash.com/photo-1520155707362-70341eaae295?q=80&w=200&auto=format&fit=crop" },
                            { name: "Sponsor 4", logo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop" }
                        ]);
                    }
                }
            });
    }, []);

    return (
        <section id="sponsors" className="section-padding" style={{ background: "var(--primary-bg)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h3 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Nuestras Alianzas</h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>
                        PARTNERS & <span className="accent-text">SPONSORS</span>
                    </h2>
                    <p style={{ maxWidth: "600px", margin: "20px auto", color: "var(--text-gray)", fontSize: "15px" }}>
                        El éxito de nuestras reinas es posible gracias al apoyo de las marcas líderes que apuestan por el talento y el desarrollo de nuestra región.
                    </p>
                </div>

                <div className="sponsor-grid">
                    {sponsors.map((s, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ opacity: 1, filter: "grayscale(0)" }}
                            className="sponsor-card"
                            style={{ transition: "all 0.5s ease" }}
                        >
                            <img src={s.logo} alt={s.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", filter: "brightness(0.8)" }} />
                        </motion.div>
                    ))}
                </div>

                <div className="sponsor-cta">
                    <h3 style={{ fontSize: "24px", marginBottom: "20px", textTransform: "uppercase" }}>¿Quieres ser sponsor oficial?</h3>
                    <p style={{ color: "var(--text-gray)", marginBottom: "30px", maxWidth: "600px", margin: "0 auto 30px" }}>
                        Asocia tu marca con la elegancia, el éxito y el empoderamiento femenino. Ofrecemos exposición de alto impacto en eventos, redes sociales y nuestra plataforma digital.
                    </p>
                    <a href="mailto:contacto@missuniversoiquique.cl" className="btn-primary">SOLICITAR DOSSIER</a>
                </div>
            </div>
        </section>
    );
}
