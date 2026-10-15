"use client";
import { useState, useEffect } from "react";

export default function FreeVoteButton({ candidateId, disabled }: { candidateId: string, disabled?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [captchaAnswer, setCaptchaAnswer] = useState("");
    const [captchaToken, setCaptchaToken] = useState("");
    const [challenge, setChallenge] = useState("");

    const fetchChallenge = async () => {
        try {
            const res = await fetch("/api/vote/free/challenge");
            const data = await res.json();
            if (data.question) {
                setChallenge(data.question);
                setCaptchaToken(data.token);
            }
        } catch (e) {
            console.error("Challenge fetch error:", e);
        }
    };

    useEffect(() => {
        fetchChallenge();
    }, []);

    const handleFreeVote = async () => {
        if (!captchaAnswer) return;
        setLoading(true);
        setStatus("idle");
        try {
            // Generate or retrieve UUID device fingerprint from localStorage
            let fingerprint = localStorage.getItem("mu_voter_id");
            if (!fingerprint) {
                fingerprint = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
                localStorage.setItem("mu_voter_id", fingerprint);
            }

            const res = await fetch("/api/vote/free", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ candidateId, fingerprint, captchaAnswer, captchaToken })
            });
            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
            } else {
                setStatus("error");
                setMessage(data.error);
                // Refresh challenge on error
                if (data.requiresCaptcha) {
                    fetchChallenge();
                    setCaptchaAnswer("");
                }
            }
        } catch (err) {
            setStatus("error");
            setMessage("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: "100%" }}>
            {status === "idle" && (
                <div style={{ 
                    marginBottom: "15px", 
                    padding: "15px", 
                    background: "rgba(223,192,109,0.05)", 
                    border: "1px solid rgba(223,192,109,0.2)", 
                    borderRadius: "12px",
                    textAlign: "center"
                }}>
                    <div style={{ 
                        fontSize: "10px", 
                        color: "#dfc06d", 
                        textTransform: "uppercase", 
                        letterSpacing: "2px", 
                        marginBottom: "10px",
                        fontWeight: "bold"
                    }}>
                        Verificación Humana (Voto x15)
                    </div>
                    
                    {!challenge ? (
                        <div style={{ color: "#444", fontSize: "12px" }}>Cargando desafío...</div>
                    ) : (
                        <>
                            <div style={{ color: "white", fontSize: "14px", marginBottom: "12px", fontWeight: "bold" }}>
                                {challenge}
                            </div>
                            <input 
                                type="text" 
                                placeholder="Ingresa el resultado"
                                value={captchaAnswer}
                                onChange={(e) => setCaptchaAnswer(e.target.value)}
                                style={{ 
                                    width: "100%", 
                                    padding: "12px", 
                                    background: "rgba(0,0,0,0.5)", 
                                    border: "1px solid #333", 
                                    borderRadius: "8px", 
                                    color: "white", 
                                    textAlign: "center",
                                    fontSize: "16px",
                                    outline: "none"
                                }}
                            />
                        </>
                    )}
                </div>
            )}

            <button
                onClick={handleFreeVote}
                disabled={loading || status === "success" || disabled || !captchaAnswer}
                className="btn-primary"
                style={{
                    width: "100%",
                    background: (disabled || !captchaAnswer) ? "rgba(255,255,255,0.05)" : status === "success" ? "#1B4332" : "var(--accent-pink)",
                    color: (disabled || !captchaAnswer) ? "#444" : "white",
                    border: (disabled || !captchaAnswer) ? "1px solid #333" : status === "success" ? "1px solid #2D6A4F" : "none",
                    padding: "18px",
                    borderRadius: "12px",
                    fontWeight: "900",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    opacity: loading || disabled ? 0.7 : 1,
                    cursor: (loading || status === "success" || disabled || !captchaAnswer) ? "default" : "pointer",
                    transition: "all 0.3s",
                    boxShadow: (disabled || !captchaAnswer) ? "none" : "0 4px 15px rgba(214,31,105,0.3)"
                }}
            >
                {loading ? "PROCESANDO..." : status === "success" ? "✓ VOTO REGISTRADO" : disabled ? "VOTACIÓN CERRADA" : "EMITIR VOTO GRATUITO"}
            </button>
            
            {message && (
                <p style={{ 
                    color: status === "error" ? "#ff4d4d" : "#dfc06d", 
                    fontSize: "12px", 
                    fontWeight: "bold",
                    marginTop: "12px", 
                    textAlign: "center", 
                    lineHeight: "1.4",
                    padding: "0 10px"
                }}>
                    {message}
                </p>
            )}
        </div>
    );
}
