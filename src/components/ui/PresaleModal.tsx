"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

interface PresaleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PresaleModal({ isOpen, onClose }: PresaleModalProps) {
    const [whatsapp, setWhatsapp] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!whatsapp.trim() || whatsapp.length < 8) return;

        setStatus("loading");
        try {
            const res = await fetch("/api/presale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ whatsapp })
            });

            if (res.ok) {
                setStatus("success");
                setTimeout(() => {
                    onClose();
                    setStatus("idle");
                    setWhatsapp("");
                }, 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        backdropFilter: "blur(5px)",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        zIndex: 9999, padding: "20px"
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        style={{
                            background: "var(--secondary-bg)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "15px", padding: "30px",
                            maxWidth: "400px", width: "100%", position: "relative",
                            textAlign: "center"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={onClose}
                            style={{
                                position: "absolute", top: "15px", right: "15px",
                                background: "transparent", border: "none", color: "white",
                                cursor: "pointer", fontSize: "20px"
                            }}
                        >
                            <FaTimes />
                        </button>

                        <h3 className="serif-italic" style={{ color: "var(--accent-pink)", fontSize: "24px", marginBottom: "10px" }}>
                            La Gran Final
                        </h3>
                        <h2 className="responsive-h2" style={{ textTransform: "uppercase", fontSize: "20px", marginBottom: "20px" }}>
                            Reserva tu <span className="accent-text">Entrada</span>
                        </h2>

                        {status === "success" ? (
                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ color: "#00ff88", padding: "20px 0" }}>
                                <FaWhatsapp size={50} style={{ marginBottom: "15px" }} />
                                <h3>¡Número Registrado!</h3>
                                <p style={{ fontSize: "14px", marginTop: "10px", color: "#ccc" }}>
                                    Pronto nos pondremos en contacto contigo para los detalles de la venta.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "25px" }}>
                                    Déjanos tu número de WhatsApp para ser de los primeros en adquirir tu entrada en preventa exclusiva.
                                </p>
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    <div style={{ position: "relative" }}>
                                        <FaWhatsapp style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
                                        <input
                                            type="tel"
                                            placeholder="+569 1234 5678"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                            style={{
                                                width: "100%", padding: "12px 15px 12px 40px",
                                                borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                                                background: "rgba(0,0,0,0.5)", color: "white", fontSize: "16px"
                                            }}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn-primary" 
                                        disabled={status === "loading"}
                                        style={{ width: "100%", padding: "15px" }}
                                    >
                                        {status === "loading" ? "Enviando..." : "SOLICITAR PREVENTA"}
                                    </button>
                                    {status === "error" && (
                                        <p style={{ color: "#ff4d4d", fontSize: "12px", marginTop: "10px" }}>Ocurrió un error. Intenta nuevamente.</p>
                                    )}
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
