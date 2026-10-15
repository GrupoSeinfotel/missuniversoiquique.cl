"use client";
import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaSave, FaUser, FaRuler, FaShareAlt, FaInstagram, FaTiktok, FaFacebook, FaCamera, FaWhatsapp, FaExternalLinkAlt, FaTrophy, FaStar, FaTasks, FaHandshake, FaLink, FaLock } from "react-icons/fa";
import ProfileShareKit from "./ProfileShareKit";
import { getLevelData, isFeatureUnlocked } from "@/lib/gamification";
import LevelBadge from "./LevelBadge";
import GamificationRoadmap from "./GamificationRoadmap";


interface ProfileViewProps {
    candidate: any;
    cityName: string;
    candidateSlug?: string;
}

export default function ProfileView({ candidate, cityName, candidateSlug }: ProfileViewProps) {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        bio: candidate.bio || "",
        occupation: candidate.occupation || "",
        education: candidate.education || "",
        hobbies: candidate.hobbies || "",
        hairColor: candidate.hairColor || "",
        eyeColor: candidate.eyeColor || "",
        height: candidate.height || "",
        bust: candidate.bust || "",
        waist: candidate.waist || "",
        hips: candidate.hips || "",
        instagram: candidate.instagram || "",
        tiktok: candidate.tiktok || "",
        facebook: candidate.facebook || "",
        whatsapp: candidate.whatsapp || "",
        slug: candidateSlug || "",
        videoPitchUrl: candidate.videoPitchUrl || "",
    });
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [photos, setPhotos] = useState<any[]>(candidate.photos || []);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const mainPhoto = photos.find(p => p.isMain) || photos[0];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSetMainPhoto = async (photoId: string) => {
        try {
            const res = await fetch("/api/candidate/photo/set-main", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photoId }),
            });
            if (res.ok) {
                setPhotos(prev => prev.map(p => ({ ...p, isMain: p.id === photoId })));
            }
        } catch (e) { console.error(e); }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!confirm("¿Estás segura de que quieres eliminar esta foto?")) return;
        try {
            const res = await fetch("/api/candidate/photo/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photoId }),
            });
            if (res.ok) {
                setPhotos(prev => prev.filter(p => p.id !== photoId));
            } else {
                const data = await res.json();
                alert(data.error || "Error al eliminar foto");
            }
        } catch { alert("Error de conexión"); }
    };

    const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        setLoading(true);
        try {
            const res = await fetch("/api/candidate/photo/upload", {
                method: "POST",
                body: formDataUpload,
            });
            if (res.ok) {
                const data = await res.json();
                setPhotos(prev => [...prev, data.photo]);
            } else {
                const data = await res.json();
                alert(data.error || "Error al subir foto");
            }
        } catch { alert("Error de conexión"); }
        setLoading(false);
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.whatsapp) {
            alert("⚠️ El WhatsApp es obligatorio para contacto interno.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/candidate/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => { setSuccess(false); setEditMode(false); }, 2000);
            } else { 
                const data = await res.json();
                alert(data.error || "Error al guardar cambios"); 
            }
        } catch { alert("Error de conexión"); }
        setLoading(false);
    };

    const statusLabel = candidate.status === "APPROVED" ? "APPROVED"
        : candidate.status === "REVIEW" ? "REVIEW" : "PENDING";
    const statusText = candidate.status === "APPROVED" ? "✓ Aprobada"
        : candidate.status === "REVIEW" ? "🔍 En Revisión" : "⏳ Pendiente";

    const totalPoints = candidate.points || 0;
    const isEditProfileUnlocked = isFeatureUnlocked(totalPoints, "Bio sin límites");
    const isSlugUnlocked = isFeatureUnlocked(totalPoints, "URL Personalizada (Slug)");
    const isMainPhotoUnlocked = isFeatureUnlocked(totalPoints, "Elección de Portada");
    const isFullEditUnlocked = isFeatureUnlocked(totalPoints, "Editar Perfil Completo");
    const canManageGallery = isFeatureUnlocked(totalPoints, "Gestión de Galería");


    return (
        <div>
            {/* ── HERO ── */}
            <div className="profile-hero">
                <div className="profile-hero-bg" />

                {mainPhoto ? (
                    <img src={mainPhoto.url} alt={candidate.fullName} className="profile-hero-photo" />
                ) : (
                    <div className="profile-hero-placeholder">👸</div>
                )}

                <div className="profile-hero-info">
                    <div className="profile-hero-number">
                        Miss Universe {cityName} 2026
                    </div>
                    <h1 className="profile-hero-name">{candidate.fullName}</h1>
                    <div className="profile-hero-city">{candidate.city || cityName}</div>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
                        <span className={`profile-status-badge ${statusLabel}`}>{statusText}</span>
                        <LevelBadge points={totalPoints} showName={true} />
                    </div>
                    <div className="profile-hero-actions">
                        <button
                            className="btn-edit-profile"
                            onClick={() => {
                                if (!isEditProfileUnlocked && !editMode) return;
                                setEditMode(!editMode);
                            }}
                            style={{
                                opacity: !isEditProfileUnlocked && !editMode ? 0.6 : 1,
                                cursor: !isEditProfileUnlocked && !editMode ? "not-allowed" : "pointer"
                            }}
                        >
                            {editMode ? <><FaEye /> Ver Perfil</> : (
                                <>
                                    {!isEditProfileUnlocked && <FaLock style={{ marginRight: "8px" }} />}
                                    <FaEdit /> Editar Perfil
                                </>
                            )}
                        </button>
                        {!isEditProfileUnlocked && !editMode && (
                            <span style={{ fontSize: "0.65rem", color: "var(--accent-pink)", marginLeft: "10px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <FaLock size={10} /> Editar requiere 200 pts
                            </span>
                        )}
                        {candidateSlug && (
                            <a
                                href={`/candidata/${candidateSlug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-view-public"
                            >
                                <FaExternalLinkAlt /> Ver Página Pública
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* ── STATS ── */}
            <div className="profile-stats-row">
                <div className="profile-stat-card">
                    <div className="profile-stat-label">🗳️ Total Ranking</div>
                    <div className="profile-stat-value accent">{totalPoints.toLocaleString()}</div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-label">🎯 Pts. Misiones</div>
                    <div className="profile-stat-value">{(candidate.taskPoints || 0).toLocaleString()}</div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-label">🤝 Sponsors</div>
                    <div className="profile-stat-value">{(candidate.sponsors?.length || 0)}</div>
                </div>
                <div className="profile-stat-card">
                    <div className="profile-stat-label">📸 Fotos</div>
                    <div className="profile-stat-value">{photos.length}</div>
                </div>
            </div>

            {/* ── VIEW MODE ── */}
            {!editMode && (
                <>
                    {candidateSlug && (
                        <div style={{ marginBottom: "24px" }}>
                            <ProfileShareKit candidateSlug={candidateSlug} />
                        </div>
                    )}

                    <GamificationRoadmap currentPoints={totalPoints} />

                    <div className="profile-grid">
                        {/* Bio */}
                        <div className="profile-card profile-card-full">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaUser /></div>
                                <span className="profile-card-title">Sobre Mí</span>
                            </div>
                            {candidate.bio ? (
                                <p style={{ fontSize: "0.9rem", color: "#ccc", lineHeight: "1.7" }}>{candidate.bio}</p>
                            ) : (
                                <p style={{ fontSize: "0.85rem", color: "#444", fontStyle: "italic" }}>
                                    Aún no has agregado una biografía. Haz clic en "Editar Perfil" para completarla.
                                </p>
                            )}
                            {(candidate.occupation || candidate.education || candidate.hobbies) && (
                                <div style={{ display: "flex", gap: "20px", marginTop: "16px", flexWrap: "wrap" }}>
                                    {candidate.occupation && (
                                        <div style={{ fontSize: "0.8rem" }}>
                                            <span style={{ color: "#555", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "3px" }}>Ocupación</span>
                                            <span style={{ color: "#ddd" }}>{candidate.occupation}</span>
                                        </div>
                                    )}
                                    {candidate.education && (
                                        <div style={{ fontSize: "0.8rem" }}>
                                            <span style={{ color: "#555", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "3px" }}>Educación</span>
                                            <span style={{ color: "#ddd" }}>{candidate.education}</span>
                                        </div>
                                    )}
                                    {candidate.hobbies && (
                                        <div style={{ fontSize: "0.8rem" }}>
                                            <span style={{ color: "#555", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "3px" }}>Hobbies</span>
                                            <span style={{ color: "#ddd" }}>{candidate.hobbies}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Físico */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaRuler /></div>
                                <span className="profile-card-title">Características</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[
                                    { label: "Estatura", value: candidate.height ? `${candidate.height} cm` : null },
                                    { label: "Color Cabello", value: candidate.hairColor || null },
                                    { label: "Color Ojos", value: candidate.eyeColor || null },
                                    { label: "Busto / Cintura / Cadera", value: (candidate.bust && candidate.waist && candidate.hips) ? `${candidate.bust} / ${candidate.waist} / ${candidate.hips}` : null },
                                ].map(({ label, value }) => value ? (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "10px" }}>
                                        <span style={{ fontSize: "0.75rem", color: "#555", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
                                        <span style={{ fontSize: "0.85rem", color: "#ddd", fontWeight: 600 }}>{value}</span>
                                    </div>
                                ) : null)}
                            </div>
                        </div>

                        {/* Redes */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaShareAlt /></div>
                                <span className="profile-card-title">Redes Sociales</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {candidate.instagram && (
                                    <a href={`https://instagram.com/${candidate.instagram}`} target="_blank" rel="noopener noreferrer"
                                        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#ddd", fontSize: "0.85rem" }}>
                                        <span className="pf-social-icon instagram" style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><FaInstagram /></span>
                                        @{candidate.instagram}
                                    </a>
                                )}
                                {candidate.tiktok && (
                                    <a href={`https://tiktok.com/@${candidate.tiktok}`} target="_blank" rel="noopener noreferrer"
                                        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#ddd", fontSize: "0.85rem" }}>
                                        <span className="pf-social-icon tiktok" style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><FaTiktok /></span>
                                        @{candidate.tiktok}
                                    </a>
                                )}
                                {candidate.facebook && (
                                    <a href={candidate.facebook} target="_blank" rel="noopener noreferrer"
                                        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#ddd", fontSize: "0.85rem" }}>
                                        <span className="pf-social-icon facebook" style={{ width: 30, height: 30, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><FaFacebook /></span>
                                        Facebook
                                    </a>
                                )}
                                {!candidate.instagram && !candidate.tiktok && !candidate.facebook && (
                                    <p style={{ fontSize: "0.8rem", color: "#444", fontStyle: "italic" }}>Agrega tus redes en "Editar Perfil".</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Video Pitch - View Mode */}
                    <div className="profile-card profile-card-full" style={{ marginBottom: "16px" }}>
                        <div className="profile-card-header">
                            <div className="profile-card-icon"><FaTasks /></div>
                            <span className="profile-card-title">Video de Presentación VIP</span>
                            {totalPoints < 2000 && (
                                <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--accent-pink)", display: "flex", alignItems: "center", gap: "5px" }}>
                                    <FaLock size={10} /> Requiere 2,000 pts
                                </span>
                            )}
                        </div>
                        {candidate.videoPitchUrl ? (
                            <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #1a1a1a", background: "#000" }}>
                                <video src={candidate.videoPitchUrl} controls style={{ width: "100%", maxHeight: "350px" }} />
                            </div>
                        ) : (
                            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #222", borderRadius: 12, color: "#444" }}>
                                {totalPoints >= 2000 ? "Aún no has subido tu video pitch. Haz clic en 'Editar Perfil' para subirlo." : "Esta función se desbloquea al alcanzar 2,000 puntos."}
                            </div>
                        )}
                    </div>

                    {/* Galería */}
                    <div className="profile-card" style={{ marginBottom: "16px" }}>
                        <div className="profile-card-header">
                            <div className="profile-card-icon"><FaCamera /></div>
                            <span className="profile-card-title">Galería de Casting</span>
                            <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: isMainPhotoUnlocked ? "#444" : "var(--accent-pink)", display: "flex", alignItems: "center", gap: "5px" }}>
                                {isMainPhotoUnlocked ? "Haz clic en una foto para usarla como portada" : <><FaLock size={10} /> Portada requiere 900 pts</>}
                            </span>
                        </div>
                        <div className="profile-photos-grid">
                            {photos.map(photo => (
                                <div
                                    key={photo.id}
                                    className={`profile-photo-item ${photo.isMain ? "is-main" : ""} ${!isMainPhotoUnlocked ? "locked" : ""}`}
                                    style={{ position: "relative" }}
                                >
                                    <div onClick={() => isMainPhotoUnlocked && handleSetMainPhoto(photo.id)}>
                                        <img src={photo.url} alt="Candidata" />
                                        {photo.isMain && <div className="profile-photo-main-badge">★ Portada</div>}
                                        {!photo.isMain && isMainPhotoUnlocked && (
                                            <div className="profile-photo-hover">
                                                <span>Usar Portada</span>
                                            </div>
                                        )}
                                        {!photo.isMain && !isMainPhotoUnlocked && (
                                            <div className="profile-photo-locked">
                                                <FaLock />
                                            </div>
                                        )}
                                    </div>

                                    {canManageGallery && !photo.isMain && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePhoto(photo.id);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "5px",
                                                right: "5px",
                                                background: "rgba(255,0,0,0.7)",
                                                border: "none",
                                                color: "white",
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                fontSize: "10px",
                                                zIndex: 10,
                                                padding: 0
                                            }}
                                            title="Eliminar foto"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}

                            {canManageGallery && (
                                <div className="profile-photo-item add-photo" style={{
                                    border: "2px dashed #333",
                                    background: "rgba(0,0,0,0.2)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                    minHeight: "150px",
                                    cursor: "pointer",
                                    position: "relative"
                                }}>
                                    <FaCamera size={24} style={{ opacity: 0.3 }} />
                                    <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>Subir Foto</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUploadPhoto}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            opacity: 0,
                                            cursor: "pointer"
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {photos.length === 0 && !canManageGallery && (
                            <div style={{ padding: "40px", textAlign: "center", border: "1px dashed #222", borderRadius: 10, color: "#444" }}>
                                No hay fotos de casting aún.
                            </div>
                        )}

                        {canManageGallery && (
                            <p style={{ fontSize: "0.65rem", color: "#444", marginTop: "10px" }}>
                                ✨ ¡Tienes control total! Puedes subir fotos nuevas y borrar las que no te gusten (excepto la de portada).
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* ── EDIT MODE ── */}
            {editMode && (
                <form onSubmit={handleSave}>
                    <div className="profile-grid">
                        {/* Bio */}
                        <div className="profile-card profile-card-full">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaUser /></div>
                                <span className="profile-card-title">Sobre Ti</span>
                            </div>
                            <div className="pf-form-grid">
                                <div className="pf-group full">
                                    <label className="pf-label">Biografía (tu historia)</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="pf-textarea"
                                        placeholder="Cuéntanos quién eres, tus sueños y motivaciones..."
                                        rows={4}
                                    />
                                </div>
                                <div className="pf-group">
                                    <label className="pf-label">Ocupación / Profesión</label>
                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="pf-input" placeholder="Ej: Estudiante de Derecho" />
                                </div>
                                <div className="pf-group">
                                    <label className="pf-label">Educación</label>
                                    <input type="text" name="education" value={formData.education} onChange={handleChange} className="pf-input" placeholder="Ej: Universidad de Tarapacá" />
                                </div>
                                <div className="pf-group full">
                                    <label className="pf-label">Hobbies / Pasatiempos</label>
                                    <input type="text" name="hobbies" value={formData.hobbies} onChange={handleChange} className="pf-input" placeholder="Ej: Leer, Bailar, Fotografía..." />
                                </div>
                            </div>
                        </div>

                        {/* Físico */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaRuler /></div>
                                <span className="profile-card-title">Características Físicas</span>
                            </div>
                            <div className="pf-form-grid">
                                <div className="pf-group">
                                    <label className="pf-label">Color de Cabello</label>
                                    <input type="text" name="hairColor" value={formData.hairColor} onChange={handleChange} className="pf-input" placeholder="Ej: Castaño" />
                                </div>
                                <div className="pf-group">
                                    <label className="pf-label">Color de Ojos</label>
                                    <input type="text" name="eyeColor" value={formData.eyeColor} onChange={handleChange} className="pf-input" placeholder="Ej: Verdes" />
                                </div>
                                <div className="pf-group full">
                                    <label className="pf-label">Estatura (cm)</label>
                                    <input type="number" name="height" value={formData.height} onChange={handleChange} className="pf-input" placeholder="170" />
                                </div>
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <div className="pf-label" style={{ marginBottom: 10, color: "var(--dash-accent)" }}>MEDIDAS (cm)</div>
                                <div className="pf-form-grid-3">
                                    <div className="pf-group">
                                        <label className="pf-label">Busto</label>
                                        <input type="number" name="bust" value={formData.bust} onChange={handleChange} className="pf-input" />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label">Cintura</label>
                                        <input type="number" name="waist" value={formData.waist} onChange={handleChange} className="pf-input" />
                                    </div>
                                    <div className="pf-group">
                                        <label className="pf-label">Caderas</label>
                                        <input type="number" name="hips" value={formData.hips} onChange={handleChange} className="pf-input" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Redes */}
                        <div className="profile-card">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaShareAlt /></div>
                                <span className="profile-card-title">Redes Sociales</span>
                            </div>
                            <div className="profile-socials-row">
                                <div className="pf-social-input" style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "15px", marginBottom: "5px" }}>
                                    <span className="pf-social-icon" style={{ background: isSlugUnlocked ? "var(--dash-accent)" : "#222", color: isSlugUnlocked ? "black" : "#666" }}>
                                        {isSlugUnlocked ? <FaLink /> : <FaLock />}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                        <div className="pf-label" style={{ marginBottom: 4 }}>
                                            URL Personalizada (Tu Nombre) {!isSlugUnlocked && <span style={{ color: "var(--accent-pink)", fontSize: "0.65rem" }}>[BLOQUEADO - 4,000 pts]</span>}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "5px", opacity: isSlugUnlocked ? 1 : 0.4 }}>
                                            <span style={{ fontSize: "0.75rem", color: "#444" }}>{cityName.toLowerCase()}.cl/candidata/</span>
                                            <input
                                                type="text"
                                                name="slug"
                                                disabled={!isSlugUnlocked}
                                                value={formData.slug}
                                                onChange={handleChange}
                                                className="pf-input"
                                                placeholder={isSlugUnlocked ? "tu-nombre-artistico" : "Bloqueado"}
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                        <p style={{ fontSize: "0.65rem", color: "#555", marginTop: "5px" }}>
                                            {isSlugUnlocked
                                                ? "Solo letras, números y guiones. Ej: maria-perez"
                                                : "🔥 ¡Alcanza los 4,000 puntos para tener tu propio enlace personalizado!"}
                                        </p>
                                    </div>

                                </div>
                                <div className="pf-social-input">
                                    <span className="pf-social-icon instagram"><FaInstagram /></span>

                                    <div style={{ flex: 1 }}>
                                        <div className="pf-label" style={{ marginBottom: 4 }}>Instagram (usuario)</div>
                                        <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="pf-input" placeholder="marian.model" />
                                    </div>
                                </div>
                                <div className="pf-social-input">
                                    <span className="pf-social-icon tiktok"><FaTiktok /></span>
                                    <div style={{ flex: 1 }}>
                                        <div className="pf-label" style={{ marginBottom: 4 }}>TikTok (usuario)</div>
                                        <input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} className="pf-input" placeholder="marian.tiktok" />
                                    </div>
                                </div>
                                <div className="pf-social-input">
                                    <span className="pf-social-icon facebook"><FaFacebook /></span>
                                    <div style={{ flex: 1 }}>
                                        <div className="pf-label" style={{ marginBottom: 4 }}>Facebook (link)</div>
                                        <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="pf-input" placeholder="https://facebook.com/..." />
                                    </div>
                                </div>
                                <div className="pf-social-input">
                                    <span className="pf-social-icon whatsapp"><FaWhatsapp /></span>
                                    <div style={{ flex: 1 }}>
                                        <div className="pf-label" style={{ marginBottom: 4 }}>WhatsApp <span style={{ color: "#f87171" }}>* requerido</span></div>
                                        <input
                                            type="text"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            className="pf-input"
                                            placeholder="+569... (privado, solo organización)"
                                            style={{ borderColor: !formData.whatsapp ? "#f87171" : undefined }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fotos */}
                        <div className="profile-card profile-card-full">
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaCamera /></div>
                                <span className="profile-card-title">Foto Principal de Portada</span>
                            </div>
                            <p style={{ fontSize: "0.8rem", color: "#555", marginBottom: 16 }}>
                                Haz clic en la foto que quieres usar como tu portada principal.
                            </p>
                            {photos.length > 0 ? (
                                <div className="profile-photos-grid">
                                    {photos.map(photo => (
                                        <div
                                            key={photo.id}
                                            className={`profile-photo-item ${photo.isMain ? "is-main" : ""} ${!isMainPhotoUnlocked ? "locked" : ""}`}
                                            onClick={() => isMainPhotoUnlocked && handleSetMainPhoto(photo.id)}
                                        >
                                            <img src={photo.url} alt="Candidata" />
                                            {photo.isMain && <div className="profile-photo-main-badge">★ Portada</div>}
                                            {!photo.isMain && isMainPhotoUnlocked && (
                                                <div className="profile-photo-hover"><span>Usar Portada</span></div>
                                            )}
                                            {!photo.isMain && !isMainPhotoUnlocked && (
                                                <div className="profile-photo-locked">
                                                    <FaLock />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ padding: "30px", textAlign: "center", border: "1px dashed #222", borderRadius: 10, color: "#444" }}>
                                    No hay fotos de casting disponibles.
                                </div>
                            )}
                        </div>

                        {/* Video Pitch */}
                        <div className={`profile-card profile-card-full ${candidate.points < 2000 ? 'is-locked' : ''}`}
                             style={{ 
                                 borderLeft: candidate.points >= 2000 ? "4px solid #dfc06d" : "1px solid #1a1a1a",
                                 opacity: candidate.points < 2000 ? 0.7 : 1
                             }}>
                            <div className="profile-card-header">
                                <div className="profile-card-icon"><FaTasks style={{ color: candidate.points >= 2000 ? "#dfc06d" : "#555" }} /></div>
                                <span className="profile-card-title" style={{ color: candidate.points >= 2000 ? "#dfc06d" : "white" }}>
                                    Video de Presentación VIP {candidate.points < 2000 && "🔒"}
                                </span>
                            </div>

                            {candidate.points >= 2000 ? (
                                <>
                                    <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: 20 }}>
                                        ¡Felicidades! Has desbloqueado la mejora de tu video Pitch oficial.
                                    </p>
                                    <div className="pf-group full">
                                        <label className="pf-label">Sube tu nuevo video (Máx. 100MB)</label>
                                        {formData.videoPitchUrl && (
                                            <div style={{ marginBottom: "15px", borderRadius: "10px", overflow: "hidden", border: "1px solid #222" }}>
                                                <video src={formData.videoPitchUrl} controls style={{ width: "100%", maxHeight: "250px", background: "#000" }} />
                                            </div>
                                        )}
                                        <div style={{ position: "relative" }}>
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                                disabled={uploadingVideo}
                                            />
                                            <div style={{
                                                background: "#111",
                                                border: "2px dashed #222",
                                                borderRadius: "10px",
                                                padding: "20px",
                                                textAlign: "center",
                                                color: uploadingVideo ? "#dfc06d" : "white"
                                            }}>
                                                {uploadingVideo ? "Subiendo..." : (formData.videoPitchUrl ? "Cambiar Video" : "Seleccionar Video")}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: "center", padding: "20px" }}>
                                    <p style={{ fontSize: "0.85rem", color: "#444" }}>
                                        🔒 Esta función se desbloquea al alcanzar 2,000 puntos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Save */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`pf-save-btn ${success ? "success" : ""}`}
                    >
                        {loading ? "Guardando..." : success ? "✓ ¡Guardado con Éxito!" : <><FaSave style={{ marginRight: 8 }} /> Guardar Cambios</>}
                    </button>
                </form>
            )
            }
        </div >
    );
}
