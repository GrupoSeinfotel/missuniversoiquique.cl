"use client";
import { useState, useEffect } from "react";
import { FaShieldAlt, FaPlus, FaTrash, FaHistory, FaCheckCircle, FaExclamationTriangle, FaChevronDown, FaChevronRight, FaFilter, FaLayerGroup } from "react-icons/fa";

interface SecurityDashboardProps {
    initialBannedIps: any[];
    initialSnapshots: any[];
}

export default function SecurityDashboard({ initialBannedIps, initialSnapshots }: SecurityDashboardProps) {
    const [bannedIps, setBannedIps] = useState(initialBannedIps);
    const [snapshots, setSnapshots] = useState(initialSnapshots);
    const [analysisData, setAnalysisData] = useState<any[]>([]);
    const [expandedIps, setExpandedIps] = useState<Set<string>>(new Set());
    const [newIp, setNewIp] = useState("");
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showBannedIps, setShowBannedIps] = useState(false);

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const fetchAnalysis = async () => {
        setLoadingAnalysis(true);
        try {
            const res = await fetch("/api/admin/security/votes-analysis");
            const data = await res.json();
            if (res.ok) setAnalysisData(data);
        } catch (err) {
            console.error("Error loading analysis");
        } finally {
            setLoadingAnalysis(false);
        }
    };

    const toggleIp = (ip: string) => {
        const newSet = new Set(expandedIps);
        if (newSet.has(ip)) newSet.delete(ip);
        else newSet.add(ip);
        setExpandedIps(newSet);
    };

    const toggleAll = () => {
        if (expandedIps.size > 0) setExpandedIps(new Set());
        else setExpandedIps(new Set(analysisData.map(d => d.ip)));
    };

    const getIpColor = (count: number) => {
        if (count <= 2) return "#00d8ff"; // Celeste
        if (count <= 4) return "#0066ff"; // Azul
        if (count === 5) return "#ff9100"; // Naranja
        return "#ff0000"; // Rojo
    };

    const handleBan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIp) return;
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/security/ban", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ip: newIp, reason })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: `IP ${newIp} baneada con éxito. Se descontaron ${data.deletedVotes} votos.` });
                setBannedIps([data.bannedIp, ...bannedIps]);
                setAnalysisData(prev => prev.filter(d => d.ip !== newIp));
                setNewIp("");
                setReason("");
            } else {
                setMessage({ type: 'error', text: data.error || "Error al banear IP" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Error de conexión" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateSnapshot = async () => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/security/snapshot", {
                method: "POST"
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: 'success', text: "Blindaje del ranking creado con éxito." });
                setSnapshots([data.snapshot, ...snapshots]);
            } else {
                setMessage({ type: 'error', text: data.error || "Error al crear snapshot" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Error de conexión" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestore = async (snapshotId: string) => {
        if (!confirm("¿Estás seguro de que deseas restaurar este punto de blindaje? Esta acción reemplazará los puntos actuales de la candidata.")) return;
        
        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/admin/security/snapshot/restore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ snapshotId })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: "Ranking restaurado con éxito. Actualiza el ranking para ver los cambios." });
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || "Error al restaurar" });
            }
        } catch (err) {
            setMessage({ type: 'error', text: "Error de conexión" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px" }}>
            
            {/* ── SECCIÓN ANÁLISIS DE VOTOS ── */}

            {/* ── SECCIÓN BANEO ── */}
            <div style={{ 
                gridColumn: "1 / -1",
                background: "rgba(20, 20, 20, 0.6)", 
                borderRadius: "20px", 
                padding: "30px", 
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
                    <FaShieldAlt style={{ color: "var(--accent-pink)", fontSize: "1.5rem" }} />
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0 }}>Gestión de Bloqueos (IP)</h2>
                </div>

                <form onSubmit={handleBan} style={{ marginBottom: "30px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <input 
                            type="text" 
                            placeholder="Dirección IP (ej: 192.168.1.1)" 
                            value={newIp}
                            onChange={(e) => setNewIp(e.target.value)}
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                                padding: "12px 15px",
                                color: "white",
                                outline: "none"
                            }}
                        />
                        <input 
                            type="text" 
                            placeholder="Motivo del baneo (opcional)" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "10px",
                                padding: "12px 15px",
                                color: "white",
                                outline: "none"
                            }}
                        />
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            style={{
                                background: "var(--accent-pink)",
                                color: "black",
                                border: "none",
                                borderRadius: "10px",
                                padding: "12px",
                                fontWeight: "900",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                transition: "all 0.2s"
                            }}
                        >
                            <FaPlus /> {isSubmitting ? "Procesando..." : "Banear IP y Limpiar Votos (24h)"}
                        </button>
                    </div>
                </form>

                {message && (
                    <div style={{ 
                        padding: "15px", 
                        borderRadius: "10px", 
                        marginBottom: "20px",
                        background: message.type === 'success' ? "rgba(0, 255, 136, 0.1)" : "rgba(255, 77, 77, 0.1)",
                        color: message.type === 'success' ? "#00ff88" : "#ff4d4d",
                        border: `1px solid ${message.type === 'success' ? "rgba(0, 255, 136, 0.2)" : "rgba(255, 77, 77, 0.2)"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "0.9rem"
                    }}>
                        {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        {message.text}
                    </div>
                )}

                <div style={{ marginTop: "20px" }}>
                    <button 
                        onClick={() => setShowBannedIps(!showBannedIps)}
                        type="button"
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "10px 15px",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            fontWeight: "bold"
                        }}
                    >
                        <span style={{ display: "flex", alignItems: "center" }}>
                            <FaLayerGroup style={{ marginRight: '10px' }} /> Historial de IPs Bloqueadas ({bannedIps.length})
                        </span>
                        {showBannedIps ? <FaChevronDown /> : <FaChevronRight />}
                    </button>

                    {showBannedIps && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                            {bannedIps.length === 0 && <p style={{ color: "#444", fontSize: "0.9rem" }}>No hay IPs bloqueadas.</p>}
                            {bannedIps.map((b: any) => (
                                <div key={b?.id || Math.random()} style={{ 
                                    background: "rgba(255,255,255,0.03)", 
                                    padding: "12px 15px", 
                                    borderRadius: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <div>
                                        <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{b?.ip || "Error IP"}</div>
                                        <div style={{ fontSize: "0.75rem", color: "#666" }}>{b?.reason || "Sin motivo"} • {b?.createdAt ? new Date(b.createdAt).toLocaleDateString() : ""}</div>
                                    </div>
                                    <button type="button" style={{ background: "transparent", border: "none", color: "#ff4d4d", cursor: "pointer" }}>
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* ── SECCIÓN ANÁLISIS DE VOTOS ── */}
            <div style={{ 
                gridColumn: "1 / -1",
                background: "rgba(20, 20, 20, 0.6)", 
                borderRadius: "20px", 
                padding: "30px", 
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <FaFilter style={{ color: "var(--accent-pink)", fontSize: "1.5rem" }} />
                        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0 }}>Análisis de Votos por IP (Últimos 3 días)</h2>
                    </div>
                    <button 
                        onClick={toggleAll}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "white",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "8px 15px",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <FaLayerGroup /> {expandedIps.size > 0 ? "Contraer Todo" : "Expandir Todo"}
                    </button>
                </div>

                {loadingAnalysis ? (
                    <p style={{ color: "#888" }}>Cargando análisis forense...</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {analysisData.map((data) => (
                            <div key={data.ip} style={{ 
                                background: "rgba(255,255,255,0.02)", 
                                borderRadius: "12px",
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.05)"
                            }}>
                                <div 
                                    onClick={() => toggleIp(data.ip)}
                                    style={{ 
                                        padding: "15px 20px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        transition: "background 0.2s"
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        {expandedIps.has(data.ip) ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                        <span style={{ 
                                            fontWeight: "700", 
                                            fontFamily: "monospace", 
                                            fontSize: "1.1rem",
                                            color: getIpColor(data.count)
                                        }}>
                                            {data.ip}
                                        </span>
                                        {data.count > 5 && (
                                            <span style={{ 
                                                background: "rgba(255, 0, 0, 0.1)", 
                                                color: "#ff0000", 
                                                fontSize: "0.7rem", 
                                                padding: "2px 8px", 
                                                borderRadius: "4px",
                                                fontWeight: "bold"
                                            }}>
                                                ALTO RIESGO
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: "1.2rem", fontWeight: "900", color: getIpColor(data.count) }}>
                                                {data.count}
                                            </div>
                                            <div style={{ fontSize: "0.7rem", color: "#666", textTransform: "uppercase" }}>Votos Totales</div>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNewIp(data.ip);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "none",
                                                color: "white",
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                fontSize: "0.75rem",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Seleccionar para Ban
                                        </button>
                                    </div>
                                </div>

                                {expandedIps.has(data.ip) && (
                                    <div style={{ 
                                        padding: "0 20px 20px 50px",
                                        background: "rgba(0,0,0,0.2)"
                                    }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                                            <thead>
                                                <tr style={{ textAlign: "left", color: "#666", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                    <th style={{ padding: "10px 0" }}>Candidata</th>
                                                    <th>Fecha y Hora</th>
                                                    <th>Tipo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.votes.map((v: any) => (
                                                    <tr key={v.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                                                        <td style={{ padding: "10px 0", color: "#ccc" }}>{v.candidateName}</td>
                                                        <td style={{ color: "#888" }}>{new Date(v.createdAt).toLocaleString()}</td>
                                                        <td>
                                                            <span style={{ 
                                                                fontSize: "0.7rem", 
                                                                padding: "2px 6px", 
                                                                borderRadius: "4px",
                                                                background: v.type === 'PREMIUM' ? "rgba(255, 215, 0, 0.1)" : "rgba(255,255,255,0.05)",
                                                                color: v.type === 'PREMIUM' ? "#ffd700" : "#aaa"
                                                            }}>
                                                                {v.type}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── SECCIÓN BLINDAJE ── */}
            <div style={{ 
                background: "rgba(20, 20, 20, 0.6)", 
                borderRadius: "20px", 
                padding: "30px", 
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
                    <FaHistory style={{ color: "#00ff88", fontSize: "1.5rem" }} />
                    <h2 style={{ fontSize: "1.2rem", fontWeight: "700", margin: 0 }}>Blindaje de Ranking (Snapshots)</h2>
                </div>

                <div style={{ marginBottom: "30px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#aaa", lineHeight: "1.6", marginBottom: "20px" }}>
                        Un "Blindaje" guarda el estado exacto de todos los votos y puntos en este momento. Si ocurre un fallo masivo o pérdida de datos, podemos restaurar el ranking desde uno de estos puntos.
                    </p>
                    <button 
                        onClick={handleCreateSnapshot}
                        disabled={isSubmitting}
                        style={{
                            background: "linear-gradient(135deg, #00ff88, #00bd65)",
                            color: "black",
                            border: "none",
                            borderRadius: "10px",
                            padding: "15px",
                            fontWeight: "900",
                            cursor: "pointer",
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            boxShadow: "0 5px 15px rgba(0, 255, 136, 0.2)"
                        }}
                    >
                        {isSubmitting ? "Creando Blindaje..." : "CREAR BLINDAJE AHORA"}
                    </button>
                </div>

                <h3 style={{ fontSize: "0.9rem", color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Historial de Blindajes</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {snapshots.length === 0 && <p style={{ color: "#444", fontSize: "0.9rem" }}>No hay snapshots creados.</p>}
                    {snapshots.map((s: any) => (
                        <div key={s.id} style={{ 
                            background: "rgba(0, 255, 136, 0.03)", 
                            padding: "15px", 
                            borderRadius: "12px",
                            border: "1px solid rgba(0, 255, 136, 0.1)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <div style={{ fontWeight: "700", fontSize: "0.95rem", color: "#00ff88" }}>Snapshot #{s.id.slice(-6)}</div>
                                <div style={{ fontSize: "0.8rem", color: "#888" }}>{new Date(s.createdAt).toLocaleString()}</div>
                            </div>
                            <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div>
                                    <div style={{ fontSize: "0.7rem", color: "#666", textTransform: "uppercase" }}>Estado</div>
                                    <div style={{ fontSize: "0.85rem", color: "#00ff88", fontWeight: "600" }}>SEGURO</div>
                                </div>
                                <button 
                                    onClick={() => handleRestore(s.id)}
                                    disabled={isSubmitting}
                                    style={{
                                        background: "rgba(0, 255, 136, 0.1)",
                                        color: "#00ff88",
                                        border: "1px solid rgba(0, 255, 136, 0.2)",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontSize: "0.75rem",
                                        cursor: "pointer"
                                    }}
                                >
                                    Restaurar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
