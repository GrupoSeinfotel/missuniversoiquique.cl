"use client";
import { useState } from "react";
import { FaCheckCircle, FaTrash, FaWhatsapp, FaClock } from "react-icons/fa";

interface TicketPresale {
    id: string;
    whatsapp: string;
    status: string;
    createdAt: Date | string;
}

interface PresaleClientProps {
    tickets: TicketPresale[];
}

export default function PresaleClient({ tickets: initialTickets }: PresaleClientProps) {
    const [tickets, setTickets] = useState(initialTickets);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleAction = async (id: string, action: "contacted" | "delete") => {
        if (action === "delete" && !confirm("¿Seguro que deseas eliminar el registro de este número?")) return;

        setLoadingId(id);
        try {
            const res = await fetch(`/api/admin/preventa/${id}/${action}`, { method: 'POST' });
            if (res.ok) {
                if (action === "delete") {
                    setTickets(tickets.filter(t => t.id !== id));
                } else {
                    setTickets(tickets.map(t => t.id === id ? { ...t, status: "CONTACTED" } : t));
                }
            } else {
                alert("Error al actualizar estado.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión.");
        } finally {
            setLoadingId(null);
        }
    };

    const pendingCount = tickets.filter(t => t.status === "PENDING").length;

    return (
        <div style={{ padding: "30px", background: "var(--primary-bg)", minHeight: "100vh", color: "white" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--accent-pink)" }}>
                Preventa de Entradas
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "30px" }}>
                Números de WhatsApp registrados esperando ser contactados para la preventa. Hay <strong>{pendingCount}</strong> pendientes.
            </p>

            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "15px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                {tickets.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
                        No hay registros de preventa aún.
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.4)", textAlign: "left" }}>
                                <th style={{ padding: "15px 20px" }}>Número WhatsApp</th>
                                <th style={{ padding: "15px 20px" }}>Fecha Registro</th>
                                <th style={{ padding: "15px 20px" }}>Estado</th>
                                <th style={{ padding: "15px 20px", textAlign: "right" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(t => (
                                <tr key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <td style={{ padding: "15px 20px", fontSize: "16px", fontWeight: "bold" }}>
                                        <FaWhatsapp style={{ color: "#25D366", marginRight: "10px" }} />
                                        <a href={`https://wa.me/${t.whatsapp.replace(/\+/g, '')}?text=Hola,%20somos%20de%20la%20organización%20de%20Miss%20Universo.%20Te%20escribimos%20por%20la%20preventa%20de%20entradas.`} target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "underline" }}>
                                            {t.whatsapp}
                                        </a>
                                    </td>
                                    <td style={{ padding: "15px 20px", color: "#aaa" }}>
                                        {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td style={{ padding: "15px 20px" }}>
                                        {t.status === "PENDING" ? (
                                            <span style={{ background: "rgba(255, 165, 0, 0.2)", color: "orange", padding: "5px 10px", borderRadius: "10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                                <FaClock /> Pendiente
                                            </span>
                                        ) : (
                                            <span style={{ background: "rgba(0, 255, 136, 0.2)", color: "#00ff88", padding: "5px 10px", borderRadius: "10px", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                                                <FaCheckCircle /> Contactado
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: "15px 20px", textAlign: "right", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                        {t.status === "PENDING" && (
                                            <button 
                                                onClick={() => handleAction(t.id, "contacted")}
                                                disabled={loadingId === t.id}
                                                style={{ background: "#00ff88", color: "black", border: "none", padding: "8px 15px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
                                            >
                                                {loadingId === t.id ? "..." : "Marcar Contactado"}
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleAction(t.id, "delete")}
                                            disabled={loadingId === t.id}
                                            style={{ background: "transparent", border: "1px solid #ff4d4d", color: "#ff4d4d", padding: "8px 15px", borderRadius: "8px", cursor: "pointer" }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
