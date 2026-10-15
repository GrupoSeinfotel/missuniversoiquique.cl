"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactFAQ() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqs = [
        { q: "¿Cual es el límite de edad para participar?", a: "Actualmente Miss Universo ha eliminado el límite de edad superior. Solo debes ser mayor de 18 años para postular." },
        { q: "¿Puedo participar si estoy casada o tengo hijos?", a: "Sí, las bases actuales permiten la participación de mujeres casadas, divorciadas, con hijos o embarazadas." },
        { q: "¿Es necesario tener experiencia previa en modelaje?", a: "No es requisito. Durante el certamen brindamos clases de pasarela, oratoria y proyección para todas las candidatas seleccionadas." },
        { q: "¿Tengo que vivir en Iquique?", a: "Debes tener residencia mínima de 6 meses en la Región de Tarapacá o haber nacido en la región." }
    ];

    return (
        <section id="contact-faq" className="section-padding" style={{ background: "var(--secondary-bg)" }}>
            <div className="container">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }} className="contact-grid">

                    {/* FAQ Side */}
                    <div>
                        <h3 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Preguntas Frecuentes</h3>
                        <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "40px" }}>DUDAS <span className="accent-text">COMUNES</span></h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {faqs.map((faq, i) => (
                                <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px" }}>
                                    <button
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        style={{
                                            width: "100%",
                                            background: "none",
                                            border: "none",
                                            color: "white",
                                            textAlign: "left",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            cursor: "pointer",
                                            padding: "10px 0"
                                        }}
                                    >
                                        {faq.q}
                                        <span>{openFaq === i ? "−" : "+"}</span>
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: "hidden", color: "var(--text-gray)", fontSize: "14px", lineHeight: "1.6", marginTop: "10px" }}
                                            >
                                                {faq.a}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Side */}
                    <div>
                        <h3 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "15px" }}>Contacto Directo</h3>
                        <h2 style={{ fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "40px" }}>ENVÍANOS UN <span className="accent-text">MENSAJE</span></h2>

                        <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <input type="text" placeholder="NOMBRE COMPLETO" style={inputStyle} />
                                <input type="email" placeholder="EMAIL" style={inputStyle} />
                            </div>
                            <input type="text" placeholder="ASUNTO" style={inputStyle} />
                            <textarea placeholder="¿EN QUÉ PODEMOS AYUDARTE?" rows={5} style={inputStyle}></textarea>
                            <button className="btn-primary" style={{ border: "none" }}>ENVIAR MENSAJE</button>
                        </form>
                    </div>

                </div>
            </div>

            <style jsx>{`
                @media (max-width: 1024px) {
                    .contact-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
                }
            `}</style>
        </section>
    );
}

const inputStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "15px",
    color: "white",
    fontSize: "12px",
    fontFamily: "var(--font-raleway)",
    letterSpacing: "1px",
    outline: "none"
};
