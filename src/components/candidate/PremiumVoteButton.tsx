"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaTimes, FaPlus, FaMinus, FaBolt } from "react-icons/fa";

interface PremiumVoteButtonProps {
    candidateId: string;
    candidateName: string;
    disabled?: boolean;
}

export default function PremiumVoteButton({ candidateId, candidateName, disabled }: PremiumVoteButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    // Cart logic: count -> quantity
    const [quantities, setQuantities] = useState<Record<number, number>>({
        10: 0,
        30: 0,
        80: 0,
        200: 0,
        500: 0,
        1000: 0
    });

    const packages = [
        { count: 10, price: 1000, label: "10 VOTOS", desc: "Opción Base" },
        { count: 30, price: 2000, label: "30 VOTOS", desc: "🔥 POPULAR" },
        { count: 80, price: 4000, label: "80 VOTOS", desc: "💰 AHORRO" },
        { count: 200, price: 10000, label: "200 VOTOS", desc: "👑 MEGA PACK" },
        { count: 500, price: 20000, label: "500 VOTOS", desc: "💎 DIAMANTE" },
        { count: 1000, price: 30000, label: "1000 VOTOS", desc: "🌌 UNIVERSO" }
    ];

    const updateQuantity = (count: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [count]: Math.max(0, (prev[count] || 0) + delta)
        }));
    };

    // Calculate totals
    let totalAmount = 0;
    let totalBaseVotes = 0;
    let totalBonusVotes = 0;

    Object.entries(quantities).forEach(([countStr, qty]) => {
        const count = Number(countStr);
        const pack = packages.find(p => p.count === count);
        if (pack && qty > 0) {
            totalAmount += pack.price * qty;
            const baseVotes = count * qty;
            totalBaseVotes += baseVotes;
            if (qty >= 2) {
                const bonusPerExtraUnit = count * 0.20;
                totalBonusVotes += Math.floor((qty - 1) * bonusPerExtraUnit);
            }
        }
    });

    const totalVotes = totalBaseVotes + totalBonusVotes;

    const handlePayment = async () => {
        if (!email.includes("@")) {
            alert("Por favor ingresa un email válido");
            return;
        }

        if (totalAmount <= 0) {
            alert("Selecciona al menos un pack de votos");
            return;
        }

        const selectedPacks = Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([count, qty]) => ({ count: Number(count), quantity: qty }));

        setLoading(true);
        try {
            const res = await fetch("/api/payment/flow/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidateId,
                    email,
                    packs: selectedPacks
                })
            });
            const data = await res.json();
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                alert("Error al iniciar pago: " + (data.error || "Desconocido"));
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={disabled ? {} : { scale: 1.05 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                onClick={() => !disabled && setIsOpen(true)}
                className="btn-primary"
                style={{
                    width: "100%",
                    background: disabled ? "#1a1a1a" : "linear-gradient(135deg, #FFD700 0%, #FDB931 50%, #C6930A 100%)",
                    border: disabled ? "1px solid #333" : "1px solid #FFE57C",
                    padding: "18px",
                    fontWeight: "900",
                    borderRadius: "8px",
                    color: disabled ? "#444" : "black",
                    cursor: disabled ? "default" : "pointer",
                    boxShadow: disabled ? "none" : "0 0 20px rgba(253, 185, 49, 0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    opacity: disabled ? 0.5 : 1
                }}
            >
                {disabled ? "VOTACIÓN INHABILITADA" : <><FaHeart style={{ color: "#8B4513" }} /> VOTOS PREMIUM (CARRITO)</>}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                            background: "rgba(0,0,0,0.92)", zIndex: 9999,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            padding: "10px"
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            style={{
                                background: "#111",
                                padding: "24px",
                                borderRadius: "24px",
                                maxWidth: "480px",
                                width: "100%",
                                border: "1px solid #333",
                                position: "relative",
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                            }}
                        >
                            <button onClick={() => setIsOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.05)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><FaTimes /></button>

                            <h2 style={{ color: "white", textAlign: "center", marginBottom: "5px", textTransform: "uppercase", fontSize: "1.2rem", fontWeight: 900 }}>El Multiplicador Real</h2>
                            <p style={{ color: "#888", textAlign: "center", marginBottom: "24px", fontSize: "13px" }}>
                                ¡Compra 2 o más packs iguales y activa el <span style={{ color: "#C8FF0B", fontWeight: "bold" }}>BONO +10%</span>!
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                                {packages.map(pack => {
                                    const qty = quantities[pack.count] || 0;
                                    const hasBonus = qty >= 2;
                                    return (
                                        <div
                                            key={pack.count}
                                            style={{
                                                padding: "16px",
                                                borderRadius: "16px",
                                                border: qty > 0 ? "1px solid #C8FF0B" : "1px solid #222",
                                                background: qty > 0 ? "rgba(200, 255, 11, 0.03)" : "rgba(255,255,255,0.02)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                transition: "all 0.2s"
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: "white", fontWeight: "bold", fontSize: "0.95rem" }}>
                                                    {pack.label}
                                                    {hasBonus && (
                                                        <motion.span
                                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                            style={{ marginLeft: "8px", background: "#C8FF0B", color: "black", padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", verticalAlign: "middle" }}
                                                        >
                                                            <FaBolt /> BONUS +{Math.round(((qty - 1) * (pack.count * 0.20) / (pack.count * qty)) * 100)}%
                                                        </motion.span>
                                                    )}
                                                </div>
                                                <div style={{ color: "#555", fontSize: "11px", marginTop: "2px" }}>
                                                    ${pack.price.toLocaleString("es-CL")} c/u
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#1a1a1a", padding: "6px", borderRadius: "10px", border: "1px solid #333" }}>
                                                <button
                                                    onClick={() => updateQuantity(pack.count, -1)}
                                                    style={{ background: "#222", color: "white", border: "none", width: "24px", height: "24px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span style={{ color: "white", fontWeight: "900", minWidth: "20px", textAlign: "center" }}>{qty}</span>
                                                <button
                                                    onClick={() => updateQuantity(pack.count, 1)}
                                                    style={{ background: "#C8FF0B", color: "black", border: "none", width: "24px", height: "24px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary Cart */}
                            <div style={{ background: "rgba(200, 255, 11, 0.05)", padding: "20px", borderRadius: "16px", border: "1px dashed rgba(200, 255, 11, 0.3)", marginBottom: "20px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                    <span style={{ color: "#888", fontSize: "14px" }}>Total Votos:</span>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ color: "white", fontWeight: "900", fontSize: "1.2rem" }}>
                                            {totalVotes} VOTOS
                                        </div>
                                        {totalBonusVotes > 0 && (
                                            <div style={{ color: "#C8FF0B", fontSize: "11px", fontWeight: "bold" }}>
                                                Incluye {totalBonusVotes} votos de regalo 🎁
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ color: "#888", fontSize: "14px" }}>Total a Pagar:</span>
                                    <span style={{ color: "#C8FF0B", fontWeight: "900", fontSize: "1.3rem" }}>
                                        ${totalAmount.toLocaleString("es-CL")}
                                    </span>
                                </div>
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ color: "#555", fontSize: "11px", display: "block", marginBottom: "8px", textTransform: "uppercase", fontWeight: "bold" }}>Confirmar Email (Envío de comprobante)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        background: "#1a1a1a",
                                        border: "1px solid #333",
                                        borderRadius: "12px",
                                        color: "white",
                                        fontSize: "14px",
                                        outline: "none"
                                    }}
                                />
                            </div>

                            {/* Payment Methods Logos */}
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: "25px", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "12px" }}>
                                <img src="https://www.flow.cl/img/webpay60.png" alt="Webpay" style={{ height: "35px", objectFit: "contain" }} />
                                <img src="https://www.flow.cl/img/onepay60.png" alt="OnePay" style={{ height: "35px", objectFit: "contain" }} />
                                <img src="https://www.flow.cl/img/mach60.png" alt="Mach" style={{ height: "35px", objectFit: "contain" }} />
                                <img src="https://www.flow.cl/img/transfer60.png?v=1" alt="Khipu" style={{ height: "35px", objectFit: "contain" }} />
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={loading || totalAmount === 0}
                                style={{
                                    width: "100%",
                                    padding: "16px",
                                    background: totalAmount > 0 ? "#C8FF0B" : "#222",
                                    color: "black",
                                    border: "none",
                                    borderRadius: "12px",
                                    fontWeight: "900",
                                    fontSize: "1rem",
                                    cursor: loading || totalAmount === 0 ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                                    boxShadow: totalAmount > 0 ? "0 10px 20px -5px rgba(200, 255, 11, 0.3)" : "none",
                                    transition: "all 0.3s"
                                }}
                            >
                                {loading ? "Procesando..." : <><FaBolt /> PAGAR AHORA</>}
                            </button>

                            <p style={{ marginTop: "16px", fontSize: "10px", color: "#444", textAlign: "center" }}>
                                Transacciones seguras vía Flow.cl • Votos válidos para el Ranking Popular.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
