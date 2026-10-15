"use client";
import { useState, useEffect } from "react";

export default function VoteCountdown({ deadlineStr, title }: { deadlineStr: string, title?: string }) {
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const deadline = new Date(deadlineStr).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = deadline - now;

            if (diff <= 0) {
                clearInterval(timer);
                setIsExpired(true);
                setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
            } else {
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [deadlineStr]);

    if (!timeLeft) return null;

    return (
        <div style={{
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(223,192,109,0.3)",
            borderRadius: "15px",
            padding: "20px",
            textAlign: "center",
            maxWidth: "500px",
            margin: "0 auto 30px auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
            <h4 style={{ 
                color: "#dfc06d", 
                fontSize: "11px", 
                letterSpacing: "3px", 
                textTransform: "uppercase", 
                marginBottom: "15px",
                fontWeight: 800
            }}>
                {isExpired ? "VOTACIÓN FINALIZADA" : (title || "Cierre de Votación")}
            </h4>
            
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                {[
                    { val: timeLeft.d, label: "Días" },
                    { val: timeLeft.h, label: "Horas" },
                    { val: timeLeft.m, label: "Mins" },
                    { val: timeLeft.s, label: "Segs" }
                ].map((unit, i) => (
                    <div key={i} style={{ minWidth: "60px" }}>
                        <div style={{ 
                            fontSize: "1.8rem", 
                            fontWeight: 900, 
                            color: isExpired ? "#444" : "white",
                            lineHeight: 1
                        }}>
                            {String(unit.val).padStart(2, '0')}
                        </div>
                        <div style={{ 
                            fontSize: "0.6rem", 
                            color: "#888", 
                            textTransform: "uppercase", 
                            marginTop: "5px",
                            letterSpacing: "1px"
                        }}>
                            {unit.label}
                        </div>
                    </div>
                ))}
            </div>

            {isExpired && (
                <div style={{ 
                    marginTop: "15px", 
                    color: "#ff4d4d", 
                    fontSize: "0.8rem", 
                    fontWeight: "bold",
                    background: "rgba(255,0,0,0.1)",
                    padding: "8px",
                    borderRadius: "5px"
                }}>
                    El periodo de votación oficial ha concluido.
                </div>
            )}
        </div>
    );
}
