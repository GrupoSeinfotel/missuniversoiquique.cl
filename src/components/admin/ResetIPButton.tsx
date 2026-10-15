
"use client";
import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

export default function ResetIPButton() {
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!confirm("⚠️ ¿Estás seguro de resetear las IPs? \n\nEsto permitirá que todos los usuarios que ya votaron hoy puedan volver a emitir un voto gratuito (útil para la Hora Feliz).")) return;

        setLoading(true);
        try {
            const res = await fetch("/api/admin/reset-free-votes", { method: "POST" });
            if (res.ok) {
                alert("🚀 IPs reseteadas con éxito. ¡Votantes liberados!");
            } else {
                alert("Error al resetear IPs.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleReset}
            disabled={loading}
            style={{
                background: "#f5245f",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 0 15px rgba(245, 36, 95, 0.3)"
            }}
        >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            {loading ? "Reseteando..." : "Resetear IPs (Hora Feliz)"}

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </button>
    );
}
