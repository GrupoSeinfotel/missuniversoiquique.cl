"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import { motion } from "framer-motion";
import { FaUserEdit, FaBriefcase, FaStar, FaSave, FaCheckCircle } from "react-icons/fa";
import confetti from "canvas-confetti";

export default function PresentationDataPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        occupation: "",
        hobbies: ""
    });
    const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null);

    useEffect(() => {
        fetch("/api/candidate/presentation", { credentials: "include" })
            .then(res => {
                if (res.status === 401) {
                    router.replace("/auth");
                    return null;
                }
                if (res.status === 403) {
                    router.replace("/dashboard");
                    return null;
                }
                return res.json();
            })
            .then(d => {
                if (d && !d.error) {
                    setData({
                        occupation: d.occupation || "",
                        hobbies: d.hobbies || ""
                    });
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/candidate/presentation", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'ok', text: "¡Datos guardados con éxito!" });
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#f5245f', '#ffffff', '#C8FF0B']
                });
            } else {
                setMessage({ type: 'err', text: result.error || "Error al guardar" });
            }
        } catch (err) {
            setMessage({ type: 'err', text: "Error de conexión" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ background: "var(--primary-bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <div className="spinner"></div>
        </div>
    );

    return (
        <div style={{ background: "var(--primary-bg)", color: "white", minHeight: "100vh" }}>
            <HeaderExact />

            <main style={{ paddingTop: "140px", paddingBottom: "100px" }}>
                <div className="container" style={{ maxWidth: "800px" }}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ 
                            background: "rgba(255,255,255,0.03)", 
                            border: "1px solid rgba(255,255,255,0.1)", 
                            borderRadius: "30px", 
                            padding: "40px",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
                        }}
                    >
                        <div style={{ textAlign: "center", marginBottom: "40px" }}>
                            <div style={{ 
                                width: "70px", 
                                height: "70px", 
                                background: "var(--accent-pink)", 
                                borderRadius: "20px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                margin: "0 auto 20px",
                                transform: "rotate(-10deg)",
                                color: "white",
                                fontSize: "1.8rem"
                            }}>
                                <FaUserEdit />
                            </div>
                            <h1 style={{ fontSize: "2.5rem", textTransform: "uppercase", letterSpacing: "3px", fontWeight: "900" }}>
                                DATOS DE <span className="accent-text">PRESENTACIÓN</span>
                            </h1>
                            <p style={{ color: "var(--text-gray)", marginTop: "10px", fontSize: "0.95rem" }}>
                                Completa tu perfil para las galas y presentaciones oficiales.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "25px" }}>
                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-gray)", marginBottom: "10px", textTransform: "uppercase", fontWeight: "bold" }}>
                                    <FaBriefcase style={{ color: "var(--accent-pink)" }} /> Ocupación Actual
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Ej: Estudiante de Derecho"
                                    value={data.occupation}
                                    onChange={e => setData({...data, occupation: e.target.value})}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--text-gray)", marginBottom: "10px", textTransform: "uppercase", fontWeight: "bold" }}>
                                    <FaStar style={{ color: "var(--accent-pink)" }} /> Hobbies
                                </label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="Ej: Leer, viajar, practicar yoga"
                                    value={data.hobbies}
                                    onChange={e => setData({...data, hobbies: e.target.value})}
                                    style={inputStyle}
                                />
                            </div>

                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ 
                                        padding: "15px", 
                                        borderRadius: "12px", 
                                        textAlign: "center",
                                        background: message.type === 'ok' ? "rgba(200, 255, 11, 0.1)" : "rgba(245, 36, 95, 0.1)",
                                        color: message.type === 'ok' ? "#C8FF0B" : "var(--accent-pink)",
                                        fontSize: "0.9rem",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        border: message.type === 'ok' ? "1px solid rgba(200, 255, 11, 0.3)" : "1px solid rgba(245, 36, 95, 0.3)"
                                    }}
                                >
                                    {message.type === 'ok' && <FaCheckCircle />}
                                    {message.text}
                                </motion.div>
                            )}

                            <button 
                                type="submit" 
                                disabled={saving}
                                style={{ 
                                    background: "var(--accent-pink)", 
                                    color: "white", 
                                    padding: "18px", 
                                    borderRadius: "15px", 
                                    border: "none", 
                                    fontWeight: "900", 
                                    textTransform: "uppercase", 
                                    letterSpacing: "2px",
                                    cursor: "pointer",
                                    marginTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    boxShadow: "0 10px 20px rgba(245, 36, 95, 0.3)"
                                }}
                            >
                                {saving ? "Guardando..." : <><FaSave /> ACTUALIZAR DATOS</>}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </main>

            <FooterExact />

            <style jsx>{`
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-radius: 50%;
                    border-top-color: var(--accent-pink);
                    animation: spin 1s ease-in-out infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "15px 20px",
    background: "#050505",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "15px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
};
