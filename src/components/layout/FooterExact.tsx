"use client";
import { useState, useEffect } from "react";

export default function FooterExact() {
    const [logo, setLogo] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => {
                if (!res.ok) return [];
                return res.json().catch(() => []);
            })
            .then(data => {
                if (Array.isArray(data)) {
                    const logoSetting = data.find((s: any) => s.key === "SITE_LOGO");
                    if (logoSetting) setLogo(logoSetting.value);
                }
            })
            .catch(err => console.error("Error loading logo in footer", err));
    }, []);

    return (
        <footer style={{ background: "#111111", padding: "80px 0 30px", borderTop: "5px solid var(--accent-pink)" }}>
            <div className="container footer-grid">
                {/* Column 1: Logo & About */}
                <div className="footer-col">
                    {logo ? (
                        <img src={logo} alt="Logo" style={{ height: "50px", marginBottom: "20px" }} />
                    ) : (
                        <h2 style={{ fontSize: "24px", color: "white", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "2px" }}>
                            MU <span className="accent-text">IQUIQUE</span>
                        </h2>
                    )}
                    <p style={{ color: "var(--text-gray)", lineHeight: "1.7", fontSize: "14px" }}>
                        La plataforma oficial de la búsqueda de la próxima soberana de la Tierra de Campeones. Uniendo belleza, talento y propósito.
                    </p>
                </div>

                {/* Column 2: Contact */}
                <div className="footer-col">
                    <h4 className="footer-title">CONTACTO</h4>
                    <p style={{ color: "var(--text-gray)", lineHeight: "2", fontSize: "14px" }}>
                        Iquique, Región de Tarapacá<br />
                        contacto@missuniversoiquique.cl<br />
                        @missuniversoiquique
                    </p>
                </div>

                {/* Column 3: Newsletter */}
                <div className="footer-col">
                    <h4 className="footer-title">BOLETÍN</h4>
                    <p style={{ color: "var(--text-gray)", fontSize: "13px", marginBottom: "15px" }}>Suscríbete para recibir noticias del certamen.</p>
                    <div className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Tu Email"
                            className="newsletter-input"
                        />
                        <button className="newsletter-btn">OK</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p style={{ color: "#555", fontSize: "12px", margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>
                    &copy; 2026 MISS UNIVERSE IQUIQUE OS. | DESARROLLADO POR <a href="https://www.instagram.com/juanc.limache" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-pink)", textDecoration: "none", fontWeight: "bold" }}>@juanc.limache</a>
                </p>
            </div>

            <style jsx>{`
                .footer-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 50px;
                    margin-bottom: 60px;
                }
                .footer-title { fontSize: 16px; color: white; marginBottom: 20px; textTransform: uppercase; }
                .newsletter-form { display: flex; gap: 10px; }
                .newsletter-input {
                    background: #222;
                    border: none;
                    padding: 10px;
                    color: white;
                    flex: 1;
                    font-size: 13px;
                }
                .newsletter-btn {
                    background: var(--accent-pink);
                    border: none;
                    color: white;
                    padding: 10px 20px;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 12px;
                    cursor: pointer;
                }
                .footer-bottom { 
                    text-align: center; 
                    border-top: 1px solid #222; 
                    padding-top: 30px; 
                    padding-left: 20px; 
                    padding-right: 20px;
                }

                @media (max-width: 1024px) {
                    .footer-grid { grid-template-columns: 1fr 1fr; }
                }

                @media (max-width: 768px) {
                    .footer-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
                    .newsletter-form { max-width: 400px; margin: 0 auto; }
                    .footer-bottom p { font-size: 10px; }
                }
            `}</style>
        </footer>
    );
}
