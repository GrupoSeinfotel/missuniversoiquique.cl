"use client";
import { useState } from "react";
import { FaSave, FaCamera, FaUser, FaRuler, FaShareAlt, FaInstagram, FaWhatsapp, FaTiktok, FaFacebook, FaVideo, FaSpinner, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import "./CandidateProfileEditor.css";

interface CandidateProfileProps {
    candidate: any;
}

export default function CandidateProfileEditor({ candidate }: CandidateProfileProps) {
    const [formData, setFormData] = useState({
        ...candidate,
        eyeColor: candidate.eyeColor || "",
        hairColor: candidate.hairColor || "",
        education: candidate.education || "",
        occupation: candidate.occupation || "",
        hobbies: candidate.hobbies || "",
        tiktok: candidate.tiktok || "",
        facebook: candidate.facebook || "",
        instagram: candidate.instagram || "",
        whatsapp: candidate.whatsapp || "",
        videoPitchUrl: candidate.videoPitchUrl || "",
    });

    const [loading, setLoading] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [success, setSuccess] = useState(false);
    const [photos, setPhotos] = useState<any[]>(candidate.photos || []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSetMainPhoto = async (photoId: string) => {
        try {
            const res = await fetch("/api/candidate/photo/set-main", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photoId })
            });

            if (res.ok) {
                // Update local state
                setPhotos(prev => prev.map(p => ({
                    ...p,
                    isMain: p.id === photoId
                })));
            } else {
                alert("Error al seleccionar foto principal");
            }
        } catch (error) {
            console.error("Error setting main photo", error);
        }
    };

    const handleDeletePhoto = async (e: React.MouseEvent, photoId: string) => {
        e.stopPropagation(); // Prevent setting as main
        if (!confirm("¿Estás segura de que deseas borrar esta foto?")) return;

        try {
            const res = await fetch("/api/candidate/photo/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photoId })
            });

            if (res.ok) {
                setPhotos(prev => prev.filter(p => p.id !== photoId));
            } else {
                const data = await res.json();
                alert(data.error || "Error al borrar la foto");
            }
        } catch (error) {
            console.error("Delete photo failed", error);
            alert("Error de conexión");
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            alert(`El archivo es demasiado grande. Máximo permitido: 100MB`);
            return;
        }

        setUploadingVideo(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("type", "video");

        try {
            const res = await fetch("/api/casting/upload", {
                method: "POST",
                body: uploadData,
            });

            if (res.ok) {
                const data = await res.json();
                setFormData((prev: any) => ({ ...prev, videoPitchUrl: data.url }));
                alert("Video subido correctamente. Recuerda presionar 'Guardar Cambios'.");
            } else {
                const error = await res.json().catch(() => ({ error: `Status ${res.status}` }));
                alert(`Error al subir archivo: ${error.error || res.statusText}`);
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión al subir el video");
        }
        setUploadingVideo(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        if (!formData.whatsapp) {
            alert("⚠️ El WhatsApp es obligatorio para contacto interno con la organización.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/candidate/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert("Error al actualizar perfil");
            }
        } catch (error) {
            console.error("Update failed", error);
            alert("Error de conexión");
        }
        setLoading(false);
    };

    return (
        <div className="editor-container">
            <form onSubmit={handleSubmit} className="editor-form">

                {/* BIO SECTION */}
                <motion.div
                    className="editor-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="section-header">
                        <FaUser className="section-icon" />
                        <h3 className="section-title">Sobre Ti</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label className="form-label">Biografía (Tu historia)</label>
                            <textarea
                                name="bio"
                                value={formData.bio || ""}
                                onChange={handleChange}
                                className="form-textarea"
                                placeholder="Cuéntanos quién eres, tus sueños y motivaciones..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Ocupación / Profesión</label>
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ej: Estudiante de Derecho"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Educación</label>
                            <input
                                type="text"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ej: Universidad de Tarapacá"
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label className="form-label">Hobbies / Pasatiempos</label>
                            <input
                                type="text"
                                name="hobbies"
                                value={formData.hobbies}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Ej: Leer, Bailar, Trekking, Fotografía..."
                            />
                        </div>
                    </div>
                </motion.div>

                {/* VIDEO PITCH SECTION */}
                <motion.div
                    className={`editor-section ${candidate.points < 2000 ? 'is-locked' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{ 
                        borderLeft: candidate.points >= 2000 ? "4px solid #dfc06d" : "4px solid #333",
                        opacity: candidate.points < 2000 ? 0.7 : 1
                    }}
                >
                    <div className="section-header">
                        <FaVideo className="section-icon" style={{ color: candidate.points >= 2000 ? "#dfc06d" : "#555" }} />
                        <h3 className="section-title" style={{ color: candidate.points >= 2000 ? "#dfc06d" : "#888" }}>
                            Video de Presentación VIP {candidate.points < 2000 && "🔒"}
                        </h3>
                    </div>

                    {candidate.points >= 2000 ? (
                        <>
                            <p style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "20px" }}>
                                ¡Felicidades! Al superar los 2000 puntos en el ranking, has desbloqueado la opción de modificar tu video Pitch oficial.
                            </p>

                            <div className="form-group">
                                <label className="form-label">Sube o actualiza tu video (Máx. 100MB)</label>
                                
                                {formData.videoPitchUrl ? (
                                    <div style={{ marginBottom: "15px", borderRadius: "8px", overflow: "hidden", border: "1px solid #333" }}>
                                        <video 
                                            src={formData.videoPitchUrl} 
                                            controls 
                                            style={{ width: "100%", maxHeight: "300px", objectFit: "contain", background: "#000" }} 
                                        />
                                    </div>
                                ) : null}

                                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                                    <input
                                        type="file"
                                        accept="video/mp4,video/quicktime,video/x-msvideo"
                                        onChange={handleVideoUpload}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            opacity: 0,
                                            cursor: "pointer"
                                        }}
                                        disabled={uploadingVideo}
                                    />
                                    <div style={{
                                        background: "#222",
                                        border: "2px dashed #444",
                                        borderRadius: "8px",
                                        padding: "20px",
                                        textAlign: "center",
                                        color: uploadingVideo ? "#dfc06d" : "white",
                                        transition: "all 0.3s"
                                    }}>
                                        {uploadingVideo ? (
                                            <><FaSpinner className="spin-icon" style={{ marginRight: "10px" }} /> Subiendo Video...</>
                                        ) : (
                                            <><FaVideo style={{ marginRight: "10px" }} /> {formData.videoPitchUrl ? "Cambiar Video" : "Subir Video"}</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ 
                            background: "rgba(0,0,0,0.3)", 
                            padding: "20px", 
                            borderRadius: "10px", 
                            textAlign: "center",
                            border: "1px solid #222"
                        }}>
                            <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>🔒</div>
                            <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>
                                Esta función se desbloquea al alcanzar los <strong style={{ color: "#dfc06d" }}>2.000 puntos</strong> en el ranking general.
                            </p>
                            <div style={{ fontSize: "11px", color: "#444", marginTop: "10px" }}>
                                Tu puntaje actual: <span style={{ color: "var(--accent-pink)" }}>{candidate.points.toLocaleString()}</span> puntos.
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* VISUAL & PHYSICAL */}
                <motion.div
                    className="editor-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="section-header">
                        <FaRuler className="section-icon" />
                        <h3 className="section-title">Características Físicas</h3>
                    </div>

                    <div className="form-grid three-cols">
                        <div className="form-group">
                            <label className="form-label">Color de Cabello</label>
                            <input type="text" name="hairColor" value={formData.hairColor} onChange={handleChange} className="form-input" placeholder="Ej: Castaño Claro" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Color de Ojos</label>
                            <input type="text" name="eyeColor" value={formData.eyeColor} onChange={handleChange} className="form-input" placeholder="Ej: Verdes" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estatura (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} className="form-input" placeholder="Ej: 170" />
                        </div>
                    </div>

                    <h4 className="form-label" style={{ marginTop: "30px", marginBottom: "15px", color: "var(--accent-pink)", fontSize: "0.9rem" }}>MEDIDAS (cm)</h4>
                    <div className="form-grid three-cols">
                        <div className="form-group">
                            <label className="form-label">Busto</label>
                            <input type="number" name="bust" value={formData.bust || ""} onChange={handleChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cintura</label>
                            <input type="number" name="waist" value={formData.waist || ""} onChange={handleChange} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Caderas</label>
                            <input type="number" name="hips" value={formData.hips || ""} onChange={handleChange} className="form-input" />
                        </div>
                    </div>
                </motion.div>

                {/* PHOTOS SECTION */}
                <motion.div
                    className="editor-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="section-header">
                        <FaCamera className="section-icon" />
                        <h3 className="section-title">Fotos de Perfil</h3>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ color: "var(--accent-pink)" }}>★</span> Selecciona la foto principal que aparecerá en la portada.
                    </p>

                    <div className="photos-grid">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className={`photo-card ${photo.isMain ? 'is-main' : ''}`}
                                onClick={() => handleSetMainPhoto(photo.id)}
                            >
                                <img src={photo.url} alt="Candidata" />
                                {photo.isMain && (
                                    <div className="main-badge">★</div>
                                )}
                                {!photo.isMain && (
                                    <div className="photo-overlay">
                                        <span className="set-main-btn">Usar Portada</span>
                                    </div>
                                )}
                                {!photo.isMain && candidate.points >= 2000 && (
                                    <button 
                                        type="button"
                                        className="delete-photo-btn"
                                        onClick={(e) => handleDeletePhoto(e, photo.id)}
                                        title="Borrar Foto"
                                    >
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* SOCIALS */}
                <motion.div
                    className="editor-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="section-header">
                        <FaShareAlt className="section-icon" />
                        <h3 className="section-title">Redes Sociales</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label"><FaInstagram style={{ marginRight: 5 }} /> Instagram (Usuario)</label>
                            <input type="text" name="instagram" value={formData.instagram || ""} onChange={handleChange} className="form-input" placeholder="Ej: marian.model" />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><FaTiktok style={{ marginRight: 5 }} /> TikTok (Usuario)</label>
                            <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} className="form-input" placeholder="Ej: marian.tiktok" />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><FaFacebook style={{ marginRight: 5 }} /> Facebook (Link)</label>
                            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="form-input" placeholder="https://facebook.com/..." />
                        </div>
                        <div className="form-group">
                            <label className="form-label"><FaWhatsapp style={{ marginRight: 5 }} /> WhatsApp <span style={{ color: "#ff4444" }}>*</span></label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp || ""}
                                onChange={handleChange}
                                className="form-input"
                                style={{
                                    borderColor: !formData.whatsapp ? "#ff4444" : undefined
                                }}
                                placeholder="+569... (Privado: Solo Organización)"
                            />
                        </div>
                    </div>
                </motion.div>

                <motion.button
                    type="submit"
                    disabled={loading}
                    className={`submit-btn ${success ? 'success' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? "Guardando..." : (success ? "¡Guardado con Éxito!" : <><FaSave /> GUARDAR CAMBIOS</>)}
                </motion.button>
            </form>
        </div>
    );
}
