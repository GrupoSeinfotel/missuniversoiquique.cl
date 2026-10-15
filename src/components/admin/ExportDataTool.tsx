"use client";
import { useState } from "react";

export default function ExportDataTool() {
    const [loading, setLoading] = useState(false);

    const exportVotes = async () => {
        setLoading(true);
        try {
            // In a real scenario, this would be a GET request that returns a CSV stream
            // For now we simulate the generation
            const res = await fetch("/api/admin/export/votes");
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Votacion_MU_Iquique_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                alert("Error al exportar los datos.");
            }
        } catch (err) {
            console.error(err);
            alert("Error de conexión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={exportVotes}
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", fontSize: "11px", background: "#333", opacity: loading ? 0.5 : 1 }}
        >
            {loading ? "GENERANDO..." : "EXPORTAR VOTOS (.CSV)"}
        </button>
    );
}
