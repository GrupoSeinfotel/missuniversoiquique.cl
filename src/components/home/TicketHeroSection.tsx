"use client";
import { useState, useEffect } from "react";
import TicketCheckout from "@/components/home/TicketCheckout";

interface PricingData {
    isPresale: boolean;
    presaleEndDate: string;
    VIP: { presalePrice: number; normalPrice: number; currentPrice: number };
    GENERAL: { presalePrice: number; normalPrice: number; currentPrice: number };
}

function formatCLP(n: number) {
    return "$" + n.toLocaleString("es-CL");
}

export default function TicketHeroSection({ candidateId }: { candidateId?: string | null }) {
    const [pricing, setPricing] = useState<PricingData | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [candidateName, setCandidateName] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/tickets/pricing.json")
            .then(r => r.json())
            .then(setPricing)
            .catch(() => {});

        if (candidateId) {
            fetch("/api/candidates.json")
                .then(r => r.json())
                .then(data => {
                    const c = data.find((x: any) => x.id === candidateId);
                    if (c) setCandidateName(c.fullName);
                })
                .catch(() => {});
        }
    }, [candidateId]);

    return (
        <section id="entradas" style={{
            background: "linear-gradient(180deg, #000000 0%, #0d0004 50%, #000000 100%)",
            padding: "100px 20px",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Fondo decorativo */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,36,95,0.08) 0%, transparent 70%)"
            }} />
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(245,36,95,0.6), transparent)"
            }} />
            <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(245,36,95,0.6), transparent)"
            }} />

            <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: "1200px", margin: "0 auto" }}>

                {/* Badge preventa */}
                {pricing?.isPresale && (
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <span style={{
                            background: "linear-gradient(135deg, rgba(245,36,95,0.2), rgba(245,36,95,0.05))",
                            border: "1px solid rgba(245,36,95,0.5)",
                            color: "#f5245f", padding: "8px 22px", borderRadius: "50px",
                            fontSize: "11px", fontWeight: "900", letterSpacing: "3px",
                            textTransform: "uppercase",
                            display: "inline-flex", alignItems: "center", gap: "8px"
                        }}>
                            🔥 PRECIO PREVENTA DISPONIBLE
                        </span>
                        
                        {/* NUEVO BADGE DE BONUS */}
                        <span style={{
                            background: "linear-gradient(135deg, #f5245f, #9e0e41)",
                            color: "white", padding: "8px 22px", borderRadius: "50px",
                            fontSize: "11px", fontWeight: "900", letterSpacing: "3px",
                            textTransform: "uppercase", marginLeft: "12px",
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            boxShadow: "0 4px 15px rgba(245,36,95,0.3)"
                        }}>
                            🚀 DOBLE PUNTAJE ACTIVADO
                        </span>
                    </div>
                )}

                {/* Título principal */}
                <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <p style={{
                        color: "rgba(245,36,95,0.8)", fontSize: "13px", fontWeight: "700",
                        letterSpacing: "5px", textTransform: "uppercase", marginBottom: "20px"
                    }}>
                        MISS UNIVERSO IQUIQUE 2026
                    </p>

                    <h2 style={{
                        fontSize: "clamp(3rem, 8vw, 6.5rem)",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        lineHeight: "1.0",
                        letterSpacing: "-1px",
                        marginBottom: "12px",
                        color: "white"
                    }}>
                        COMPRA TU
                    </h2>
                    <h2 style={{
                        fontSize: "clamp(3rem, 8vw, 6.5rem)",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        lineHeight: "1.0",
                        letterSpacing: "-1px",
                        marginBottom: "32px",
                        background: "linear-gradient(135deg, #f5245f, #ff8fab)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>
                        ENTRADA
                    </h2>

                    <p style={{
                        color: "rgba(255,255,255,0.5)", fontSize: "16px", maxWidth: "500px",
                        margin: "0 auto 50px", lineHeight: "1.8"
                    }}>
                        Vive una noche única e irrepetible. Asiste a la gran final del
                        certamen más exclusivo del norte de Chile.
                    </p>
                    
                    {candidateName && (
                        <div style={{ 
                            marginBottom: "40px", 
                            background: "rgba(245,36,95,0.1)", 
                            padding: "12px 25px", 
                            borderRadius: "50px", 
                            display: "inline-block",
                            border: "1px solid rgba(245,36,95,0.3)",
                            animation: "pulseShadow 2s infinite"
                        }}>
                            <span style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>
                                ✨ Estás apoyando a: <span style={{ color: "#f5245f", textTransform: "uppercase" }}>{candidateName}</span>
                            </span>
                        </div>
                    )}

                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes pulseShadow {
                            0% { box-shadow: 0 0 0 0 rgba(245, 36, 95, 0.4); }
                            70% { box-shadow: 0 0 0 10px rgba(245, 36, 95, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(245, 36, 95, 0); }
                        }
                    `}} />

                    {/* Precios resumen */}
                    {pricing && !showCheckout && (
                        <div style={{
                            display: "inline-flex", gap: "20px", flexWrap: "wrap",
                            justifyContent: "center", marginBottom: "50px"
                        }}>
                            {/* VIP */}
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(245,36,95,0.25)",
                                borderRadius: "20px", padding: "28px 40px", minWidth: "200px",
                                position: "relative", overflow: "hidden"
                            }}>
                                <div style={{
                                    position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                                    background: "linear-gradient(90deg, transparent, #f5245f, transparent)"
                                }} />
                                <div style={{ fontSize: "24px", marginBottom: "6px" }}>👑</div>
                                <div style={{ color: "white", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>Entrada VIP</div>
                                {pricing.isPresale && (
                                    <div style={{ color: "#888", fontSize: "11px", textDecoration: "line-through", marginBottom: "2px" }}>
                                        Normal: {formatCLP(pricing.VIP.normalPrice)}
                                    </div>
                                )}
                                <div style={{ color: "#f5245f", fontWeight: "900", fontSize: "28px" }}>
                                    {formatCLP(pricing.VIP.currentPrice)}
                                </div>
                                {pricing.isPresale && (
                                    <div style={{ color: "#f5245f", fontSize: "10px", fontWeight: "700", marginTop: "4px", letterSpacing: "1px" }}>PREVENTA</div>
                                )}
                            </div>

                            {/* GENERAL */}
                            <div style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "20px", padding: "28px 40px", minWidth: "200px"
                            }}>
                                <div style={{ fontSize: "24px", marginBottom: "6px" }}>🎟️</div>
                                <div style={{ color: "white", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px" }}>Entrada General</div>
                                {pricing.isPresale && (
                                    <div style={{ color: "#888", fontSize: "11px", textDecoration: "line-through", marginBottom: "2px" }}>
                                        Normal: {formatCLP(pricing.GENERAL.normalPrice)}
                                    </div>
                                )}
                                <div style={{ color: "white", fontWeight: "900", fontSize: "28px" }}>
                                    {formatCLP(pricing.GENERAL.currentPrice)}
                                </div>
                                {pricing.isPresale && (
                                    <div style={{ color: "#aaa", fontSize: "10px", fontWeight: "700", marginTop: "4px", letterSpacing: "1px" }}>PREVENTA</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Botón principal CTA */}
                    {!showCheckout && (
                        <div>
                            <button
                                id="btn-comprar-entrada"
                                onClick={() => {
                                    setShowCheckout(true);
                                    setTimeout(() => {
                                        document.getElementById("checkout-form-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
                                    }, 100);
                                }}
                                style={{
                                    background: "linear-gradient(135deg, #f5245f, #9e0e41)",
                                    color: "white", border: "none",
                                    padding: "22px 60px", borderRadius: "16px",
                                    fontSize: "18px", fontWeight: "900",
                                    cursor: "pointer", textTransform: "uppercase",
                                    letterSpacing: "3px",
                                    boxShadow: "0 20px 50px rgba(245,36,95,0.4)",
                                    transition: "all 0.3s ease",
                                    display: "inline-flex", alignItems: "center", gap: "14px"
                                }}
                                onMouseOver={e => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 28px 60px rgba(245,36,95,0.55)";
                                }}
                                onMouseOut={e => {
                                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 50px rgba(245,36,95,0.4)";
                                }}
                            >
                                🎫 COMPRAR ENTRADA AHORA
                            </button>
                            <div style={{ marginTop: "16px", color: "#444", fontSize: "12px" }}>
                                Pago seguro · Recibes tu entrada por correo · ¿Dudas? <a href="/recuperar-entradas" style={{ color: "#f5245f", textDecoration: "none" }}>Recuperar entrada</a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Checkout inline */}
                {showCheckout && (
                    <div id="checkout-form-section" style={{ maxWidth: "580px", margin: "0 auto" }}>
                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <button
                                onClick={() => setShowCheckout(false)}
                                style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "8px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}
                            >
                                ← Volver
                            </button>
                        </div>
                        <TicketCheckout candidateId={candidateId || undefined} />
                    </div>
                )}

                {/* Garantías */}
                <div style={{
                    display: "flex", gap: "30px", justifyContent: "center",
                    flexWrap: "wrap", marginTop: "60px",
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    paddingTop: "40px"
                }}>
                    {[
                        { icon: "🔒", text: "Pago 100% seguro vía Flow" },
                        { icon: "📧", text: "Entrada al correo al instante" },
                        { icon: "📱", text: "QR válido en puerta del evento" },
                        { icon: "🎭", text: "Noche exclusiva e irrepetible" },
                    ].map(({ icon, text }) => (
                        <div key={text} style={{
                            display: "flex", alignItems: "center", gap: "10px",
                            color: "rgba(255,255,255,0.4)", fontSize: "13px"
                        }}>
                            <span style={{ fontSize: "18px" }}>{icon}</span>
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
