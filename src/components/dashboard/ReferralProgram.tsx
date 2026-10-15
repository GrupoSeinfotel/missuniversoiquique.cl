"use client";
import { useState } from "react";
import { FaCheckCircle, FaUserPlus, FaChevronDown, FaClipboardList, FaInfoCircle, FaCopy, FaQrcode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    accepted: boolean;
    acceptedAt: Date | null | undefined;
    candidateId: string;
    cityName?: string;
}

export default function ReferralProgram({ accepted, acceptedAt, candidateId, cityName = "Iquique" }: Props) {
    const [expanded, setExpanded] = useState(!accepted);
    const [checkAccepted, setCheckAccepted] = useState(false);
    const [showLink, setShowLink] = useState(accepted);
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        if (!checkAccepted) return;
        setLoading(true);
        try {
            const res = await fetch("/api/candidate/referral-program/accept", { method: "POST" });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Error al procesar la solicitud.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/postula?ref=${candidateId}`;

    const containerStyle = {
        background: accepted
            ? "linear-gradient(135deg, rgba(46, 196, 182, 0.1), rgba(0,0,0,0.2))" // Greenish tint for accepted
            : "linear-gradient(135deg, rgba(255, 159, 28, 0.1), rgba(0,0,0,0.2))", // Orange tint for pending
        border: accepted ? "1px solid rgba(46, 196, 182, 0.3)" : "1px solid rgba(255, 159, 28, 0.3)",
        borderRadius: "12px",
        padding: "20px",
        position: "relative" as const,
        overflow: "hidden" as const
    };

    const sectionTitleStyle = {
        fontSize: "1.1rem",
        fontWeight: "bold",
        color: accepted ? "#2EC4B6" : "#FF9F1C",
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
    };

    if (accepted && !expanded) {
        return (
            <div style={containerStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ background: "rgba(46, 196, 182, 0.2)", padding: "10px", borderRadius: "50%", color: "#2EC4B6" }}>
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#2EC4B6", margin: 0 }}>
                                PROGRAMA DE REFERIDAS ACTIVO
                            </h3>
                            <p style={{ fontSize: "12px", color: "#aaa", margin: "5px 0 0 0" }}>
                                Aceptado el <span suppressHydrationWarning>{acceptedAt ? new Date(acceptedAt).toLocaleDateString() : "Fecha desconocida"}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(true)}
                        style={{
                            background: "transparent",
                            border: "1px solid #333",
                            color: "#aaa",
                            padding: "8px 15px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontSize: "12px"
                        }}
                    >
                        Ver Detalles <FaChevronDown />
                    </button>
                </div>

                {/* Referral Link Quick Access */}
                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 style={{ fontSize: "12px", color: "#888", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>Tu Enlace de Invitación</h4>

                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ background: "white", padding: "5px", borderRadius: "4px" }}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(referralLink)}`}
                                alt="QR"
                                style={{ width: "60px", height: "60px", display: "block" }}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input
                                    readOnly
                                    value={referralLink}
                                    style={{
                                        flex: 1,
                                        background: "#111",
                                        border: "1px solid #333",
                                        color: "var(--accent-pink)",
                                        padding: "10px",
                                        fontSize: "12px",
                                        borderRadius: "4px",
                                        fontFamily: "monospace"
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(referralLink);
                                        alert("Enlace copiado!");
                                    }}
                                    style={{
                                        background: "#333",
                                        color: "white",
                                        border: "none",
                                        padding: "0 15px",
                                        borderRadius: "4px",
                                        cursor: "pointer"
                                    }}
                                >
                                    <FaCopy />
                                </button>
                            </div>
                            <p style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>
                                Ganas <strong>500 puntos</strong> por cada candidata que se inscriba, pague y sea aprobada usando este link.
                            </p>
                            <p style={{ fontSize: "11px", color: "var(--accent-pink)", marginTop: "5px", fontWeight: "bold" }}>
                                <FaCheckCircle style={{ marginRight: "4px", verticalAlign: "middle" }} />
                                ¡IMPORTANTE! Hasta el 8 de marzo para el Casting Online.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ ...containerStyle, border: "1px solid var(--accent-pink)" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "rgba(255, 159, 28, 0.2)",
                    color: "#FF9F1C",
                    marginBottom: "15px"
                }}>
                    <FaUserPlus size={28} />
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "white", marginBottom: "10px" }}>PROGRAMA DE CANDIDATAS REFERIDAS</h2>
                <p style={{ fontSize: "14px", color: "#aaa", maxWidth: "600px", margin: "0 auto" }}>
                    Miss Universe {cityName} 2026
                </p>
            </div>

            <div style={{
                background: "rgba(0,0,0,0.3)",
                padding: "20px",
                borderRadius: "8px",
                height: "300px",
                overflowY: "auto",
                marginBottom: "20px",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#ddd",
                border: "1px solid rgba(255,255,255,0.1)"
            }}>
                <h4 style={{ color: "var(--accent-pink)", marginBottom: "10px" }}>¿Qué es este programa?</h4>
                <p>El Programa de Candidatas Referidas es una iniciativa opcional que permite a las candidatas invitar a nuevas participantes a postular al certamen Miss Universe {cityName} 2026, contribuyendo al crecimiento del proyecto y fortaleciendo la comunidad del certamen.</p>
                <p>Este programa reconoce el liderazgo, la iniciativa y la capacidad de convocatoria de las candidatas que ayudan a atraer nuevo talento real al concurso.</p>

                <h4 style={{ color: "var(--accent-pink)", marginTop: "15px", marginBottom: "10px" }}>¿Cómo funciona?</h4>
                <p>Cada candidata participante recibe un enlace personal de referido, asociado a su perfil dentro de la plataforma oficial.</p>
                <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                    <li>Compartes tu enlace de referido con personas interesadas.</li>
                    <li>La persona se inscribe usando tu enlace.</li>
                    <li>La organización valida la postulación.</li>
                    <li>Si la referida paga y es aprobada, el sistema registra la referencia.</li>
                    <li><strong>Automáticamente ganas 500 puntos en tu ranking.</strong></li>
                    <li>📢 Las candidatas tienen hasta el <strong>8 de marzo</strong> para el casting online.</li>
                </ul>

                <h4 style={{ color: "var(--accent-pink)", marginTop: "15px", marginBottom: "10px" }}>Condiciones de Puntos</h4>
                <p>Los 500 puntos se asignan ÚNICAMENTE cuando se cumplen TODAS estas condiciones:</p>
                <ul style={{ paddingLeft: "20px", marginTop: "5px" }}>
                    <li>✔ La candidata referida completa su inscripción hasta el 8 de marzo</li>
                    <li>✔ La candidata referida paga su inscripción</li>
                    <li>✔ La candidata referida es validada y aprobada por la organización</li>
                </ul>
                <p style={{ fontSize: "12px", color: "#aaa", marginTop: "10px" }}>No se asignan puntos por registros incompletos, no pagados o rechazados.</p>

                <h4 style={{ color: "var(--accent-pink)", marginTop: "15px", marginBottom: "10px" }}>Transparencia</h4>
                <p>El Programa se rige por principios claros. No se permiten cuentas falsas, prácticas engañosas ni presión indebida. La organización valida cada referencia y se reserva el derecho de anularlas en caso de irregularidades.</p>

                <h4 style={{ color: "var(--accent-pink)", marginTop: "15px", marginBottom: "10px" }}>Declaración Final</h4>
                <p>Este programa no es obligatorio ni influye automáticamente en la coronación final. Es una oportunidad opcional para demostrar liderazgo y compromiso. Los puntos se suman a tu desempeño general.</p>
            </div>

            {!accepted && (
                <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "8px" }}>
                    <label style={{ display: "flex", gap: "15px", cursor: "pointer", alignItems: "flex-start" }}>
                        <input
                            type="checkbox"
                            checked={checkAccepted}
                            onChange={(e) => setCheckAccepted(e.target.checked)}
                            style={{ marginTop: "4px", accentColor: "var(--accent-pink)", transform: "scale(1.2)" }}
                        />
                        <span style={{ fontSize: "14px", color: "white" }}>
                            Entiendo y acepto participar voluntariamente en el Programa de Candidatas Referidas, bajo las condiciones descritas anteriormente.
                        </span>
                    </label>

                    <button
                        onClick={handleAccept}
                        disabled={!checkAccepted || loading}
                        style={{
                            width: "100%",
                            marginTop: "20px",
                            padding: "15px",
                            background: checkAccepted ? "var(--accent-pink)" : "#333",
                            color: checkAccepted ? "white" : "#666",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: checkAccepted ? "pointer" : "not-allowed",
                            transition: "all 0.3s"
                        }}
                    >
                        {loading ? "PROCESANDO..." : "ACTIVAR MI PROGRAMA DE REFERIDOS"}
                    </button>
                </div>
            )}

            {accepted && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                        onClick={() => setExpanded(false)}
                        style={{ background: "transparent", border: "none", color: "#aaa", textDecoration: "underline", cursor: "pointer", fontSize: "12px" }}
                    >
                        Ocultar detalles
                    </button>
                </div>
            )}
        </div>
    );
}
