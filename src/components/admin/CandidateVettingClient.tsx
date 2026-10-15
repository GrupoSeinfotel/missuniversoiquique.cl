"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Vetting {
    id: string;
    adminId: string;
    approved: boolean;
    admin: { username: string | null; role: string };
}

export default function CandidateVettingClient({
    candidateId,
    currentAdminId,
    currentVettings,
    candidateStatus
}: {
    candidateId: string,
    currentAdminId: string,
    currentVettings: any[],
    candidateStatus: string
}) {
    const [vettings, setVettings] = useState<Vetting[]>(currentVettings);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const castVote = async (approved: boolean) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/candidates/${candidateId}/vet`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approved })
            });
            if (res.ok) {
                const updated = await res.json();
                setVettings(updated.vettings);
                if (updated.finalStatus) {
                    router.refresh();
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const myVote = vettings.find(v => v.adminId === currentAdminId);
    const approvalCount = vettings.filter(v => v.approved).length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={panelStyle}>
                <h3 style={titleStyle}>Consenso de Dirección</h3>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <div style={{ fontSize: "12px", color: "var(--text-gray)" }}>VOTOS DE APROBACIÓN</div>
                    <div style={{ fontSize: "14px", fontWeight: "900", color: "var(--accent-pink)" }}>{approvalCount} / 3</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {vettings.map(v => (
                        <div key={v.id} style={{ fontSize: "12px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
                            <span>{v.admin.username || "Admin"} ({v.admin.role})</span>
                            <span style={{ color: v.approved ? "#4caf50" : "#f44336", fontWeight: "bold" }}>{v.approved ? "APROBADO" : "RECHAZADO"}</span>
                        </div>
                    ))}
                    {vettings.length === 0 && <p style={{ fontSize: "11px", color: "#444", textAlign: "center" }}>Sin votos registrados aún.</p>}
                </div>
            </div>

            <div style={panelStyle}>
                <h3 style={titleStyle}>Tu Decisión Ejecutiva</h3>
                {candidateStatus === "APPROVED" ? (
                    <div style={{ textAlign: "center", color: "#4caf50", fontWeight: "700" }}>✓ CANDIDATA YA SELECCIONADA</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                        <button
                            disabled={loading}
                            onClick={() => castVote(true)}
                            style={{
                                padding: "15px",
                                background: myVote?.approved ? "#4caf50" : "#111",
                                border: "1px solid #333",
                                color: "white",
                                cursor: "pointer",
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            APROBAR
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => castVote(false)}
                            style={{
                                padding: "15px",
                                background: (myVote && !myVote.approved) ? "#f44336" : "#111",
                                border: "1px solid #333",
                                color: "white",
                                cursor: "pointer",
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            RECHAZAR
                        </button>
                    </div>
                )}
            </div>

            <div style={{ ...panelStyle, background: "rgba(245, 36, 95, 0.05)", border: "1px dashed var(--accent-pink)" }}>
                <p style={{ fontSize: "11px", color: "var(--text-gray)", lineHeight: "1.4", margin: 0 }}>
                    * El sistema requiere 2 votos de aprobación de distintas cuentas directivas para oficializar a la candidata y publicarla en el sitio web.
                </p>
            </div>
        </div>
    );
}

const panelStyle = {
    background: "var(--secondary-bg)",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.05)"
};

const titleStyle = {
    fontSize: "11px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    marginBottom: "20px",
    borderBottom: "1px solid #222",
    paddingBottom: "10px"
};
