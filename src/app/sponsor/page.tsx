"use client";
import { useState, useEffect } from "react";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";

export default function SponsorPage() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [amount, setAmount] = useState("");

    useEffect(() => {
        fetch("/api/candidates").then(r => r.json()).then(data => setCandidates(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to submit sponsor details
        const res = await fetch("/api/sponsor/register", {
            method: "POST",
            body: JSON.stringify({
                candidateId: selectedCandidate,
                businessName,
                amount: parseFloat(amount)
            }),
            headers: { "Content-Type": "application/json" }
        });
        if (res.ok) alert("Registro enviado. Pendiente de aprobación.");
    };

    return (
        <div className="main-wrapper">
            <HeaderExact />
            <main style={{ paddingTop: "150px", background: "var(--primary-bg)", minHeight: "100vh" }}>
                <div className="container" style={{ maxWidth: "600px" }}>
                    <h1 style={{ textAlign: "center", marginBottom: "40px", textTransform: "uppercase" }}>Patrocina una <span className="accent-text">Candidata</span></h1>
                    <div style={{ background: "var(--secondary-bg)", padding: "40px", border: "1px solid #333" }}>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            <div className="form-group">
                                <label style={labelStyle}>Selecciona Candidata</label>
                                <select
                                    style={inputStyle}
                                    value={selectedCandidate}
                                    onChange={e => setSelectedCandidate(e.target.value)}
                                    required
                                >
                                    <option value="">-- Elige una candidata --</option>
                                    {candidates.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Nombre de tu Empresa/Pyme</label>
                                <input type="text" style={inputStyle} value={businessName} onChange={e => setBusinessName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label style={labelStyle}>Monto del Patrocinio (CLP)</label>
                                <input type="number" style={inputStyle} value={amount} onChange={e => setAmount(e.target.value)} required />
                            </div>
                            <div style={{ background: "#111", padding: "20px", border: "1px solid var(--accent-pink)", fontSize: "12px", color: "var(--text-gray)" }}>
                                <strong>Datos de Transferencia:</strong><br />
                                Banco: Santander<br />
                                Cuenta: 12345678<br />
                                RUT: 12.345.678-9<br />
                                Email: nelson@missuniversoiquique.cl
                            </div>
                            <button type="submit" className="btn-primary">ENVIAR COMPROBANTE</button>
                        </form>
                    </div>
                </div>
            </main>
            <FooterExact />
        </div>
    );
}

const labelStyle = { display: "block", marginBottom: "8px", fontSize: "12px", color: "var(--accent-pink)", textTransform: "uppercase" } as const;
const inputStyle = { width: "100%", padding: "12px", background: "var(--primary-bg)", border: "1px solid #333", color: "white" };
