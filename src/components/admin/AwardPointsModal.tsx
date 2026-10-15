
"use client";
import { useState } from "react";
import { FaTrophy, FaPaperPlane } from "react-icons/fa";
import RewardVisual from "../dashboard/RewardVisual";

interface Props {
    candidateId: string;
    candidateName: string;
}

export default function AwardPointsModal({ candidateId, candidateName }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [points, setPoints] = useState(100);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`¿Estás seguro de otorgar ${points} puntos a ${candidateName}?`)) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/candidate/${candidateId}/award-points`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points, message })
            });

            if (res.ok) {
                setShowPreview(true);
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || 'No se pudo otorgar los puntos'}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleClosePreview = () => {
        setIsOpen(false);
        setShowPreview(false);
        setMessage("");
        window.location.reload();
    };

    if (showPreview) {
        return (
            <RewardVisual
                candidateName={candidateName}
                points={points}
                message={message}
                onClose={handleClosePreview}
            />
        );
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    background: "#C8FF0B",
                    color: "black",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    textTransform: "uppercase"
                }}
            >
                <FaTrophy /> Otorgar Puntos
            </button>
        );
    }

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
            backdropFilter: "blur(10px)"
        }}>
            <div style={{
                background: "#111",
                border: "1px solid #222",
                padding: "30px",
                borderRadius: "20px",
                width: "100%",
                maxWidth: "500px",
                boxShadow: "0 10px 50px rgba(0,0,0,0.5)"
            }}>
                <h2 style={{
                    fontSize: "1.2rem",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "20px",
                    color: "white"
                }}>
                    Otorgar Premio a <span style={{ color: "var(--accent-pink)" }}>{candidateName}</span>
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", color: "#666", fontSize: "11px", textTransform: "uppercase", marginBottom: "8px" }}>Cantidad de Puntos</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: "30px" }}>
                        <label style={{ display: "block", color: "#666", fontSize: "11px", textTransform: "uppercase", marginBottom: "8px" }}>Mensaje del Premio</label>
                        <textarea
                            required
                            placeholder="Ej: Excelente desempeño en la actividad de hoy..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{ ...inputStyle, height: "100px", resize: "none" }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            disabled={loading}
                            style={{
                                flex: 1,
                                padding: "12px",
                                background: "#222",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                flex: 2,
                                padding: "12px",
                                background: "var(--accent-pink)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}
                        >
                            {loading ? "Enviando..." : <><FaPaperPlane /> Enviar Puntos</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    background: "#000",
    border: "1px solid #333",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none"
};
