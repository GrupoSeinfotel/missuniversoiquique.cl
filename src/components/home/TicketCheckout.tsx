import { useState, useEffect, useCallback } from "react";
import { FaTag, FaTimes, FaCheckCircle, FaCrown } from "react-icons/fa";

interface PricingData {
    isPresale: boolean;
    presaleEndDate: string;
    VIP:     { presalePrice: number; normalPrice: number; currentPrice: number };
    GENERAL: { presalePrice: number; normalPrice: number; currentPrice: number };
}

interface CouponState {
    code:   string;
    status: "idle" | "checking" | "valid" | "invalid";
    discountedAmount: number | null;
    discountPercent:  number | null;
    message: string;
}

function formatCLP(n: number) {
    return "$" + n.toLocaleString("es-CL");
}

function Countdown({ endDate }: { endDate: string }) {
    const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
    useEffect(() => {
        const tick = () => {
            const di = new Date(endDate).getTime() - Date.now();
            if (di <= 0) return;
            setT({ d: Math.floor(di / 86400000), h: Math.floor((di % 86400000) / 3600000), m: Math.floor((di % 3600000) / 60000), s: Math.floor((di % 60000) / 1000) });
        };
        tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
    }, [endDate]);
    const Box = ({ val, label }: { val: number; label: string }) => (
        <div style={{ textAlign: "center" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(245,36,95,0.4)", borderRadius: "8px", padding: "8px 12px", fontSize: "20px", fontWeight: "900", color: "#f5245f", minWidth: "44px", fontVariantNumeric: "tabular-nums" }}>{String(val).padStart(2, "0")}</div>
            <div style={{ fontSize: "9px", color: "#888", marginTop: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
        </div>
    );
    return (
        <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
            <Box val={t.d} label="días" /><span style={{ color: "#f5245f", fontWeight: "900", fontSize: "18px", paddingBottom: "16px" }}>:</span>
            <Box val={t.h} label="horas" /><span style={{ color: "#f5245f", fontWeight: "900", fontSize: "18px", paddingBottom: "16px" }}>:</span>
            <Box val={t.m} label="min" /><span style={{ color: "#f5245f", fontWeight: "900", fontSize: "18px", paddingBottom: "16px" }}>:</span>
            <Box val={t.s} label="seg" />
        </div>
    );
}

export default function TicketCheckout({ candidateId }: { candidateId?: string }) {
    const [name,       setName]       = useState("");
    const [email,      setEmail]      = useState("");
    const [ticketType, setTicketType] = useState<"VIP" | "GENERAL">("VIP");
    const [quantity,   setQuantity]   = useState(1);
    const [loading,    setLoading]    = useState(false);
    const [error,      setError]      = useState("");
    const [pricing,    setPricing]    = useState<PricingData | null>(null);
    const [loadingPrices, setLoadingPrices] = useState(true);

    const [coupon, setCoupon] = useState<CouponState>({
        code: "", status: "idle", discountedAmount: null, discountPercent: null, message: ""
    });
    const [couponInput, setCouponInput] = useState("");
    const [showCoupon, setShowCoupon]   = useState(false);

    const [candidateName, setCandidateName]   = useState<string | null>(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(candidateId);
    const [allCandidates, setAllCandidates] = useState<any[]>([]);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    useEffect(() => {
        fetch("/api/tickets/pricing").then(r => r.json()).then(d => { setPricing(d); setLoadingPrices(false); }).catch(() => setLoadingPrices(false));
        setLoadingCandidates(true);
        fetch("/api/candidates")
            .then(r => r.json())
            .then(data => {
                setAllCandidates(data);
                setLoadingCandidates(false);
                if (candidateId) {
                    const c = data.find((x: any) => x.id === candidateId);
                    if (c) setCandidateName(c.fullName);
                }
            })
            .catch(() => setLoadingCandidates(false));
    }, [candidateId]);

    const unitPrice   = pricing?.[ticketType]?.currentPrice ?? 15000;
    const baseTotal   = quantity * unitPrice;
    const finalAmount = coupon.status === "valid" && coupon.discountedAmount != null ? coupon.discountedAmount : baseTotal;
    const hasCoupon   = coupon.status === "valid";

    const validateCoupon = useCallback(async (code: string) => {
        if (!code.trim()) {
            setCoupon({ code: "", status: "idle", discountedAmount: null, discountPercent: null, message: "" });
            return;
        }
        setCoupon(c => ({ ...c, status: "checking", message: "" }));
        try {
            const res  = await fetch("/api/tickets/coupon", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ coupon: code, baseAmount: baseTotal })
            });
            const data = await res.json();
            setCoupon({
                code,
                status:           data.valid ? "valid" : "invalid",
                discountedAmount: data.valid ? data.discountedAmount : null,
                discountPercent:  data.valid ? data.discountPercent  : null,
                message:          data.message
            });
        } catch {
            setCoupon(c => ({ ...c, status: "invalid", message: "Error al verificar" }));
        }
    }, [baseTotal]);

    useEffect(() => {
        if (coupon.code) validateCoupon(coupon.code);
    }, [baseTotal, validateCoupon]);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/tickets/flow/create", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ name, email, quantity, type: ticketType, candidateId: selectedCandidateId, coupon: couponInput })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al crear el pago");
            if (data.redirectUrl) window.location.href = data.redirectUrl;
            else throw new Error("No se recibió URL de pago");
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const inp: React.CSSProperties = {
        width: "100%", padding: "13px 16px", background: "#111", border: "1px solid #2a2a2a", borderRadius: "10px", color: "white", outline: "none", boxSizing: "border-box", fontSize: "14px"
    };

    const TypeCard = ({ t, label, icon, desc }: { t: "VIP" | "GENERAL"; label: string; icon: string; desc: string }) => {
        const sel   = ticketType === t;
        const price = pricing?.[t];
        return (
            <div onClick={() => setTicketType(t)} style={{
                flex: 1, background: sel ? "rgba(245,36,95,0.08)" : "#0d0d0d",
                border: sel ? "2px solid #f5245f" : "2px solid #1a1a1a",
                borderRadius: "14px", padding: "18px", cursor: "pointer",
                transition: "all 0.2s", position: "relative", overflow: "hidden",
                minWidth: "140px"
            }}>
                {sel && <div style={{ position: "absolute", top: "10px", right: "10px", background: "#f5245f", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>✓</div>}
                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{icon}</div>
                <div style={{ color: "white", fontWeight: "900", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{label}</div>
                <div style={{ color: "#555", fontSize: "10px", marginBottom: "12px", lineHeight: 1.4 }}>{desc}</div>
                {price && (
                    <>
                        {pricing?.isPresale && <div style={{ color: "#444", fontSize: "10px", textDecoration: "line-through" }}>{formatCLP(price.normalPrice)}</div>}
                        <div style={{ color: sel ? "#f5245f" : "white", fontWeight: "900", fontSize: "20px" }}>{formatCLP(price.currentPrice)}</div>
                        {pricing?.isPresale && <div style={{ color: "#f5245f", fontSize: "9px", fontWeight: "700", letterSpacing: "1px", marginTop: "2px" }}>PREVENTA</div>}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="checkout-outer-container" style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}>
            <style jsx>{`
                .checkout-main {
                    background: #080808; padding: 36px; border-radius: 20px; max-width: 560px; margin: 0 auto; border: 1px solid #141414; box-shadow: 0 30px 70px rgba(0,0,0,0.7);
                }
                .types-grid {
                    display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap;
                }
                @media (max-width: 480px) {
                    .checkout-main { padding: 20px 15px; }
                    .coupon-box { flex-direction: column; }
                }
            `}</style>

            <div className="checkout-main">
                {/* Banner Promo Bonus */}
                <div style={{ 
                    background: "linear-gradient(90deg, rgba(245,36,95,0.2) 0%, rgba(158,14,65,0.2) 100%)",
                    border: "1px solid rgba(245,36,95,0.4)",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "20px",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(245,36,95,0.15)"
                }}>
                    <div style={{ color: "#f5245f", fontWeight: "900", fontSize: "14px", letterSpacing: "1px", marginBottom: "4px" }}>
                        🚀 ¡EVENTO DE BONIFICACIÓN ACTIVADO!
                    </div>
                    <div style={{ color: "white", fontSize: "12px", opacity: 0.9 }}>
                        Cada entrada comprada otorga el <span style={{ color: "#f5245f", fontWeight: "900" }}>DOBLE DE PUNTOS</span> a tu candidata favorita.
                    </div>
                </div>

                {/* Banner preventa */}
                {!loadingPrices && pricing?.isPresale && (
                    <div style={{ background: "rgba(245,36,95,0.06)", border: "1px solid rgba(245,36,95,0.25)", borderRadius: "12px", padding: "14px 18px", marginBottom: "26px", textAlign: "center" }}>
                        <div style={{ color: "#f5245f", fontWeight: "900", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px" }}>🔥 PREVENTA — TERMINA EN</div>
                        <Countdown endDate={pricing.presaleEndDate} />
                    </div>
                )}

                {candidateName ? (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid #1a1a1a", borderRadius: "12px", padding: "10px 15px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f5245f" }} />
                        <span style={{ fontSize: "11px", color: "#888", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                            Tu compra otorga puntos a: <span style={{ color: "white" }}>{candidateName}</span>
                        </span>
                    </div>
                ) : (
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "700" }}>
                            <FaCrown size={12} color="#f5245f" /> Selecciona a qué candidata apoyas
                        </label>
                        <select 
                            value={selectedCandidateId || ""} 
                            onChange={(e) => setSelectedCandidateId(e.target.value)}
                            style={{ ...inp, borderColor: selectedCandidateId ? "rgba(245,36,95,0.4)" : "#222", cursor: "pointer" }}
                        >
                            <option value="">-- No apoyar a ninguna (Venta General) --</option>
                            {allCandidates.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName}</option>
                            ))}
                        </select>
                    </div>
                )}

                <h3 style={{ color: "white", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "14px" }}>Tipo de Entrada</h3>
                <div className="types-grid">
                    {loadingPrices
                        ? <div style={{ flex: 1, background: "#111", border: "2px solid #1a1a1a", borderRadius: "14px", padding: "40px", color: "#333", textAlign: "center" }}>Cargando...</div>
                        : <><TypeCard t="VIP" label="VIP" icon="👑" desc="Zona VIP, acceso preferencial" /><TypeCard t="GENERAL" label="General" icon="🎟️" desc="Acceso general al certamen" /></>
                    }
                </div>

                <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                        <label style={{ color: "#777", fontSize: "10px", display: "block", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Nombre Completo</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Juan Pérez" style={inp} />
                    </div>
                    <div>
                        <label style={{ color: "#777", fontSize: "10px", display: "block", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Correo Electrónico</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="ejemplo@correo.com" style={inp} />
                    </div>

                    <div>
                        <label style={{ color: "#777", fontSize: "10px", display: "block", marginBottom: "7px", textTransform: "uppercase", letterSpacing: "1.5px" }}>Cantidad</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "#111", border: "1px solid #2a2a2a", color: "white", width: "42px", height: "42px", borderRadius: "10px", cursor: "pointer", fontSize: "20px" }}>−</button>
                            <span style={{ fontSize: "22px", color: "white", fontWeight: "900", width: "28px", textAlign: "center" }}>{quantity}</span>
                            <button type="button" onClick={() => setQuantity(quantity + 1)} style={{ background: "#111", border: "1px solid #2a2a2a", color: "white", width: "42px", height: "42px", borderRadius: "10px", cursor: "pointer", fontSize: "20px" }}>+</button>
                            {!loadingPrices && <span style={{ color: "#444", fontSize: "11px" }}>{formatCLP(unitPrice)} c/u</span>}
                        </div>
                    </div>

                    {/* Cupón */}
                    <div>
                        {!showCoupon ? (
                            <button type="button" onClick={() => setShowCoupon(true)} style={{ background: "transparent", border: "none", color: "#555", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
                                <FaTag size={10} /> ¿Tienes un cupón?
                            </button>
                        ) : (
                            <div className="coupon-box" style={{ display: "flex", gap: "8px" }}>
                                <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="CÓDIGO" style={{ ...inp, flex: 1 }} />
                                <button type="button" onClick={() => validateCoupon(couponInput)} disabled={coupon.status === "checking" || !couponInput} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #2a2a2a", color: "white", padding: "0 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "700" }}>{coupon.status === "checking" ? "..." : "APLICAR"}</button>
                            </div>
                        )}
                        {coupon.message && <p style={{ marginTop: "6px", fontSize: "11px", color: coupon.status === "valid" ? "#22c55e" : "#ef4444" }}>{coupon.message}</p>}
                    </div>

                    <div style={{ background: "#050505", border: "1px solid #141414", borderRadius: "12px", padding: "18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ color: "#555", fontSize: "10px", textTransform: "uppercase" }}>TOTAL A PAGAR</div>
                            <div style={{ color: "#f5245f", fontWeight: "900", fontSize: "28px" }}>{formatCLP(finalAmount)}</div>
                        </div>
                    </div>

                    {error && <div style={{ color: "#ef4444", fontSize: "12px", padding: "10px", background: "rgba(239,68,68,0.07)", borderRadius: "8px" }}>⚠️ {error}</div>}

                    <button type="submit" disabled={loading || loadingPrices} style={{
                        background: loading ? "#222" : "linear-gradient(135deg, #f5245f, #9e0e41)", color: "white", border: "none", padding: "18px", borderRadius: "12px", fontWeight: "900", fontSize: "15px", cursor: "pointer", textTransform: "uppercase", letterSpacing: "2px", boxShadow: "0 8px 30px rgba(245,36,95,0.35)"
                    }}>
                        {loading ? "PROCESANDO..." : `PAGAR — ${formatCLP(finalAmount)}`}
                    </button>
                </form>

                <div style={{ marginTop: "22px", textAlign: "center" }}>
                    <p style={{ color: "#333", fontSize: "10px", lineHeight: 1.7 }}>Pago 100% seguro vía Flow · Recibes tu entrada por correo</p>
                </div>
            </div>
        </div>
    );
}
