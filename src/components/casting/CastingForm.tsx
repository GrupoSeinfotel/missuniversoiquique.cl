"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CastingForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        height: "",
        instagram: "",
        bio: "",
        videoPitch: "",
        signed: false
    });

    const [photos, setPhotos] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);

    const handleFileUpload = async (type: string, file: File) => {
        setUploading(type);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        const res = await fetch("/api/casting/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            const data = await res.json();
            setPhotos(prev => ({ ...prev, [type]: data.url }));
        } else {
            alert("Error al subir imagen");
        }
        setUploading(null);
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        // Front-end validation
        if (!formData.fullName || !formData.birthDate || !formData.height) {
            alert("Por favor completa todos los datos personales.");
            return;
        }

        const requiredPhotos = ['FACE', 'PROFILE', 'FULL_BODY', 'EDITORIAL'];
        const missingPhotos = requiredPhotos.filter(type => !photos[type]);

        if (missingPhotos.length > 0) {
            alert("Por favor sube todas las fotos requeridas antes de enviar.");
            return;
        }

        const res = await fetch("/api/casting/apply", {
            method: "POST",
            body: JSON.stringify({ ...formData, photos }),
            headers: { "Content-Type": "application/json" }
        });

        if (res.ok) {
            window.location.href = "/dashboard";
        } else {
            const data = await res.json();
            alert(data.error || "Error al enviar postulación");
        }
    };

    const steps = [
        { title: "Información Personal", subtitle: "Queremos conocerte" },
        { title: "Galería de Impacto", subtitle: "Tus mejores ángulos" },
        { title: "Tu Voz", subtitle: "Video Pitch" },
        { title: "Legal", subtitle: "Bases y Condiciones" }
    ];

    return (
        <div style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "40px",
            background: "var(--secondary-bg)",
            border: "1px solid rgba(255,255,255,0.05)",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    {steps.map((_, i) => (
                        <div key={i} style={{
                            width: "22%",
                            height: "4px",
                            background: i + 1 <= step ? "var(--accent-pink)" : "rgba(255,255,255,0.1)",
                            transition: "all 0.3s ease"
                        }} />
                    ))}
                </div>
                <h4 className="accent-text" style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px" }}>Paso {step} de 4</h4>
                <h2 style={{ fontSize: "2rem", textTransform: "uppercase" }}>{steps[step - 1].title}</h2>
                <p style={{ color: "var(--text-gray)" }}>{steps[step - 1].subtitle}</p>
            </div>

            <div style={{ flex: 1 }}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div className="form-group">
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Nombre Completo</label>
                                    <input
                                        type="text"
                                        style={inputStyle}
                                        placeholder="Ej: Maria Ignacia Lopez"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <div className="form-group">
                                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            style={inputStyle}
                                            value={formData.birthDate}
                                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Estatura (cm)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="175"
                                            value={formData.height}
                                            onChange={e => setFormData({ ...formData, height: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Instagram</label>
                                    <input
                                        type="text"
                                        style={inputStyle}
                                        placeholder="@usuario"
                                        value={formData.instagram}
                                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                {[
                                    { label: 'Rostro', type: 'FACE' },
                                    { label: 'Perfil', type: 'PROFILE' },
                                    { label: 'Cuerpo Completo', type: 'FULL_BODY' },
                                    { label: 'Editorial', type: 'EDITORIAL' }
                                ].map((item) => (
                                    <div key={item.type} style={{
                                        position: "relative",
                                        height: "150px",
                                        border: photos[item.type] ? "2px solid var(--accent-pink)" : "2px dashed rgba(255,255,255,0.1)",
                                        background: photos[item.type] ? `url(${photos[item.type]}) center/cover` : "transparent",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease"
                                    }}>
                                        {!photos[item.type] && (
                                            <>
                                                <span style={{ fontSize: "12px", textTransform: "uppercase" }}>{item.label}</span>
                                                <span style={{ fontSize: "20px", marginTop: "10px" }}>{uploading === item.type ? "..." : "+"}</span>
                                            </>
                                        )}
                                        {photos[item.type] && (
                                            <div style={{ background: "rgba(0,0,0,0.5)", width: "100%", textAlign: "center", color: "white", fontSize: "10px" }}>
                                                LISTO
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(item.type, e.target.files[0])}
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: "20px", fontSize: "12px", color: "var(--text-gray)" }}>* Sube fotos en alta resolución (Máx 10MB por foto).</p>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}>Link Video Pitch (YouTube/Vimeo)</label>
                            <input
                                type="text"
                                style={inputStyle}
                                placeholder="https://youtube.com/watch?v=..."
                                value={formData.videoPitch}
                                onChange={e => setFormData({ ...formData, videoPitch: e.target.value })}
                            />
                            <p style={{ marginTop: "20px", color: "var(--text-gray)", lineHeight: "1.6" }}>
                                Graba un video de máximo 1 minuto presentándote y contándonos por qué quieres ser la próxima Miss Universe Iquique.
                            </p>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{
                                height: "200px",
                                overflowY: "scroll",
                                background: "var(--primary-bg)",
                                padding: "20px",
                                fontSize: "12px",
                                color: "var(--text-gray)",
                                marginBottom: "20px",
                                border: "1px solid rgba(255,255,255,0.05)"
                            }}>
                                Al postular acepto que mis imágenes sean utilizadas para fines promocionales del certamen... (Bases legales completas)
                            </div>
                            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                                <input type="checkbox" checked={formData.signed} onChange={(e) => setFormData({ ...formData, signed: e.target.checked })} />
                                <span>Acepto todas las bases y condiciones</span>
                            </label>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                {step > 1 ? (
                    <button onClick={prevStep} style={{
                        background: "transparent",
                        color: "var(--text-white)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "10px 30px",
                        cursor: "pointer"
                    }}>ATRÁS</button>
                ) : <div />}

                {step < 4 ? (
                    <button onClick={nextStep} className="btn-primary">CONTINUAR</button>
                ) : (
                    <button onClick={handleSubmit} className="btn-primary" style={{ padding: "10px 40px" }} disabled={!formData.signed}>
                        ENVIAR POSTULACIÓN
                    </button>
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "15px",
    background: "var(--primary-bg)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
    transition: "all 0.3s ease"
};
