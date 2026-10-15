"use client";
import { useState, useEffect } from "react";
import { FaSave, FaTicketAlt } from "react-icons/fa";

export default function TicketPricingAdmin() {
    const [saving, setSaving]   = useState(false);
    const [loading, setLoading] = useState(true);
    const [saved,   setSaved]   = useState(false);

    const [vipPresale,     setVipPresale]     = useState("15000");
    const [vipNormal,      setVipNormal]      = useState("20000");
    const [genPresale,     setGenPresale]     = useState("10000");
    const [genNormal,      setGenNormal]      = useState("15000");
    const [presaleEndDate, setPresaleEndDate] = useState("2026-06-01T23:59");

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(r => r.json())
            .then((data: any[]) => {
                if (!Array.isArray(data)) return;
                const find = (k: string) => data.find(s => s.key === k)?.value ?? "";
                if (find("TICKET_VIP_PRESALE_PRICE"))     setVipPresale(find("TICKET_VIP_PRESALE_PRICE"));
                if (find("TICKET_VIP_NORMAL_PRICE"))      setVipNormal(find("TICKET_VIP_NORMAL_PRICE"));
                if (find("TICKET_GENERAL_PRESALE_PRICE")) setGenPresale(find("TICKET_GENERAL_PRESALE_PRICE"));
                if (find("TICKET_GENERAL_NORMAL_PRICE"))  setGenNormal(find("TICKET_GENERAL_NORMAL_PRICE"));
                if (find("TICKET_PRESALE_END_DATE"))      setPresaleEndDate(find("TICKET_PRESALE_END_DATE").substring(0, 16));
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const save = async (key: string, value: string) => {
            await fetch("/api/admin/settings", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ key, value })
            });
        };
        await save("TICKET_VIP_PRESALE_PRICE",     vipPresale);
        await save("TICKET_VIP_NORMAL_PRICE",       vipNormal);
        await save("TICKET_GENERAL_PRESALE_PRICE",  genPresale);
        await save("TICKET_GENERAL_NORMAL_PRICE",   genNormal);
        await save("TICKET_PRESALE_END_DATE",        new Date(presaleEndDate).toISOString());
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputS: React.CSSProperties = {
        width: "100%", padding: "12px 16px", background: "#0a0a0a",
        border: "1px solid #222", borderRadius: "10px", color: "white",
        outline: "none", fontSize: "15px", fontWeight: "700",
        boxSizing: "border-box"
    };

    const isPresaleActive = new Date(presaleEndDate) > new Date();

    if (loading) return <div style={{ color: "#555", padding: "40px", textAlign: "center" }}>Cargando configuración...</div>;

    return (
        <div style={{ maxWidth: "700px" }}>
            <h2 style={{ color: "white", fontWeight: "900", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "6px", display: "flex", alignItems: "center", gap: "10px" }}>
                <FaTicketAlt color="#f5a623" /> Configuración de Precios de Entradas (Iquique)
            </h2>
            <p style={{ color: "#555", fontSize: "13px", marginBottom: "30px" }}>
                Define los precios de preventa y precio normal para cada tipo de entrada.
            </p>

            {/* Estado actual */}
            <div style={{ background: isPresaleActive ? "rgba(245,36,95,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${isPresaleActive ? "rgba(245,36,95,0.3)" : "#222"}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ fontSize: "28px" }}>{isPresaleActive ? "🔥" : "✅"}</div>
                <div>
                    <div style={{ color: isPresaleActive ? "#f5245f" : "#22c55e", fontWeight: "900", fontSize: "14px" }}>
                        {isPresaleActive ? "PREVENTA ACTIVA" : "PRECIO NORMAL ACTIVO"}
                    </div>
                    <div style={{ color: "#666", fontSize: "12px", marginTop: "2px" }}>
                        {isPresaleActive ? `Termina el ${new Date(presaleEndDate).toLocaleString("es-CL")}` : `Preventa finalizó el ${new Date(presaleEndDate).toLocaleString("es-CL")}`}
                    </div>
                </div>
            </div>

            {/* Fecha fin preventa */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ color: "#f5a623", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "800", marginBottom: "16px" }}>📅 Fecha y Hora Fin de Preventa</h3>
                <input type="datetime-local" value={presaleEndDate} onChange={e => setPresaleEndDate(e.target.value)} style={inputS} />
                <p style={{ color: "#444", fontSize: "11px", marginTop: "8px" }}>Después de esta fecha se cobran los precios normales automáticamente.</p>
            </div>

            {/* VIP */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ color: "#f5a623", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "800", marginBottom: "18px" }}>👑 Entrada VIP</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ color: "#888", fontSize: "11px", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Precio Preventa (CLP)</label>
                        <input type="number" min="1" value={vipPresale} onChange={e => setVipPresale(e.target.value)} style={inputS} placeholder="Ej: 15000" />
                    </div>
                    <div>
                        <label style={{ color: "#888", fontSize: "11px", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Precio Normal (CLP)</label>
                        <input type="number" min="1" value={vipNormal} onChange={e => setVipNormal(e.target.value)} style={inputS} placeholder="Ej: 20000" />
                    </div>
                </div>
            </div>

            {/* GENERAL */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: "16px", padding: "24px", marginBottom: "30px" }}>
                <h3 style={{ color: "#60a5fa", fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "800", marginBottom: "18px" }}>🎟️ Entrada General</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ color: "#888", fontSize: "11px", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Precio Preventa (CLP)</label>
                        <input type="number" min="1" value={genPresale} onChange={e => setGenPresale(e.target.value)} style={inputS} placeholder="Ej: 10000" />
                    </div>
                    <div>
                        <label style={{ color: "#888", fontSize: "11px", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Precio Normal (CLP)</label>
                        <input type="number" min="1" value={genNormal} onChange={e => setGenNormal(e.target.value)} style={inputS} placeholder="Ej: 15000" />
                    </div>
                </div>
            </div>

            <button onClick={handleSave} disabled={saving} style={{
                background: saved ? "linear-gradient(135deg, #22c55e, #16a34a)" : "linear-gradient(135deg, #f5245f, #9e0e41)",
                color: "white", border: "none", padding: "16px 32px", borderRadius: "12px",
                fontWeight: "900", fontSize: "14px", cursor: saving ? "not-allowed" : "pointer",
                textTransform: "uppercase", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "10px",
                opacity: saving ? 0.7 : 1, transition: "all 0.3s ease",
                boxShadow: "0 8px 25px rgba(245,36,95,0.3)"
            }}>
                <FaSave />
                {saving ? "GUARDANDO..." : saved ? "✅ GUARDADO" : "GUARDAR CONFIGURACIÓN"}
            </button>
        </div>
    );
}
