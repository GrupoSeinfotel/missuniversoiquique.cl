"use client";
import { useEffect, useState } from "react";

export default function CandidateVoteAnalytics({ candidateId }: { candidateId: string }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/candidate/analytics")
            .then(async (res) => {
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || "Error cargando métricas");
                return json;
            })
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                <div style={{ fontSize: "2rem", animation: "pulseBtn 1s infinite" }}>📊</div>
                <p>Calculando métricas y analizando votos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#f87171", border: "1px dashed #f87171", borderRadius: 12 }}>
                <p>⚠️ No se pudo cargar el análisis</p>
                <p style={{ fontSize: "0.8rem", marginTop: 8 }}>{error}</p>
            </div>
        );
    }

    if (!data) return null;

    // Calcular el máximo para escalar las barras nativas
    const maxAmount = Math.max(...data.chartData.map((d: any) => d.amount), 1);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                <span style={{ fontSize: "1.8rem" }}>📈</span>
                <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: "white", margin: 0 }}>
                        VOTACIÓN AVANZADA
                    </h2>
                    <p style={{ fontSize: "0.78rem", color: "#555", margin: 0, marginTop: 4 }}>
                        Estadísticas detalladas de apoyo - Exclusivo Nivel 10+
                    </p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 40 }}>
                <div style={{ background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)", padding: "20px", borderRadius: 16, border: "1px solid #222" }}>
                    <div style={{ fontSize: "0.7rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                        Votos de Hoy
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--accent-pink)" }}>
                        {data.todayVotes.toLocaleString()}
                    </div>
                </div>
                
                <div style={{ background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)", padding: "20px", borderRadius: 16, border: "1px solid #222" }}>
                    <div style={{ fontSize: "0.7rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                        Votantes Recurrentes (7d)
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#3b82f6" }}>
                        {data.returningVotersCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "#555", marginTop: 4 }}>Personas que apoyan más de 1 vez</div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #111 0%, #0a0a0a 100%)", padding: "20px", borderRadius: 16, border: "1px solid #222" }}>
                    <div style={{ fontSize: "0.7rem", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                        Votantes Únicos (7d)
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#10b981" }}>
                        {data.totalUnique7Days.toLocaleString()}
                    </div>
                </div>
            </div>

            <div style={{ background: "#0a0a0a", border: "1px solid #222", padding: "30px", borderRadius: 16 }}>
                <h3 style={{ fontSize: "1rem", color: "white", marginBottom: 30, textTransform: "uppercase", letterSpacing: "1px" }}>
                    Crecimiento en los últimos 7 días
                </h3>

                {/* Grafico de Barras Nativo */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "200px", gap: "8%", paddingTop: 20 }}>
                    {data.chartData.map((d: any, i: number) => {
                        const heightPercent = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 0;
                        const isToday = i === data.chartData.length - 1;
                        
                        return (
                            <div key={d.date} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 10, height: "100%", justifyContent: "flex-end" }}>
                                <div style={{ 
                                    fontSize: "0.7rem", 
                                    fontWeight: 900, 
                                    opacity: d.amount > 0 ? 1 : 0, 
                                    color: isToday ? "var(--accent-pink)" : "white",
                                    transition: "all 0.5s ease"
                                }}>
                                    {d.amount}
                                </div>
                                <div style={{
                                    width: "100%",
                                    maxWidth: "40px",
                                    height: `${Math.max(heightPercent, 2)}%`,
                                    background: isToday ? "linear-gradient(to top, #811232, var(--accent-pink))" : "linear-gradient(to top, #111, #333)",
                                    borderRadius: "4px 4px 0 0",
                                    transition: "height 1s cubic-bezier(0.165, 0.84, 0.44, 1)",
                                    boxShadow: isToday ? "0 0 15px rgba(245, 36, 95, 0.3)" : "none"
                                }}></div>
                                <div style={{ fontSize: "0.6rem", color: isToday ? "white" : "#666", fontWeight: isToday ? 900 : "normal" }}>
                                    {isToday ? "HOY" : d.date}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
