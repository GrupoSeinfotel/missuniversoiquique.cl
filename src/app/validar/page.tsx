"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaCertificate, FaCheckCircle, FaSearch, FaTimesCircle, FaCalendarAlt, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";

function ValidateContent() {
    const searchParams = useSearchParams();
    const [code, setCode] = useState(searchParams.get("codigo") || "");
    const [loading, setLoading] = useState(false);
    const [certificate, setCertificate] = useState<any>(null);
    const [error, setError] = useState("");

    const validate = async (searchCode?: string) => {
        const targetCode = searchCode || code;
        if (!targetCode) return;

        setLoading(true);
        setError("");
        setCertificate(null);

        try {
            const res = await fetch(`/api/certificates/validate?code=${targetCode.trim()}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Código inválido");
            } else {
                setCertificate(data.certificate);
            }
        } catch (err) {
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlCode = searchParams.get("codigo");
        if (urlCode) {
            setCode(urlCode);
            validate(urlCode);
        }
    }, [searchParams]);

    return (
        <div className="container" style={{ paddingTop: "140px", paddingBottom: "100px", minHeight: "80vh" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ display: "inline-block", background: "rgba(245, 36, 95, 0.1)", padding: "20px", borderRadius: "50%", marginBottom: "20px" }}
                    >
                        <FaCertificate size={48} color="#f5245f" />
                    </motion.div>
                    <h1 style={{ fontSize: "42px", fontWeight: "900", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "2px" }}>
                        VALIDAR <span className="accent-text">CERTIFICADO</span>
                    </h1>
                    <p style={{ color: "var(--text-gray)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
                        Autenticación oficial de títulos y reconocimientos de la franquicia Miss Universo Iquique.
                    </p>
                </div>

                <div style={{ position: "relative", marginBottom: "40px" }}>
                    <input
                        type="text"
                        placeholder="Ingrese el código (ej: MIQ-2026-017)"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && validate()}
                        style={{
                            width: "100%",
                            padding: "20px 30px",
                            paddingRight: "140px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "15px",
                            color: "white",
                            fontSize: "18px",
                            fontFamily: "var(--font-raleway)",
                            outline: "none",
                            transition: "all 0.3s ease"
                        }}
                    />
                    <button
                        onClick={() => validate()}
                        disabled={loading}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "10px",
                            bottom: "10px",
                            background: "var(--accent-pink)",
                            border: "none",
                            borderRadius: "10px",
                            color: "white",
                            padding: "0 25px",
                            fontWeight: "800",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        {loading ? "..." : <><FaSearch /> BUSCAR</>}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ textAlign: "center", padding: "50px" }}
                        >
                            <div style={{
                                width: "40px", height: "40px", border: "4px solid rgba(245,36,95,0.1)",
                                borderTopColor: "#f5245f", borderRadius: "50%", margin: "0 auto",
                                animation: "spin 1s linear infinite"
                            }}></div>
                        </motion.div>
                    )}

                    {error && !loading && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: "rgba(231, 76, 60, 0.1)",
                                border: "1px solid #e74c3c",
                                borderRadius: "15px",
                                padding: "30px",
                                textAlign: "center",
                                color: "#e74c3c"
                            }}
                        >
                            <FaTimesCircle size={40} style={{ marginBottom: "15px" }} />
                            <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "5px" }}>CERTIFICADO NO ENCONTRADO</h3>
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {certificate && !loading && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: "linear-gradient(145deg, #1e1f26, #16171d)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                borderRadius: "25px",
                                overflow: "hidden",
                                boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
                            }}
                        >
                            <div style={{ background: "rgba(46, 204, 113, 0.1)", padding: "15px", textAlign: "center", borderBottom: "1px solid rgba(46, 204, 113, 0.2)" }}>
                                <span style={{ color: "#2ecc71", fontWeight: "900", letterSpacing: "1px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <FaCheckCircle /> DOCUMENTO AUTÉNTICO Y VÁLIDO
                                </span>
                            </div>

                            <div className="cert-content-grid" style={{ padding: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                                <div className="cert-details">
                                    <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "25px", lineHeight: "1.2" }}>
                                        {certificate.fullName}
                                    </h2>
                                    
                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <div style={{ color: "#f5245f", width: "20px" }}><FaIdCard /></div>
                                            <div>
                                                <div style={{ fontSize: "10px", color: "var(--text-gray)", textTransform: "uppercase" }}>IDENTIFICACIÓN</div>
                                                <div style={{ fontWeight: "700" }}>{certificate.idNumber}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <div style={{ color: "#f5245f", width: "20px" }}><FaCertificate /></div>
                                            <div>
                                                <div style={{ fontSize: "10px", color: "var(--text-gray)", textTransform: "uppercase" }}>TÍTULO / DISTINCIÓN</div>
                                                <div style={{ fontWeight: "700" }}>{certificate.title}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <div style={{ color: "#f5245f", width: "20px" }}><FaCalendarAlt /></div>
                                            <div>
                                                <div style={{ fontSize: "10px", color: "var(--text-gray)", textTransform: "uppercase" }}>FECHA DE EMISIÓN</div>
                                                <div style={{ fontWeight: "700" }}>{new Date(certificate.issuedAt).toLocaleDateString("es-CL", { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                            </div>
                                        </div>

                                        {certificate.address && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                                <div style={{ color: "#f5245f", width: "20px" }}><FaMapMarkerAlt /></div>
                                                <div>
                                                    <div style={{ fontSize: "10px", color: "var(--text-gray)", textTransform: "uppercase" }}>DOMICILIO REGISTRADO</div>
                                                    <div style={{ fontWeight: "700" }}>{certificate.address}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: "40px", padding: "15px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                                        <div style={{ fontSize: "10px", color: "var(--text-gray)", marginBottom: "5px" }}>CÓDIGO DE VERIFICACIÓN</div>
                                        <div style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: "900", color: "#f5245f" }}>{certificate.code}</div>
                                    </div>
                                </div>

                                <div className="cert-image-container">
                                    <div style={{ position: "relative", borderRadius: "15px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                                        <img 
                                            src={certificate.imageUrl || "/assets/certifi5282.png"} 
                                            alt="Certificado Digital" 
                                            style={{ width: "100%", display: "block" }}
                                        />
                                        <div style={{ 
                                            position: "absolute", inset: 0, 
                                            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
                                            display: "flex", alignItems: "flex-end", padding: "20px"
                                        }}>
                                            <a 
                                                href={`/api/certificates/download/${certificate.code}`} 
                                                target="_blank" 
                                                style={{ 
                                                    background: "var(--accent-pink)",
                                                    color: "white",
                                                    padding: "10px 20px", 
                                                    fontSize: "12px", 
                                                    borderRadius: "8px",
                                                    fontWeight: "800",
                                                    textDecoration: "none",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                DESCARGAR PDF OFICIAL
                                            </a>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    .cert-content-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}

export default function ValidatePage() {
    return (
        <div className="main-wrapper">
            <HeaderExact />
            <Suspense fallback={<div style={{ paddingTop: "200px", textAlign: "center" }}>Cargando...</div>}>
                <ValidateContent />
            </Suspense>
            <FooterExact />
        </div>
    );
}
