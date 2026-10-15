"use client";
import { useState } from "react";
import { FaCopy, FaCheck, FaDownload, FaShareAlt, FaLink, FaQrcode } from "react-icons/fa";

interface Props {
    candidateSlug: string;
}

export default function ProfileShareKit({ candidateSlug }: Props) {
    const [copied, setCopied] = useState(false);

    // Generar la URL completa basada en el origen actual
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const profileUrl = `${baseUrl}/candidata/${candidateSlug}`;

    // URL para el código QR de qrserver
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = async () => {
        try {
            const response = await fetch(qrImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `QR-MissUniverse-${candidateSlug}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error al descargar el QR:", error);
            // Fallback: abrir en nueva pestaña
            window.open(qrImageUrl, "_blank");
        }
    };

    return (
        <div className="profile-card profile-card-full" style={{ border: "1px solid var(--accent-pink)", background: "rgba(245,36,95,0.02)" }}>
            <div className="profile-card-header" style={{ borderBottomColor: "rgba(245,36,95,0.1)" }}>
                <div className="profile-card-icon" style={{ background: "rgba(245,36,95,0.1)", color: "var(--accent-pink)" }}>
                    <FaShareAlt />
                </div>
                <span className="profile-card-title">Kit de Compartir / QR</span>
                <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--accent-pink)", opacity: 0.8 }}>
                    ¡Usa esto para conseguir más votos!
                </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "30px", marginTop: "10px" }} className="share-kit-grid">

                {/* Lado izquierdo: Enlace y copy */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
                    <div>
                        <h4 style={{ fontSize: "0.9rem", color: "white", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaLink style={{ fontSize: "0.8rem", color: "var(--accent-pink)" }} /> Tu Enlace de Perfil
                        </h4>
                        <p style={{ fontSize: "0.78rem", color: "#666", marginBottom: "12px" }}>
                            Comparte este enlace directamente en tus redes para que la gente pueda votar por ti.
                        </p>
                        <div style={{
                            display: "flex",
                            background: "#080808",
                            border: "1px solid #1a1a1a",
                            borderRadius: "10px",
                            overflow: "hidden",
                            padding: "4px"
                        }}>
                            <input
                                type="text"
                                readOnly
                                value={profileUrl}
                                style={{
                                    flex: 1,
                                    background: "transparent",
                                    border: "none",
                                    color: "#aaa",
                                    fontSize: "0.8rem",
                                    padding: "10px 15px",
                                    outline: "none"
                                }}
                            />
                            <button
                                onClick={handleCopy}
                                style={{
                                    background: copied ? "#22c55e" : "var(--accent-pink)",
                                    color: "white",
                                    border: "none",
                                    padding: "0 20px",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                {copied ? <><FaCheck /> Copiado</> : <><FaCopy /> Copiar</>}
                            </button>
                        </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", padding: "15px", borderRadius: "10px", border: "1px dashed #222" }}>
                        <h5 style={{ fontSize: "0.8rem", color: "#ddd", marginBottom: "6px" }}>💡 Tip de Marketing</h5>
                        <p style={{ fontSize: "0.75rem", color: "#555", lineHeight: "1.4" }}>
                            Pon este enlace en la bio de tu Instagram para que todos tus seguidores puedan apoyarte con un solo clic.
                        </p>
                    </div>
                </div>

                {/* Lado derecho: QR */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px", textAlign: "center" }}>
                    <div style={{
                        background: "white",
                        padding: "12px",
                        borderRadius: "15px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        width: "160px",
                        height: "160px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <img
                            src={qrImageUrl}
                            alt="Código QR de tu perfil"
                            style={{ width: "100%", height: "100%", display: "block" }}
                        />
                    </div>

                    <button
                        onClick={handleDownloadQR}
                        className="btn-download-qr"
                        style={{
                            background: "transparent",
                            color: "white",
                            border: "1px solid #333",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#1a1a1a"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                    >
                        <FaDownload /> Descargar QR
                    </button>
                    <p style={{ fontSize: "0.65rem", color: "#444" }}>
                        <FaQrcode style={{ verticalAlign: "middle", marginRight: "4px" }} />
                        Escaneable por cualquier cámara
                    </p>
                </div>

            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .share-kit-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .btn-download-qr {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}
