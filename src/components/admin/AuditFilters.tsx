"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { FaSearch, FaFilter, FaDownload } from "react-icons/fa";

export default function AuditFilters({ candidates }: { candidates: { id: string, fullName: string }[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [ip, setIp] = useState(searchParams.get("ip") || "");
    const [candidateId, setCandidateId] = useState(searchParams.get("candidateId") || "");
    const [type, setType] = useState(searchParams.get("type") || "");

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (ip) params.set("ip", ip);
        if (candidateId) params.set("candidateId", candidateId);
        if (type) params.set("type", type);

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleClear = () => {
        setIp("");
        setCandidateId("");
        setType("");
        router.push("?");
    };

    const handleExport = () => {
        window.print();
    };

    return (
        <div style={{
            background: "#161616",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            border: "1px solid #333",
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            alignItems: "flex-end"
        }}>
            <div style={{ flex: "1", minWidth: "200px" }}>
                <label style={labelStyle}>Filtrar por IP</label>
                <div style={{ position: "relative" }}>
                    <FaSearch style={iconStyle} />
                    <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="Ej: 192.168..."
                        style={inputStyle}
                    />
                </div>
            </div>

            <div style={{ flex: "1", minWidth: "200px" }}>
                <label style={labelStyle}>Candidata</label>
                <select
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Todas las Candidatas</option>
                    {candidates.map(c => (
                        <option key={c.id} value={c.id}>{c.fullName}</option>
                    ))}
                </select>
            </div>

            <div style={{ flex: "1", minWidth: "200px" }}>
                <label style={labelStyle}>Tipo de Voto</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={inputStyle}
                >
                    <option value="">Cualquier Tipo</option>
                    <option value="FREE">FREE (Gratuito)</option>
                    <option value="PAID">PREMIUM (Pagado)</option>
                </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={handleFilter}
                    disabled={isPending}
                    style={{ ...btnStyle, background: "#C8FF0B", color: "black" }}
                >
                    <FaFilter /> {isPending ? "Filtrando..." : "Aplicar"}
                </button>
                <button
                    onClick={handleClear}
                    style={{ ...btnStyle, background: "#333", color: "white" }}
                >
                    Limpiar
                </button>
                <button
                    onClick={handleExport}
                    style={{ ...btnStyle, background: "#0070f3", color: "white" }}
                >
                    <FaDownload /> Exportar PDF
                </button>
            </div>
        </div>
    );
}

const labelStyle = { display: "block", fontSize: "11px", color: "#888", marginBottom: "8px", textTransform: "uppercase", fontWeight: "900", letterSpacing: "1px" } as const;
const inputStyle = { width: "100%", background: "#0c0c0c", border: "1px solid #333", borderRadius: "8px", padding: "10px 10px 10px 35px", color: "white", fontSize: "13px" } as const;
const iconStyle = { position: "absolute", left: "12px", top: "12px", color: "#555" } as const;
const btnStyle = { padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" } as const;
