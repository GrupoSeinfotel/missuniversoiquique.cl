"use client";
import { useState } from "react";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaDownload, FaEye } from "react-icons/fa";

interface TicketData {
    code: string;
    name: string;
    email: string;
    type: string;
    ticketNumber?: number | null;
    status: string;
}

export default function RecoverTicketsPage() {
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState<TicketData[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setTickets([]);

        try {
            const res = await fetch("/api/tickets/recover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Ocurrió un error al buscar tus entradas.");
            } else {
                setTickets(data.tickets);
            }
        } catch (err) {
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#050005", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <HeaderExact />
            
            <main style={{ 
                flex: 1, 
                padding: "160px 20px 80px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "radial-gradient(circle at top, #300010 0%, #050005 100%)",
            }}>
                <div style={{ maxWidth: "600px", width: "100%", zIndex: 1 }}>
                    <div style={{ textAlign: "center", marginBottom: "50px" }}>
                        <h1 style={{ 
                            color: "white", 
                            fontSize: "36px", 
                            fontWeight: "900", 
                            marginBottom: "15px",
                            letterSpacing: "2px",
                            textTransform: "uppercase"
                        }}>RECUPERAR ENTRADAS</h1>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
                            Ingresa los datos de tu compra para obtener tus tickets VIP/GENERAL.
                        </p>
                    </div>

                    <div style={{ 
                        background: "rgba(255,255,255,0.03)", 
                        border: "1px solid rgba(245,36,95,0.2)", 
                        padding: "40px", 
                        borderRadius: "24px",
                        backdropFilter: "blur(10px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}>
                        <form onSubmit={handleSearch} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div>
                                <label style={{ color: "#f5245f", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Correo Electrónico
                                </label>
                                <input 
                                    type="email"
                                    required
                                    placeholder="ejemplo@correo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "15px 20px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px",
                                        color: "white",
                                        fontSize: "16px",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ color: "#f5245f", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Código de Pago Flow
                                </label>
                                <input 
                                    type="text"
                                    required
                                    placeholder="ID de Orden o Token"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "15px 20px",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        borderRadius: "12px",
                                        color: "white",
                                        fontSize: "16px",
                                        outline: "none"
                                    }}
                                />
                                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "8px", display: "block" }}>
                                    Puedes usar el número de orden (ej: 165...) o el token recibido en el comprobante.
                                </span>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{
                                    background: "#f5245f",
                                    color: "white",
                                    padding: "18px",
                                    borderRadius: "12px",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px",
                                    marginTop: "10px",
                                    opacity: loading ? 0.7 : 1,
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {loading ? "BUSCANDO..." : <><FaSearch /> BUSCAR ENTRADAS</>}
                            </button>
                        </form>

                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{ color: "#ff4444", textAlign: "center", marginTop: "20px", fontSize: "14px", fontWeight: "bold" }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {tickets.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ marginTop: "50px" }}
                            >
                                <h2 style={{ color: "white", fontSize: "20px", marginBottom: "25px", textAlign: "center", letterSpacing: "1px" }}>
                                    🎫 HEMOS ENCONTRADO {tickets.length} ENTRADAS
                                </h2>
                                
                                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                    {tickets.map((ticket, idx) => (
                                        <motion.div 
                                            key={ticket.code}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                borderRadius: "16px",
                                                padding: "20px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                flexWrap: "wrap",
                                                gap: "15px"
                                            }}
                                        >
                                            <div>
                                                <div style={{ color: "#f5245f", fontWeight: "900", fontSize: "14px", marginBottom: "4px" }}>
                                                    N° {ticket.ticketNumber?.toString().padStart(3, '0') || '---'}
                                                </div>
                                                <div style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>{ticket.name}</div>
                                                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{ticket.type} • {ticket.code.substring(0,8)}...</div>
                                            </div>
                                            
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <Link href={`/entradas/mi-ticket/${ticket.code}`} target="_blank" style={{ textDecoration: "none" }}>
                                                    <button style={{
                                                        background: "rgba(255,255,255,0.1)",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "10px 15px",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        fontSize: "13px",
                                                        fontWeight: "bold"
                                                    }}>
                                                        <FaEye /> VER
                                                    </button>
                                                </Link>
                                                <a href={`/api/tickets/download/${ticket.code}`} download style={{ textDecoration: "none" }}>
                                                    <button style={{
                                                        background: "#f5245f",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "10px 15px",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        fontSize: "13px",
                                                        fontWeight: "bold"
                                                    }}>
                                                        <FaDownload /> PDF
                                                    </button>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <FooterExact />
        </div>
    );
}
