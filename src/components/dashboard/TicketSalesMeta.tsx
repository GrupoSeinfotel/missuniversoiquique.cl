"use client";
import { useState, useEffect } from "react";
import { FaTicketAlt, FaCopy, FaQrcode, FaCheckCircle, FaStar, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";

interface Props {
    candidateId: string;
    candidateName: string;
}

export default function TicketSalesMeta({ candidateId, candidateName }: Props) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${candidateId}#entradas`;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/tickets/stats/candidates");
                const data = await res.json();
                if (Array.isArray(data)) {
                    const myStats = data.find(s => s.id === candidateId);
                    setStats(myStats);
                }
            } catch (error) {
                console.error("Error fetching ticket stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [candidateId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div style={{ color: "#444", padding: "40px", textAlign: "center" }}>Cargando metas de venta...</div>;

    const total = stats?.total || 0;
    const goal = 10;
    const progress = Math.min(100, (total / goal) * 100);
    const points = stats?.points || 0;

    return (
        <div style={{ color: "white" }}>
            {/* BONO REGALO VIP */}
            <div style={{ 
                background: "linear-gradient(135deg, rgba(223, 192, 109, 0.15), rgba(0,0,0,0.4))", 
                border: "1px solid rgba(223, 192, 109, 0.3)", 
                padding: "20px", 
                borderRadius: "18px", 
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "15px"
            }}>
                <div style={{ fontSize: "30px" }}>🎁</div>
                <div>
                    <h4 style={{ color: "#dfc06d", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                        Bono Real: 2 Entradas VIP de Regalo
                    </h4>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", lineHeight: "1.4" }}>
                        Estas 2 entradas VIP de cortesía se habilitarán para ustedes una vez que logren su objetivo de 10 entradas vendidas.
                    </p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
                {/* Points Card */}
                <div style={{ background: "rgba(245,36,95,0.08)", padding: "25px", borderRadius: "18px", border: "1px solid rgba(245,36,95,0.25)", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: "700" }}>Puntos Generados</p>
                    <div style={{ fontSize: "36px", fontWeight: "900", color: "#dfc06d", textShadow: "0 0 15px rgba(223,192,109,0.3)" }}>+{points.toLocaleString()} <span style={{ fontSize: "14px", color: "white", opacity: 0.4 }}>PTS</span></div>
                </div>
                {/* Tickets Card */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "25px", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", fontWeight: "700" }}>Venta al Público</p>
                    <div style={{ fontSize: "36px", fontWeight: "900" }}>{total} <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.2)" }}>/ {goal}</span></div>
                </div>
            </div>

            {/* Goal Progress */}
            <div className="profile-card" style={{ marginBottom: "30px", background: "rgba(10,10,10,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px" }}>
                        Meta Mínima Obligatoria
                    </h3>
                    {total >= goal && <span style={{ color: "#2ecc71", fontSize: "11px", fontWeight: "900", background: "rgba(46,204,113,0.15)", padding: "6px 14px", borderRadius: "50px", border: "1px solid rgba(46,204,113,0.3)" }}>✓ META ALCANZADA</span>}
                </div>
                
                <div style={{ width: "100%", height: "14px", background: "#050505", borderRadius: "10px", overflow: "hidden", marginBottom: "12px", border: "1px solid #111" }}>
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: "100%", background: total >= goal ? "#2ecc71" : "linear-gradient(90deg, #f5245f, #9e0e41)", borderRadius: "10px", boxShadow: total >= goal ? "0 0 15px rgba(46,204,113,0.4)" : "none" }}
                    />
                </div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
                    {total < goal 
                        ? `Aún te faltan ${goal - total} entradas para alcanzar la meta mínima de 10 tickets.`
                        : "¡Felicidades! Meta obligatoria cumplida. Continúa vendiendo para asegurar tu lugar en el Top 5."}
                </p>
                <div style={{ marginTop: "15px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "12px", borderRadius: "10px", color: "#60a5fa", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    ⚠️ RECUERDA: Este sistema influye en un 30% de tu resultado final en el certamen.
                </div>
            </div>

            {/* Referral Link Section */}
            <div className="profile-card" style={{ border: "1px solid rgba(245,36,95,0.3)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px", color: "#f5245f" }}>
                    Tu Enlace Único de Venta
                </h3>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
                    Utiliza este enlace para que tus fans compren sus entradas. El sistema te asignará los puntos automáticamente.
                </p>
                
                <div style={{ display: "flex", gap: "25px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div style={{ background: "white", padding: "12px", borderRadius: "14px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralLink)}`}
                            alt="QR de Venta"
                            style={{ width: "120px", height: "120px", display: "block" }}
                        />
                        <p style={{ color: "#000", fontSize: "9px", fontWeight: "900", textAlign: "center", marginTop: "8px" }}>ESCANEAR PARA COMPRAR</p>
                    </div>
                    <div style={{ flex: 1, minWidth: "250px" }}>
                        <div style={{ background: "rgba(0,0,0,0.5)", padding: "15px", borderRadius: "12px", border: "1px solid #222", marginBottom: "20px" }}>
                            <p style={{ fontSize: "10px", color: "#f5245f", fontWeight: "900", textTransform: "uppercase", marginBottom: "10px" }}>Instrucciones rápidas:</p>
                            <ol style={{ paddingLeft: "18px", color: "rgba(255,255,255,0.7)", fontSize: "11px", lineHeight: "1.7" }}>
                                <li><strong>Copia el enlace</strong> con el botón de abajo.</li>
                                <li>Pégalo en tu <strong>Biografía de Instagram/TikTok</strong>.</li>
                                <li>Compártelo en tus <strong>Historias</strong> con un llamado a la acción.</li>
                                <li>Cada venta te acerca más al <strong>TOP 5 asegurado</strong>.</li>
                            </ol>
                        </div>

                        <div style={{ position: "relative" }}>
                            <input 
                                readOnly 
                                value={referralLink}
                                style={{
                                    width: "100%",
                                    background: "#080808",
                                    border: "1px solid #333",
                                    padding: "18px 15px",
                                    borderRadius: "12px",
                                    color: "#f5245f",
                                    fontSize: "13px",
                                    outline: "none",
                                    fontFamily: "monospace",
                                    paddingRight: "130px"
                                }}
                            />
                            <button 
                                onClick={handleCopy}
                                style={{
                                    position: "absolute",
                                    right: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: copied ? "#2ecc71" : "linear-gradient(135deg, #f5245f, #9e0e41)",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 18px",
                                    borderRadius: "8px",
                                    fontSize: "11px",
                                    fontWeight: "900",
                                    cursor: "pointer",
                                    boxShadow: "0 5px 15px rgba(245,36,95,0.2)"
                                }}
                            >
                                {copied ? "✓ COPIADO" : "COPIAR LINK"}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ color: "#dfc06d", fontWeight: "900", fontSize: "16px" }}>140 PTS</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase" }}>Por Entrada General</div>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ color: "#dfc06d", fontWeight: "900", fontSize: "16px" }}>200 PTS</div>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", textTransform: "uppercase" }}>Por Entrada VIP</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
