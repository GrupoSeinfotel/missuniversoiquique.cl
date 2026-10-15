"use client";
import { motion } from "framer-motion";

export default function History() {
    return (
        <section className="section-padding" style={{ background: "var(--secondary-bg)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <h4 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Nuestra Trayectoria</h4>
                    <h2 style={{ fontSize: "3.5rem", textTransform: "uppercase", letterSpacing: "5px" }}>HISTORIA DE LA FRANQUICIA</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px" }}>
                    {[
                        { year: "2023", title: "El Nuevo Comienzo", text: "Relanzamiento de la franquicia en Iquique con una visión moderna de empoderamiento." },
                        { year: "2024", title: "Consolidación", text: "Nuestras candidatas destacaron a nivel nacional, llevando la belleza de Tarapacá al mundo." },
                        { year: "2025", title: "Próxima Corona", text: "Buscamos a la próxima embajadora que rompa esquemas y represente nuestra identidad." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            style={{
                                padding: "40px",
                                background: "var(--primary-bg)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                textAlign: "center"
                            }}
                        >
                            <div style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--accent-pink)", marginBottom: "20px", opacity: 0.5 }}>
                                {item.year}
                            </div>
                            <h3 style={{ fontSize: "1.5rem", textTransform: "uppercase", marginBottom: "15px" }}>{item.title}</h3>
                            <p style={{ color: "var(--text-gray)", lineHeight: "1.7" }}>{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
