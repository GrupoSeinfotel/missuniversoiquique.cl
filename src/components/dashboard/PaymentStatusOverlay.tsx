"use client";

import { useState } from "react";
import { FaWhatsapp, FaLock, FaUniversity, FaCheckCircle, FaUpload } from "react-icons/fa";

interface Candidate {
    id: string;
    fullName: string;
    whatsapp?: string | null;
    paymentStatus: "UNPAID" | "PARTIAL" | "PAID";
    paidAmount: number;
    installments: number;
    paymentProofUrl?: string | null;
    bypassPayment?: boolean;
}

export default function PaymentStatusOverlay({ candidate }: { candidate: Candidate }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [whatsappInput, setWhatsappInput] = useState(candidate.whatsapp || "");
    const [installments, setInstallments] = useState(candidate.installments || 1);
    const [uploading, setUploading] = useState(false);

    // If candidate has paid or has bypass, don't show anything
    if ((candidate.paymentStatus === "PAID" || candidate.bypassPayment) && candidate.whatsapp) return null;

    const handleUpdateWhatsapp = async () => {
        if (!whatsappInput || whatsappInput.length < 8) {
            alert("Por favor ingresa un número de WhatsApp válido.");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/candidate/update-profile", {
                method: "POST",
                body: JSON.stringify({ whatsapp: whatsappInput }),
                headers: { "Content-Type": "application/json" }
            });
            if (res.ok) {
                window.location.reload();
            } else {
                alert("Error al actualizar WhatsApp");
            }
        } catch (e) {
            alert("Error de conexión");
        }
        setIsSubmitting(false);
    };

    const handleFileUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "PAYMENT_PROOF");

        try {
            const res = await fetch("/api/casting/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                // Save proof URL to candidate
                await fetch("/api/candidate/update-profile", {
                    method: "POST",
                    body: JSON.stringify({
                        paymentProofUrl: data.url,
                        installments: installments
                    }),
                    headers: { "Content-Type": "application/json" }
                });
                alert("Comprobante subido con éxito. El director revisará tu pago pronto.");
                window.location.reload();
            } else {
                alert("Error al subir comprobante");
            }
        } catch (e) {
            alert("Error de conexión");
        }
        setUploading(false);
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(10px)"
        }}>
            <div style={{
                maxWidth: "600px",
                width: "100%",
                background: "#0a0a0a",
                border: "1px solid #C8FF0B",
                borderRadius: "24px",
                padding: "40px",
                textAlign: "center",
                boxShadow: "0 0 50px rgba(200, 255, 11, 0.1)"
            }}>
                <div style={{ color: "#C8FF0B", fontSize: "50px", marginBottom: "20px" }}>
                    <FaLock />
                </div>

                {!candidate.whatsapp ? (
                    <>
                        <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "15px" }}>ACTUALIZA TU CONTACTO</h2>
                        <p style={{ color: "#aaa", marginBottom: "30px", fontSize: "14px" }}>
                            Para continuar en el proceso, necesitamos tu número de WhatsApp para coordinaciones internas de la organización.
                        </p>
                        <div style={{ display: "flex", gap: "10px", maxWidth: "400px", margin: "0 auto" }}>
                            <input
                                type="text"
                                placeholder="+569..."
                                value={whatsappInput}
                                onChange={e => setWhatsappInput(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: "#111",
                                    border: "1px solid #333",
                                    color: "white",
                                    padding: "12px",
                                    borderRadius: "8px",
                                    outline: "none"
                                }}
                            />
                            <button
                                onClick={handleUpdateWhatsapp}
                                disabled={isSubmitting}
                                style={{
                                    background: "#C8FF0B",
                                    color: "black",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "8px",
                                    fontWeight: "900",
                                    cursor: "pointer"
                                }}
                            >
                                {isSubmitting ? "..." : "GUARDAR"}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "15px" }}>PAGO PENDIENTE</h2>
                        <p style={{ color: "#aaa", marginBottom: "30px", fontSize: "14px" }}>
                            Tu candidatura está pendiente de pago. Debes contactarte con el director de la organización <strong>Juan Limache</strong> para validar tu participación.
                        </p>

                        <div style={{
                            background: "rgba(255,255,255,0.02)",
                            padding: "20px",
                            borderRadius: "15px",
                            border: "1px solid #222",
                            textAlign: "left",
                            marginBottom: "30px"
                        }}>
                            <h4 style={{ color: "#C8FF0B", marginBottom: "10px", fontSize: "12px", textTransform: "uppercase" }}>Datos de Transferencia</h4>
                            <p style={{ fontSize: "14px", margin: "5px 0" }}><strong>Banco:</strong> Scotiabank</p>
                            <p style={{ fontSize: "14px", margin: "5px 0" }}><strong>Nombre:</strong> JUAN LIMACHE</p>
                            <p style={{ fontSize: "14px", margin: "5px 0" }}><strong>RUT:</strong> 24.962.226-5</p>
                            <p style={{ fontSize: "14px", margin: "5px 0" }}><strong>Tipo:</strong> Cuenta Corriente</p>
                            <p style={{ fontSize: "14px", margin: "5px 0" }}><strong>Cuenta:</strong> 984282397</p>

                            <div style={{ marginTop: "20px", padding: "15px", background: "rgba(245, 36, 95, 0.1)", borderRadius: "10px", border: "1px solid var(--accent-pink)" }}>
                                <h4 style={{ color: "var(--accent-pink)", fontSize: "11px", textTransform: "uppercase", marginBottom: "10px" }}>Montos de Inscripción</h4>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                    <span style={{ fontSize: "13px" }}>Inscripción General:</span>
                                    <strong style={{ fontSize: "13px" }}>$150.000 CLP</strong>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--accent-pink)" }}>
                                    <span style={{ fontSize: "13px" }}>Early Bird (Hasta 15 Feb):</span>
                                    <strong style={{ fontSize: "13px" }}>$100.000 CLP</strong>
                                </div>
                            </div>

                            <div style={{ marginTop: "20px" }}>
                                <h4 style={{ color: "var(--accent-pink)", fontSize: "11px", textTransform: "uppercase", marginBottom: "10px" }}>Tus Beneficios por Participar</h4>
                                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                    {["Formación Pasarela", "Marca Personal", "Portafolio Fotos", "Portafolio Video", "Certificados", "Networking", "Oportunidad Nacional", "Gana Contrato Millonario"].map(b => (
                                        <li key={b} style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                                            <FaCheckCircle size={10} style={{ color: "var(--accent-pink)" }} /> {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <hr style={{ border: "0", borderTop: "1px solid #222", margin: "15px 0" }} />

                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ fontSize: "12px", color: "#aaa", display: "block", marginBottom: "5px" }}>¿En cuántas cuotas pagarás?</label>
                                <select
                                    value={installments}
                                    onChange={e => setInstallments(parseInt(e.target.value))}
                                    style={{ width: "100%", background: "#000", border: "1px solid #333", color: "white", padding: "10px", borderRadius: "8px" }}
                                >
                                    <option value="1">1 Cuota (Total)</option>
                                    <option value="2">2 Cuotas</option>
                                    <option value="3">3 Cuotas (Máximo)</option>
                                </select>
                            </div>

                            <p style={{ fontSize: "12px", color: "var(--accent-pink)" }}>
                                💡 Puedes pagar hasta en 3 cuotas antes del 6 de abril.
                            </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <a
                                href="https://wa.me/56947141721"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    background: "#25D366",
                                    color: "white",
                                    textDecoration: "none",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    fontWeight: "900",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "10px"
                                }}
                            >
                                <FaWhatsapp size={20} /> CONTACTAR A JUAN LIMACHE
                            </a>

                            <div style={{ position: "relative" }}>
                                <button
                                    style={{
                                        width: "100%",
                                        background: "transparent",
                                        border: "1px solid #444",
                                        color: "white",
                                        padding: "15px",
                                        borderRadius: "10px",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px"
                                    }}
                                >
                                    {uploading ? "SUBIENDO..." : (candidate.paymentProofUrl ? "ACTUALIZAR COMPROBANTE" : "SUBIR COMPROBANTE DE PAGO")}
                                    <FaUpload />
                                </button>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                />
                            </div>
                        </div>

                        {candidate.paymentProofUrl && (
                            <p style={{ fontSize: "11px", color: "#666", marginTop: "15px" }}>
                                <FaCheckCircle style={{ color: "#C8FF0B" }} /> Ya has enviado un comprobante. La organización lo revisará pronto.
                            </p>
                        )}
                    </>
                )}

                <div style={{ marginTop: "40px", borderTop: "1px solid #1a1a1a", paddingTop: "20px" }}>
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#444",
                                fontSize: "12px",
                                cursor: "pointer",
                                textDecoration: "underline"
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = "#888")}
                            onMouseOut={e => (e.currentTarget.style.color = "#444")}
                        >
                            Cerrar Sesión e ir al Inicio
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
