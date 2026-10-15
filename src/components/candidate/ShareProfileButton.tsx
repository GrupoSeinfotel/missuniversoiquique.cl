"use client";
import { FaShareAlt, FaFacebookF, FaWhatsapp, FaTwitter, FaCopy, FaCheck } from "react-icons/fa";
import { useState } from "react";

export default function ShareProfileButton({ slug, fullName }: { slug: string, fullName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/candidata/${slug}` : '';
    const shareText = `¡Apoya a ${fullName} en Miss Universe Iquique! Vota aquí:`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Vota por ${fullName}`,
                    text: shareText,
                    url: shareUrl
                });
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
            <button
                onClick={shareNative}
                style={{
                    background: "transparent",
                    border: "1px solid var(--accent-pink)",
                    color: "white",
                    padding: "12px",
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    fontWeight: "bold",
                    fontSize: "14px",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(245, 36, 95, 0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
                <FaShareAlt /> COMPARTIR PERFIL
            </button>

            {isOpen && (
                <div style={{
                    position: "absolute",
                    bottom: "110%",
                    left: "0",
                    right: "0",
                    background: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                    zIndex: 10
                }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            style={socialBtnStyle("#3b5998")}
                        >
                            <FaFacebookF />
                        </a>
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                            target="_blank"
                            style={socialBtnStyle("#25D366")}
                        >
                            <FaWhatsapp />
                        </a>
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                            target="_blank"
                            style={socialBtnStyle("#1DA1F2")}
                        >
                            <FaTwitter />
                        </a>
                    </div>
                    <div
                        onClick={handleCopy}
                        style={{
                            background: "#333",
                            padding: "10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            color: "#ccc"
                        }}
                    >
                        <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", maxWidth: "150px" }}>{shareUrl}</span>
                        {copied ? <FaCheck style={{ color: "#C8FF0B" }} /> : <FaCopy />}
                    </div>
                </div>
            )}
        </div>
    );
}

const socialBtnStyle = (bg: string) => ({
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: bg,
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: "18px"
});
