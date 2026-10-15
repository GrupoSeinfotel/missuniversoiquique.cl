"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";

interface TicketData {
    code: string;
    name: string;
    email: string;
    type: string;
    ticketNumber?: number | null;
    isValidated: boolean;
    createdAt: string;
}

function TicketStatusContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const statusParam = searchParams.get("status");
    const isTest = searchParams.get("test") === "1";
    const testEmail = searchParams.get("email");

    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(false);

    // En modo prueba siempre es éxito
    let statusType = isTest ? "success" : "pending";
    let title = isTest ? "¡COMPRA DE PRUEBA EXITOSA!" : "PROCESANDO PAGO";
    let message = isTest ? "Tus entradas de prueba fueron creadas exitosamente. Aquí puedes verlas:" : "Estamos verificando el estado de tu compra...";
    let color = isTest ? "#2ecc71" : "#D4AF37";

    if (!isTest) {
        if (statusParam === "error") {
            statusType = "error";
            title = "ERROR EN EL PAGO";
            message = "Ocurrió un error al procesar tu pago. Por favor, intenta nuevamente.";
            color = "#e74c3c";
        } else if (statusParam === "PAID") {
            statusType = "success";
            title = "¡PAGO EXITOSO!";
            message = "Tu entrada ha sido confirmada. A continuación puedes ver y descargar tus entradas.";
            color = "#2ecc71";
        } else if (statusParam === "REJECTED" || statusParam === "ANNULLED") {
            statusType = "error";
            title = "PAGO RECHAZADO O ANULADO";
            message = "La transacción no pudo completarse. Puedes volver a intentar la compra de tus entradas.";
            color = "#e74c3c";
        }
    }

    useEffect(() => {
        if (isTest && testEmail) {
            setLoading(true);
            fetch(`/api/tickets/recover?email=${encodeURIComponent(testEmail)}`)
                .then(r => r.json())
                .then(data => {
                    if (data.tickets) setTickets(data.tickets);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        } else if (statusType === "success" && token) {
            setLoading(true);
            fetch(`/api/tickets/by-token?token=${token}`)
                .then(r => r.json())
                .then(data => {
                    if (data.tickets) setTickets(data.tickets);
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        }
    }, [statusType, token, isTest, testEmail]);

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "#0a0a0a",
            color: "white"
        }}>
            <HeaderExact />
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "120px 20px 60px" }}>
                <div style={{ maxWidth: "600px", width: "100%", textAlign: "center" }}>
                    {/* Status Card */}
                    <div style={{
                        background: "#111",
                        border: `1px solid ${color}`,
                        padding: "40px",
                        borderRadius: "15px",
                        marginBottom: "30px",
                        boxShadow: `0 0 30px rgba(${color === '#2ecc71' ? '46,204,113' : '0,0,0'}, 0.15)`
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                            {statusType === "success" ? "🎉" : statusType === "error" ? "❌" : "⏳"}
                        </div>
                        <h2 style={{ color: color, marginBottom: "16px", textTransform: "uppercase", letterSpacing: "2px", fontSize: "22px" }}>{title}</h2>
                        <p style={{ marginBottom: "20px", lineHeight: "1.6", color: "#ccc" }}>{message}</p>
                        {token && <p style={{ fontSize: "11px", color: "#555", wordBreak: "break-all" }}>Ref: {token}</p>}
                    </div>

                    {/* Tickets List */}
                    {loading && (
                        <div style={{ color: "#D4AF37", padding: "30px" }}>Cargando tus entradas...</div>
                    )}

                    {tickets.length > 0 && (
                        <div>
                            <h3 style={{ color: "#D4AF37", marginBottom: "20px", letterSpacing: "2px", textTransform: "uppercase" }}>
                                🎫 TUS ENTRADAS ({tickets.length})
                            </h3>
                            {tickets.map((ticket) => (
                                <div key={ticket.code} style={{
                                    background: "#111",
                                    border: "1px solid rgba(212,175,55,0.3)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    marginBottom: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    flexWrap: "wrap"
                                }}>
                                    <div style={{ textAlign: "left" }}>
                                        <div style={{ color: "#D4AF37", fontWeight: "900", fontSize: "18px" }}>
                                            N° {ticket.ticketNumber?.toString().padStart(3, '0') || '---'}
                                        </div>
                                        <div style={{ color: "white", fontWeight: "bold", marginTop: "4px" }}>{ticket.name}</div>
                                        <div style={{ color: "#888", fontSize: "12px" }}>Tipo: {ticket.type} • Código: {ticket.code.substring(0, 10)}...</div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        <Link href={`/entradas/mi-ticket/${ticket.code}`} target="_blank">
                                            <button style={{
                                                background: "transparent",
                                                border: "2px solid #D4AF37",
                                                color: "#D4AF37",
                                                padding: "10px 20px",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                fontWeight: "bold",
                                                fontSize: "13px",
                                            }}>
                                                👁 VER ENTRADA
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "20px", flexWrap: "wrap" }}>
                        <Link href="/">
                            <button style={{
                                background: "transparent",
                                border: "2px solid #666",
                                color: "#ccc",
                                padding: "15px 30px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textTransform: "uppercase",
                                letterSpacing: "1px",
                                borderRadius: "8px"
                            }}>
                                VOLVER AL INICIO
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <FooterExact />
        </div>
    );
}

export default function TicketStatusPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0a0a0a" }} />}>
            <TicketStatusContent />
        </Suspense>
    );
}
