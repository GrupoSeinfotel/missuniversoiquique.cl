"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SponsorPurchaseModal({ planId, planName, onCLose, candidateId }: { planId: string, planName: string, onCLose: () => void, candidateId?: string }) {
    const [businessName, setBusinessName] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/payments/create-sponsor-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessName, planId, candidateId })
            });
            const data = await res.json();
            if (data.initPoint) {
                window.location.href = data.initPoint;
            } else {
                alert("Error al procesar el pago.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.9)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px"
            }}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                style={{
                    background: "var(--secondary-bg)",
                    width: "100%",
                    maxWidth: "450px",
                    padding: "40px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    position: "relative"
                }}
            >
                <button
                    onClick={onCLose}
                    style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}
                >
                    ✕
                </button>

                <h2 style={{ fontSize: "20px", textAlign: "center", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "30px" }}>Registro de Sponsor: <span className="accent-text">{planName}</span></h2>

                <form onSubmit={handlePurchase} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ fontSize: "11px", color: "var(--text-gray)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>Nombre de la Empresa</label>
                        <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder="Ej: Boutique Iquique SPA"
                            style={{
                                width: "100%",
                                background: "#111",
                                border: "1px solid #333",
                                padding: "12px 15px",
                                color: "white",
                                borderRadius: "4px",
                                fontSize: "14px",
                                outline: "none"
                            }}
                        />
                    </div>

                    <p style={{ fontSize: "12px", color: "var(--text-gray)", lineHeight: "1.5" }}>
                        Al continuar, serás redirigido a la pasarela de pago segura para completar el pago. <br />
                        <strong style={{ color: "var(--accent-pink)" }}>Nota:</strong> Este patrocinio corresponde a un contrato de publicidad de 6 meses.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: "100%", padding: "15px", opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "REDIRECCIONANDO..." : "PROCEDER AL PAGO"}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
