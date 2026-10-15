"use client";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import VIP_TEMPLATE from "@/assets/tickets/ENTRADAVIP.jpeg";
import GENERAL_TEMPLATE from "@/assets/tickets/ENTRADAGENERAL.jpeg";

interface TicketProps {
    ticket: {
        code: string;
        name: string;
        email: string;
        type: string;
        ticketNumber?: number | null;
        paymentMethod: string;
        isValidated: boolean;
        createdAt: Date | string;
    }
}

export default function TicketCard({ ticket }: TicketProps) {
    const isVIP = ticket.type?.toUpperCase() === "VIP";
    const origin = typeof window !== "undefined" ? window.location.origin : "https://missuniversoiquique.cl";
    const qrValue = `${origin}/entradas/mi-ticket/${ticket.code}`;
    const formattedNumber = ticket.ticketNumber
        ? ticket.ticketNumber.toString().padStart(3, "0")
        : "---";

    const templateSrc = isVIP ? (VIP_TEMPLATE as any).src : (GENERAL_TEMPLATE as any).src;

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "28px", width: "100%", maxWidth: "400px" }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: "100%", position: "relative" }}
            >
                <div style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "150%", // 2:3 aspect ratio
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: isVIP
                        ? "0 30px 80px rgba(200,150,0,0.35), 0 0 0 1px rgba(200,150,0,0.2)"
                        : "0 30px 80px rgba(30,100,255,0.35), 0 0 0 1px rgba(30,100,255,0.2)"
                }}>
                    <img
                        src={templateSrc}
                        alt={`Entrada ${ticket.type} Miss Universo Iquique`}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />

                    <div style={{
                        position: "absolute",
                        top:   isVIP ? "34.3%" : "32.6%",
                        left:  "50%",
                        transform: "translateX(-50%)",
                        width: isVIP ? "40.5%" : "41%",
                        aspectRatio: "1/1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        padding: "4px",
                        borderRadius: "4px"
                    }}>
                        <QRCodeSVG
                            value={qrValue}
                            size={300}
                            fgColor="#000000"
                            level="H"
                            includeMargin={false}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>

                    <div style={{
                        position: "absolute",
                        top: isVIP ? "67.0%" : "66.2%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "80%",
                        textAlign: "center"
                    }}>
                        <div style={{
                            color: isVIP ? "#FFD700" : "#a0c4ff",
                            fontWeight: "900",
                            fontSize: "clamp(11px, 3.5vw, 18px)",
                            textTransform: "uppercase",
                            letterSpacing: "2px",
                            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
                            fontFamily: "var(--font-raleway, sans-serif)"
                        }}>
                            {ticket.name}
                        </div>
                    </div>

                    <div style={{
                        position: "absolute",
                        top: isVIP ? "72.8%" : "72.3%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "70%",
                        textAlign: "center"
                    }}>
                        <div style={{
                            color: isVIP ? "rgba(255,255,255,0.85)" : "rgba(160, 196, 255, 0.8)",
                            fontWeight: "700",
                            fontSize: "clamp(9px, 2.5vw, 13px)",
                            letterSpacing: "3px",
                            textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                            fontFamily: "monospace"
                        }}>
                            N° {formattedNumber} · {ticket.code.substring(0, 8).toUpperCase()}
                        </div>
                    </div>

                    {ticket.isValidated && (
                        <div style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "rgba(239,68,68,0.9)",
                            color: "white",
                            padding: "6px 14px",
                            borderRadius: "50px",
                            fontSize: "10px",
                            fontWeight: "900",
                            letterSpacing: "1px",
                            textTransform: "uppercase"
                        }}>
                            ✓ UTILIZADA
                        </div>
                    )}
                </div>
            </motion.div>

            <a
                href={`/api/tickets/download/${ticket.code}`}
                download
                style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: isVIP
                        ? "linear-gradient(135deg, #c8960c, #ffd700)"
                        : "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                    color: isVIP ? "#000" : "white",
                    padding: "16px 40px", borderRadius: "50px",
                    textDecoration: "none", fontWeight: "900", fontSize: "14px",
                    boxShadow: isVIP
                        ? "0 10px 30px rgba(200,150,12,0.4)"
                        : "0 10px 30px rgba(59,130,246,0.4)",
                    textTransform: "uppercase", letterSpacing: "2px",
                    transition: "all 0.3s ease"
                }}
            >
                <FaDownload /> DESCARGAR ENTRADA
            </a>
        </div>
    );
}
