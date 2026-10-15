
"use client";
import { useState } from "react";
import { FaSave, FaChartLine, FaSyncAlt } from "react-icons/fa";

interface Props {
    candidateId: string;
    initialBase: number;
    initialRate: number;
    initialImported: number;
    currentGrowth: number;
    isJuan?: boolean;
}

export default function ImportedVoteManager({ candidateId, initialBase, initialRate, initialImported, currentGrowth, isJuan }: Props) {
    const [base, setBase] = useState(initialBase);
    const [rate, setRate] = useState(initialRate * 100); // UI uses percentage
    const [imported, setImported] = useState(initialImported);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/candidate/${candidateId}/imported-votes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    growthBaseVotes: base,
                    growthRate: rate / 100,
                    importedVotes: imported
                })
            });
            if (res.ok) {
                alert("Configuración de votos guardada.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!confirm("¿Reiniciar el crecimiento a Día 1?")) return;
        setSaving(true);
        try {
            await fetch(`/api/admin/candidate/${candidateId}/imported-votes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetGrowthDate: true })
            });
            alert("Crecimiento reiniciado.");
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleFreeze = async () => {
        if (!confirm("¿Convertir el crecimiento dinámico en un valor fijo editable? Esto detendrá el crecimiento automático.")) return;
        // Calculate total current value (Growth + Existing Manual)
        const totalNow = currentGrowth + imported; // currentGrowth comes from server calculation based on initialBase/Rate

        // Actually, if we use the prop 'currentGrowth', it is the value AT CRATE TIME. 
        // Ideally we should recalculate it to be precise, but the prop is close enough (page load).
        // BUT, notice that 'currentGrowth' passed from parent assumes the SAVED base/rate.
        // If user changed inputs without saving, 'currentGrowth' is stale.
        // That's fine, we usually freeze what is saved.

        setBase(0);
        setRate(0);
        setImported(totalNow);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                <div title="Base Inicial">
                    <input
                        type="number"
                        disabled={!isJuan}
                        value={base}
                        onChange={e => setBase(Number(e.target.value))}
                        style={{ ...inputStyle, opacity: isJuan ? 1 : 0.5 }}
                        placeholder="Base"
                    />
                </div>
                <div title="Crecimiento % diario" style={{ position: 'relative' }}>
                    <input
                        type="number"
                        disabled={!isJuan}
                        value={rate}
                        onChange={e => setRate(Number(e.target.value))}
                        style={{ ...inputStyle, width: "60px", opacity: isJuan ? 1 : 0.5 }}
                        placeholder="%"
                    />
                    <span style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', color: '#666' }}>%</span>
                </div>
                <div title="Ajuste Manual (Estático)" style={{ marginLeft: "10px" }}>
                    <input
                        type="number"
                        disabled={!isJuan}
                        value={imported}
                        onChange={e => setImported(Number(e.target.value))}
                        style={{ ...inputStyle, width: "80px", border: "1px solid var(--accent-pink)", opacity: isJuan ? 1 : 0.5, fontSize: "14px", fontWeight: "bold" }}
                        placeholder="Manual"
                    />
                </div>
                {isJuan && (
                    <>
                        <button
                            onClick={handleFreeze}
                            disabled={saving}
                            title="Congelar y Editar Total (Stop Algoritmo)"
                            style={{ ...btnStyle("#C8FF0B"), color: "black", width: "auto", padding: "0 8px" }}
                        >
                            <span style={{ fontWeight: 800 }}>EDITAR TOTAL</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            title="Guardar Crecimiento"
                            style={btnStyle("var(--accent-pink)")}
                        >
                            <FaSave />
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={saving}
                            title="Reiniciar Día 1"
                            style={btnStyle("#333")}
                        >
                            <FaSyncAlt />
                        </button>
                    </>
                )}
            </div>
            <div style={{ fontSize: '9px', color: '#555', textTransform: 'uppercase', lineHeight: '1.2' }}>
                Algoritmo: {base} + {rate}%/día. | Manual: <span style={{ color: 'var(--accent-pink)' }}>{imported}</span>
                <br />
                <span style={{ color: 'var(--accent-pink)' }}>💡 "Manual" es un valor fijo. El Algoritmo crece con el tiempo automáticamente.</span>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "70px",
    background: "#000",
    border: "1px solid #333",
    color: "white",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "4px",
    outline: "none"
};

const btnStyle = (bg: string) => ({
    background: bg,
    border: "none",
    color: "white",
    width: "28px",
    height: "28px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    opacity: 1
} as const);
