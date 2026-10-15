"use client";
import { useState, Suspense } from "react";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import { motion, AnimatePresence } from "framer-motion";
import SponsorPurchaseModal from "@/components/sponsors/SponsorPurchaseModal";
import { FaCheck, FaTimes, FaInfoCircle, FaCrown, FaStar, FaLightbulb, FaHandshake, FaBullhorn, FaCamera, FaVideo } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function SponsorsPage() {
    return (
        <Suspense fallback={null}>
            <SponsorsContent />
        </Suspense>
    );
}

function SponsorsContent() {
    const searchParams = useSearchParams();
    const candidateRef = searchParams.get("ref");
    const [selectedPlan, setSelectedPlan] = useState<{ id: string, name: string } | null>(null);

    const plans = [
        {
            id: "EMPRENDEDOR",
            name: "Emprendedor",
            price: "$200.000",
            period: "Contrato x 6 meses",
            features: [
                { text: "Canje publicitario (Máx. 2 candidatas elegidas por MU)", included: true, bold: true },
                { text: "4 historias al mes (24 en total)", included: true },
                { text: "1 video spot publicitario en feed colaborativo", included: true },
                { text: "Mención en 1 Reel de candidata", included: true },
                { text: "Logo en nuestro Backdrop (Muro publicitario) en todos nuestros eventos", included: true },
                { text: "Mención en Gala Final", included: true },
                { text: "1 entrada general Gala Final", included: true },
                { text: "Roler publicitario en la Gala Final (24 de Abril)", included: true }
            ]
        },
        {
            id: "PYME_PLUS",
            name: "Empresa",
            price: "$400.000",
            period: "Contrato x 6 meses",
            features: [
                { text: "Canje con hasta 4 candidatas (Tú las eliges)", included: true, bold: true },
                { text: "Roler publicitario en Gala (Banner en zona MU)", included: true, bold: true },
                { text: "Cápsula PREMIUM: Video Entrevista Profesional 'Storytelling' en tu local", included: true, highlight: true },
                { text: "8 historias al mes (48 en total)", included: true },
                { text: "1 video spot publicitario en feed colaborativo", included: true },
                { text: "Mención en 1 Reel de candidata", included: true },
                { text: "Logo en nuestro Backdrop (Muro publicitario) en todos nuestros eventos", included: true },
                { text: "Mención en Gala Final", included: true },
                { text: "1 entrada preliminar y 2 entradas VIP Gala Final", included: true, bold: true }
            ],
            highlight: true
        },
        {
            id: "EMPRESA_PRO",
            name: "Empresa Pro",
            price: "$800.000",
            period: "Contrato x 6 meses",
            features: [
                { text: "Canje ILIMITADO con candidatas (Producciones y RRSS)", included: true, bold: true },
                { text: "Stand publicitario, exhibición de productos y/o anfitrion@s en Gala Final", included: true, bold: true },
                { text: "Producción de ÉLITE: Video Spot Dedicado, Entrevista y Reportaje Cinematográfico en tu local", included: true, highlight: true },
                { text: "Roler publicitario en Gala (Ubicación Preferencial)", included: true },
                { text: "16 historias al mes (96 en total)", included: true },
                { text: "2 publicaciones en feed/reels colaborativos", included: true },
                { text: "Mención en 1 Reel de candidata", included: true },
                { text: "Logo en nuestro Backdrop (Muro publicitario) en todos nuestros eventos", included: true },
                { text: "Mención en Gala Final", included: true },
                { text: "4 entradas VIP Gala Final y 2 entradas VIP Preliminar", included: true, bold: true }
            ]
        }
    ];

    return (
        <div style={{ background: "var(--primary-bg)", color: "white", minHeight: "100vh" }}>
            <HeaderExact />

            <main style={{ paddingTop: "120px" }}>
                <section className="section-padding">
                    <div className="container">
                        <div style={{ textAlign: "center", marginBottom: "60px" }}>
                            <h4 className="serif-italic accent-text" style={{ fontSize: "1.5rem" }}>Partnership Program (Iquique)</h4>
                            <h1 style={{ fontSize: "3.5rem", textTransform: "uppercase", letterSpacing: "5px", margin: "20px 0" }}>
                                CONVIÉRTETE EN <br /><span className="accent-text">PATROCINADOR</span>
                            </h1>
                            <p style={{ maxWidth: "800px", margin: "0 auto", color: "var(--text-gray)", lineHeight: "1.8", fontSize: "16px" }}>
                                Únete a la plataforma de visibilidad más importante de Iquique. <br />
                                <strong>Impulsa tu negocio junto a las mujeres líderes de nuestra región.</strong>
                            </p>
                        </div>

                        {/* Plans Grid */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                            gap: "30px",
                            marginBottom: "80px"
                        }}>
                            {plans.map((plan, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        background: plan.highlight ? "linear-gradient(135deg, rgba(245, 36, 95, 0.15), rgba(0,0,0,0.4))" : "rgba(255,255,255,0.02)",
                                        padding: "40px",
                                        borderRadius: "24px",
                                        border: plan.highlight ? "2px solid var(--accent-pink)" : "1px solid rgba(255,255,255,0.1)",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        boxShadow: plan.highlight ? "0 20px 50px rgba(245, 36, 95, 0.2)" : "0 10px 30px rgba(0,0,0,0.3)"
                                    }}
                                >
                                    {plan.highlight && (
                                        <span style={{
                                            position: "absolute",
                                            top: "-15px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            background: "var(--accent-pink)",
                                            padding: "8px 25px",
                                            borderRadius: "30px",
                                            fontSize: "11px",
                                            fontWeight: "900",
                                            letterSpacing: "2px",
                                            boxShadow: "0 5px 15px rgba(245, 36, 95, 0.4)"
                                        }}>RECOMENDADO</span>
                                    )}

                                    <div style={{ marginBottom: "35px" }}>
                                        <h3 style={{
                                            fontSize: "14px",
                                            letterSpacing: "3px",
                                            marginBottom: "10px",
                                            color: plan.highlight ? "white" : "#666",
                                            textTransform: "uppercase",
                                            fontWeight: "800"
                                        }}>PLAN {plan.name}</h3>
                                        <div style={{
                                            fontSize: "3.2rem",
                                            fontWeight: "900",
                                            marginBottom: "5px",
                                            color: "white",
                                            display: "flex",
                                            alignItems: "baseline",
                                            gap: "5px"
                                        }}>
                                            {plan.price}
                                            <span style={{ fontSize: "14px", color: "#666", fontWeight: "normal" }}>+ IVA</span>
                                        </div>
                                    </div>

                                    <ul style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "0 0 40px 0",
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "16px"
                                    }}>
                                        {plan.features.map((feat, j) => (
                                            <li key={j} style={{
                                                fontSize: "14px",
                                                color: feat.included ? (feat.highlight ? "var(--accent-pink)" : "white") : "#444",
                                                display: "flex",
                                                gap: "12px",
                                                alignItems: "flex-start",
                                                fontWeight: (feat.bold || feat.highlight) ? "700" : "400",
                                                lineHeight: "1.4",
                                                padding: feat.highlight ? "10px" : "0",
                                                background: feat.highlight ? "rgba(245, 36, 95, 0.05)" : "transparent",
                                                borderRadius: "8px",
                                                border: feat.highlight ? "1px dashed rgba(245, 36, 95, 0.3)" : "none"
                                            }}>
                                                <span style={{
                                                    color: feat.included ? (feat.highlight ? "var(--accent-pink)" : "#0f0") : "#f00",
                                                    minWidth: "18px",
                                                    marginTop: "2px"
                                                }}>
                                                    {feat.highlight ? <FaStar size={14} /> : (feat.included ? <FaCheck size={14} /> : <FaTimes size={14} />)}
                                                </span>
                                                <span>
                                                    {feat.highlight && <span style={{ display: "block", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Producción Audiovisual</span>}
                                                    {feat.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => setSelectedPlan({ id: plan.id, name: plan.name })}
                                        className="btn-primary"
                                        style={{
                                            width: "100%",
                                            background: plan.highlight ? "var(--accent-pink)" : "transparent",
                                            border: plan.highlight ? "none" : "1px solid #333",
                                            padding: "18px",
                                            fontSize: "14px",
                                            fontWeight: "900",
                                            letterSpacing: "2px",
                                            borderRadius: "12px",
                                            transition: "all 0.3s"
                                        }}
                                    >
                                        RESERVAR {plan.name.toUpperCase()}
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Rules Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            style={{
                                background: "rgba(20, 20, 20, 0.8)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                borderRadius: "20px",
                                padding: "40px",
                                marginBottom: "80px"
                            }}
                        >
                            <div style={{ display: "flex", gap: "25px", alignItems: "flex-start" }}>
                                <div style={{
                                    background: "var(--accent-pink)",
                                    padding: "15px",
                                    borderRadius: "15px",
                                    boxShadow: "0 5px 20px rgba(245, 36, 95, 0.3)"
                                }}>
                                    <FaInfoCircle size={24} color="white" />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "18px", marginBottom: "15px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        Reglas Operativas del Patrocinio
                                    </h4>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                                        <div style={{ color: "#888", fontSize: "14px", lineHeight: "1.8" }}>
                                            <p style={{ marginBottom: "10px" }}><strong style={{ color: "white" }}>Canjes:</strong> Se formalizan mediante contrato simple. En el plan Emprendedor nosotros asignamos las candidatas según perfil. En PyME y Empresa Pro la marca elige.</p>
                                            <p style={{ marginBottom: "10px" }}><strong style={{ color: "white" }}>Duración:</strong> Todos los planes de patrocinio corresponden a un <strong style={{ color: "var(--accent-pink)" }}>Contrato x 6 Meses de Publicidad</strong> garantizada.</p>
                                            <p><strong style={{ color: "white" }}>Producción Audiovisual:</strong> Los videos tipo "Cápsula" o "Elite" incluyen guion, cámara profesional, edición y corrección de color.</p>
                                        </div>
                                        <div style={{ color: "#888", fontSize: "14px", lineHeight: "1.8" }}>
                                            <p style={{ marginBottom: "10px" }}><strong style={{ color: "white" }}>Historias:</strong> Contenido real con mención y enlace. No solo un logo estático.</p>
                                            <p><strong style={{ color: "white" }}>Gala:</strong> El espacio para roler es limitado y se asigna por orden de reserva de plan.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Corporate Section - REWORKED & EXPANDED */}
                <section style={{
                    padding: "120px 0",
                    background: "#050505",
                    position: "relative",
                    overflow: "hidden",
                    borderTop: "1px solid rgba(255,255,255,0.05)"
                }}>
                    <div style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        right: "0",
                        bottom: "0",
                        background: "radial-gradient(circle at 50% 20%, rgba(245, 36, 95, 0.12) 0%, transparent 60%)"
                    }} />

                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto 80px auto" }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                            >
                                <span style={{
                                    color: "var(--accent-pink)",
                                    fontSize: "14px",
                                    fontWeight: "800",
                                    letterSpacing: "4px",
                                    textTransform: "uppercase",
                                    display: "block",
                                    marginBottom: "15px"
                                }}>Nivel Corporativo</span>
                                <h2 style={{
                                    fontSize: "4rem",
                                    marginBottom: "25px",
                                    textTransform: "uppercase",
                                    fontWeight: "900",
                                    letterSpacing: "2px",
                                    lineHeight: "1"
                                }}>
                                    Proyecto <span className="serif-italic" style={{ textTransform: "none", color: "var(--accent-pink)" }}>a Medida</span>
                                </h2>
                                <p style={{
                                    color: "var(--text-gray)",
                                    fontSize: "18px",
                                    lineHeight: "1.8"
                                }}>
                                    Branding preferente, activaciones tácticas y campañas de alto impacto institucional. <br />
                                    <strong>Diseñado para marcas que no solo quieren estar, sino protagonizar.</strong>
                                </p>
                            </motion.div>
                        </div>

                        {/* Expanded Pillars */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "40px",
                            marginBottom: "80px"
                        }}>
                            {/* Pillar 1 */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                style={{ background: "rgba(255,255,255,0.02)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}
                            >
                                <FaLightbulb size={30} color="var(--accent-pink)" style={{ marginBottom: "20px" }} />
                                <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>Activaciones Tácticas</h3>
                                <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>Diseñamos experiencias de marca en vivo donde nuestras candidatas son las protagonistas junto a tu producto.</p>
                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Lanzamientos de productos en eventos MU</li>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Cápsulas de video lifestyle con tu marca</li>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Intervenciones en centros comerciales/negocios</li>
                                </ul>
                            </motion.div>

                            {/* Pillar 2 */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                style={{ background: "rgba(255,255,255,0.02)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}
                            >
                                <FaHandshake size={30} color="var(--accent-pink)" style={{ marginBottom: "20px" }} />
                                <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>Presencia Preferente</h3>
                                <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>Tu marca se convierte en 'Main Sponsor' de momentos clave del certamen con exclusividad editorial.</p>
                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> "Esta pasarela es gracias al patrocinio de..."</li>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Branding dominante en escenario de Gala</li>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Espacio VIP dedicado para atención a clientes</li>
                                </ul>
                            </motion.div>

                            {/* Pillar 3 */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                style={{ background: "rgba(255,255,255,0.02)", padding: "40px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}
                            >
                                <FaBullhorn size={30} color="var(--accent-pink)" style={{ marginBottom: "20px" }} />
                                <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>Proyectos Especiales</h3>
                                <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.7", marginBottom: "20px" }}>Campañas con propósito social (RSE) o narrativas personalizadas según objetivos de marketing.</p>
                                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Becas o premios patrocinados en nombre de marca</li>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Narrativas digitales de conversión (Funnel)</li>
                                    <li style={{ fontSize: "13px", color: "#ccc", display: "flex", gap: "8px" }}><FaCheck size={10} color="var(--accent-pink)" style={{ marginTop: "4px" }} /> Eventos co-brandeados (Cenas, Pasarelas)</li>
                                </ul>
                            </motion.div>
                        </div>

                        {/* Example Grid */}
                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                            <h4 style={{ fontSize: "14px", color: "#444", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "900" }}>Ejemplos de Aplicación</h4>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "60px" }}>
                            {[
                                { title: "Beauty Challenge", desc: "Competencia patrocinada en tu local", icon: <FaCamera /> },
                                { title: "Brand Ambassador", desc: "Una candidata como rostro oficial", icon: <FaStar /> },
                                { title: "Gala Experiences", desc: "Show-room exclusivo en evento final", icon: <FaCrown /> },
                                { title: "Publicity Social Match", desc: "Campañas de impacto masivo en redes", icon: <FaVideo /> }
                            ].map((ex, idx) => (
                                <div key={idx} style={{ padding: "25px", background: "rgba(0,0,0,0.2)", borderRadius: "15px", textAlign: "center", border: "1px solid rgba(255,255,255,0.03)" }}>
                                    <div style={{ color: "var(--accent-pink)", fontSize: "20px", marginBottom: "15px" }}>{ex.icon}</div>
                                    <h5 style={{ fontSize: "14px", fontWeight: "800", marginBottom: "8px", textTransform: "uppercase" }}>{ex.title}</h5>
                                    <p style={{ fontSize: "12px", color: "#666" }}>{ex.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            style={{ textAlign: "center", background: "linear-gradient(rgba(245, 36, 95, 0.1), transparent)", padding: "60px", borderRadius: "30px", border: "1px solid rgba(245, 36, 95, 0.2)" }}
                        >
                            <h3 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "15px" }}>¿LISTO PARA LLEVAR TU MARCA AL SIGUIENTE NIVEL?</h3>
                            <p style={{ color: "var(--text-gray)", fontSize: "15px", marginBottom: "40px" }}>Diseñaremos una propuesta única adaptada a tus objetivos de conversión y posicionamiento.</p>

                            <a
                                href="https://wa.me/56947141721?text=Hola,%20me%20interesa%20un%20Plan%20a%20Medida%20para%20Miss%20Universo%20Iquique"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{
                                    background: "#25D366",
                                    color: "white",
                                    padding: "22px 60px",
                                    fontSize: "16px",
                                    fontWeight: "900",
                                    letterSpacing: "3px",
                                    display: "inline-block",
                                    borderRadius: "15px",
                                    boxShadow: "0 15px 40px rgba(37, 211, 102, 0.2)",
                                    border: "none"
                                }}
                            >
                                HABLAR POR WHATSAPP
                            </a>
                            <p style={{ marginTop: "20px", fontSize: "11px", color: "#555", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>+56 9 4714 1721</p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <AnimatePresence>
                {selectedPlan && (
                    <SponsorPurchaseModal
                        planId={selectedPlan.id}
                        planName={selectedPlan.name}
                        onCLose={() => setSelectedPlan(null)}
                        candidateId={candidateRef || undefined}
                    />
                )}
            </AnimatePresence>

            <FooterExact />
        </div>
    );
}
