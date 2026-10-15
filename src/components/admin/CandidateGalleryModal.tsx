"use client";

import { useState } from "react";
import { FaTimes, FaImage, FaVideo, FaCheck, FaInstagram, FaWhatsapp, FaRulerVertical, FaBirthdayCake, FaEnvelope, FaInfoCircle, FaSearchPlus, FaSearchMinus, FaDownload, FaSyncAlt, FaUniversity } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
    id: string;
    url: string;
    type: string;
    isWatermarked: boolean;
    isMain: boolean;
    createdAt: string;
}

interface Candidate {
    id: string;
    fullName: string;
    email: string;
    instagram?: string | null;
    birthDate: string;
    height: number;
    bio?: string | null;
    videoPitchUrl?: string | null;
    bust?: number | null;
    waist?: number | null;
    hips?: number | null;
    shoeSize?: number | null;
    clothesSize?: string | null;
    whatsapp?: string | null;
    paymentStatus?: "UNPAID" | "PARTIAL" | "PAID";
    paidAmount?: number;
    paymentProofUrl?: string | null;
    missionSubmissions?: {
        id: string;
        proofUrl: string | null;
        status: string;
        mission: { title: string };
    }[];
}

interface CandidateGalleryModalProps {
    candidate: Candidate;
    photos: Photo[];
    isJuan?: boolean;
}

export default function CandidateGalleryModal({ candidate, photos, isJuan }: CandidateGalleryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);
    const [zoomScale, setZoomScale] = useState(1);
    const [dragActive, setDragActive] = useState(false);

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const resetZoom = () => {
        setZoomScale(1);
    };

    const zoomIn = () => setZoomScale(prev => Math.min(prev + 0.5, 4));
    const zoomOut = () => setZoomScale(prev => Math.max(prev - 0.5, 1));

    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [videoUrl, setVideoUrl] = useState(candidate.videoPitchUrl);
    const [currentPhotos, setCurrentPhotos] = useState(photos);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingVideo(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`/api/admin/candidate/${candidate.id}/video`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setVideoUrl(data.url);
                alert("Video de intro actualizado con éxito.");
            } else {
                alert(data.error || "Error al subir video");
            }
        } catch (e) {
            console.error(e);
            alert("Error de conexión");
        } finally {
            setUploadingVideo(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let file = e.target.files?.[0];
        if (!file) return;

        const { convertHeicToJpegIfNeeded } = await import('@/lib/heicConverter');
        file = await convertHeicToJpegIfNeeded(file);

        setUploadingPhoto(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "EDITORIAL");

        try {
            const res = await fetch(`/api/admin/candidate/${candidate.id}/photos`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                setCurrentPhotos([...currentPhotos, data.photo]);
                alert("Foto añadida con éxito.");
            } else {
                alert(data.error || "Error al subir foto");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleDeletePhoto = async (photoId: string) => {
        if (!confirm("¿Seguro que quieres eliminar esta foto?")) return;
        try {
            const res = await fetch(`/api/admin/candidate/${candidate.id}/photos?photoId=${photoId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setCurrentPhotos(currentPhotos.filter(p => p.id !== photoId));
            } else {
                const data = await res.json();
                alert(data.error || "Error al eliminar");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSetMain = async (photoId: string) => {
        try {
            const res = await fetch(`/api/admin/candidate/${candidate.id}/photos`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ photoId, isMain: true })
            });
            if (res.ok) {
                setCurrentPhotos(currentPhotos.map(p => ({
                    ...p,
                    isMain: p.id === photoId
                })));
                alert("Foto principal actualizada.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    background: "var(--accent-pink)",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.filter = "none"}
            >
                <FaInfoCircle size={14} />
                VER EXPEDIENTE
            </button>

            {isOpen && (
                <div
                    onClick={() => {
                        setIsOpen(false);
                        setSelectedPhoto(null);
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.95)",
                        zIndex: 10000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px"
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#0a0a0a",
                            borderRadius: "24px",
                            maxWidth: "1200px",
                            width: "100%",
                            maxHeight: "90vh",
                            overflow: "hidden",
                            border: "1px solid #333",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: "25px 40px",
                            borderBottom: "1px solid #222",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#111",
                        }}>
                            <div>
                                <h2 style={{ fontSize: "24px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "5px" }}>
                                    Expediente de {candidate.fullName}
                                </h2>
                                <p style={{ fontSize: "14px", color: "var(--accent-pink)", fontWeight: "600" }}>
                                    Postulación Miss Universo Iquique
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                                {isJuan && (
                                    <form action={`/api/admin/candidate/${candidate.id}/approve`} method="POST">
                                        <button
                                            type="submit"
                                            style={{
                                                background: "var(--accent-pink)",
                                                color: "white",
                                                border: "none",
                                                padding: "10px 20px",
                                                borderRadius: "12px",
                                                cursor: "pointer",
                                                fontSize: "13px",
                                                fontWeight: "900",
                                                textTransform: "uppercase",
                                                letterSpacing: "1px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                boxShadow: "0 0 20px rgba(245, 36, 95, 0.3)"
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        >
                                            <FaCheck /> ACEPTAR PARTICIPACIÓN
                                        </button>
                                    </form>
                                )}
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setSelectedPhoto(null);
                                    }}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #333",
                                        color: "white",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "18px"
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Photo Viewer Overlay */}
                        <AnimatePresence>
                            {selectedPhoto && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: "fixed",
                                        inset: 0,
                                        background: "rgba(0,0,0,0.98)",
                                        zIndex: 11000,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "40px"
                                    }}
                                    onClick={() => {
                                        setSelectedPhoto(null);
                                        resetZoom();
                                    }}
                                >
                                    {/* Controls Overlay */}
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        style={{
                                            position: "absolute",
                                            top: "30px",
                                            right: "30px",
                                            display: "flex",
                                            gap: "15px",
                                            zIndex: 2
                                        }}
                                    >
                                        <button onClick={zoomIn} style={viewerButtonStyle} title="Acercar"><FaSearchPlus /></button>
                                        <button onClick={zoomOut} style={viewerButtonStyle} title="Alejar"><FaSearchMinus /></button>
                                        <button onClick={resetZoom} style={viewerButtonStyle} title="Resetear Zoom"><FaSyncAlt /></button>
                                        <button
                                            onClick={() => handleDownload(selectedPhoto.url, `photo_${candidate.fullName}_${selectedPhoto.type}.jpg`)}
                                            style={{ ...viewerButtonStyle, background: "var(--accent-pink)" }}
                                            title="Descargar Foto"
                                        >
                                            <FaDownload />
                                        </button>
                                        <button onClick={() => { setSelectedPhoto(null); resetZoom(); }} style={{ ...viewerButtonStyle, background: "#333" }} title="Cerrar"><FaTimes /></button>
                                    </div>

                                    {/* Photo Info Overlay */}
                                    <div style={{
                                        position: "absolute",
                                        bottom: "30px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "rgba(0,0,0,0.5)",
                                        padding: "10px 25px",
                                        borderRadius: "30px",
                                        backdropFilter: "blur(10px)",
                                        fontSize: "12px",
                                        textTransform: "uppercase",
                                        letterSpacing: "2px",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        zIndex: 2
                                    }}>
                                        Vista Detallada: <span className="accent-text">{selectedPhoto.type}</span> - Zoom: {Math.round(zoomScale * 100)}%
                                    </div>

                                    <motion.div
                                        onClick={(e) => e.stopPropagation()}
                                        drag={zoomScale > 1}
                                        style={{
                                            cursor: zoomScale > 1 ? "grab" : "default",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    >
                                        <motion.img
                                            src={selectedPhoto.url}
                                            alt={selectedPhoto.type}
                                            animate={{ scale: zoomScale }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            style={{
                                                maxHeight: "85vh",
                                                maxWidth: "85vw",
                                                objectFit: "contain",
                                                borderRadius: "4px",
                                                boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                                            }}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Internal Scrollable Content */}
                        <div style={{ overflowY: "auto", flex: 1, padding: "40px" }}>
                            <div className="admin-modal-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '40px' }}>

                                {/* Left Column: Personal Data & Bio */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                                    {/* GESTION DIRECTOR: VIDEO */}
                                    <div style={{ background: "#111", padding: "25px", borderRadius: "16px", border: "1px solid var(--accent-pink)", boxShadow: '0 0 30px rgba(245, 36, 95, 0.1)' }}>
                                        <h3 style={{ fontSize: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
                                            <FaVideo style={{ color: "var(--accent-pink)" }} /> GESTIÓN DE VIDEO INTRO (Director)
                                        </h3>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                            {videoUrl ? (
                                                <div style={{ position: 'relative' }}>
                                                    <video
                                                        src={videoUrl}
                                                        controls
                                                        style={{ width: "100%", borderRadius: "12px", border: "1px solid #333", background: "#000", maxHeight: '300px' }}
                                                    />
                                                    <p style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>* Este video aparecerá como intro en el perfil público.</p>
                                                </div>
                                            ) : (
                                                <div style={{ padding: '40px', background: '#050505', border: '2px dashed #333', borderRadius: '12px', textAlign: 'center', color: '#555' }}>
                                                    No hay video de intro configurado.
                                                </div>
                                            )}
                                            <label style={{
                                                background: uploadingVideo ? "#333" : "white",
                                                color: "black",
                                                padding: "12px",
                                                borderRadius: "8px",
                                                textAlign: "center",
                                                fontWeight: "900",
                                                fontSize: "12px",
                                                cursor: uploadingVideo ? "default" : "pointer",
                                                display: "block"
                                            }}>
                                                {uploadingVideo ? "SUBIENDO..." : "SUBIR / CAMBIAR VIDEO INTRO"}
                                                <input type="file" hidden accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* VIDEO DE PRESENTACIÓN (Candidata) */}
                                    {(() => {
                                        const presentationVideo = candidate.missionSubmissions?.find(sub => {
                                            const url = sub.proofUrl?.toLowerCase() || "";
                                            return url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm") || url.includes("video");
                                        });
                                        if (presentationVideo) {
                                            return (
                                                <div style={{ background: "#111", padding: "25px", borderRadius: "16px", border: "1px solid #333" }}>
                                                    <h3 style={{ fontSize: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
                                                        <FaVideo style={{ color: "cyan" }} /> VIDEO PRESENTACIÓN (Candidata)
                                                    </h3>
                                                    <video
                                                        src={presentationVideo.proofUrl!}
                                                        controls
                                                        style={{ width: "100%", borderRadius: "12px", border: "1px solid #333", background: "#000", maxHeight: '300px' }}
                                                    />
                                                    <p style={{ fontSize: '11px', color: '#666', marginTop: '10px' }}>
                                                        * Video subido por la candidata en la misión: <strong>{presentationVideo.mission.title}</strong>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}

                                    <div style={{ background: "#111", padding: "25px", borderRadius: "16px", border: "1px solid #222" }}>
                                        <h3 style={{ fontSize: "16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "var(--accent-pink)" }}>
                                            <FaInfoCircle /> INFORMACIÓN PERSONAL
                                        </h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "20px" }}>
                                            <DetailItem icon={<FaEnvelope />} label="Email" value={candidate.email} />
                                            <DetailItem icon={<FaWhatsapp />} label="WhatsApp" value={candidate.whatsapp || "No provisto"} />
                                            <DetailItem icon={<FaInstagram />} label="Instagram" value={candidate.instagram ? `@${candidate.instagram}` : "No provisto"} />
                                            <DetailItem icon={<FaBirthdayCake />} label="F. Nacimiento" value={new Date(candidate.birthDate).toLocaleDateString()} />
                                            <DetailItem icon={<FaRulerVertical />} label="Estatura" value={`${candidate.height} cm`} />
                                            <DetailItem icon={<FaInfoCircle />} label="B/C/C" value={`${candidate.bust || '-'}/${candidate.waist || '-'}/${candidate.hips || '-'}`} />
                                            <DetailItem icon={<FaInfoCircle />} label="Talla Ropa" value={candidate.clothesSize || "No provista"} />
                                            <DetailItem icon={<FaInfoCircle />} label="Calzado" value={candidate.shoeSize ? candidate.shoeSize.toString() : "No provisto"} />
                                        </div>
                                    </div>

                                    <div style={{ background: "#111", padding: "25px", borderRadius: "16px", border: "1px solid #222", flex: 1 }}>
                                        <h3 style={{ fontSize: "16px", marginBottom: "20px", color: "var(--accent-pink)" }}>BIOGRAFÍA</h3>
                                        <div style={{ fontSize: "15px", color: "#ccc", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                                            {candidate.bio || "Sin biografía disponible."}
                                        </div>
                                    </div>

                                    {/* PAYMENT MANAGEMENT SECCION */}
                                    {isJuan && (
                                        <div style={{ background: "#111", padding: "25px", borderRadius: "16px", border: "1px solid #C8FF0B" }}>
                                            <h3 style={{ fontSize: "16px", marginBottom: "20px", color: "#C8FF0B", display: "flex", alignItems: "center", gap: "10px" }}>
                                                <FaUniversity /> GESTIÓN DE PAGO
                                            </h3>

                                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                                    <span>Estado:</span>
                                                    <strong style={{ color: candidate.paymentStatus === 'PAID' ? '#C8FF0B' : 'orange' }}>
                                                        {candidate.paymentStatus || 'UNPAID'}
                                                    </strong>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                                                    <span>Monto Pagado:</span>
                                                    <strong>${candidate.paidAmount?.toLocaleString() || '0'}</strong>
                                                </div>

                                                {candidate.paymentProofUrl && (
                                                    <a href={candidate.paymentProofUrl} target="_blank" style={{ color: "cyan", fontSize: "12px", textDecoration: "underline" }}>
                                                        Ver Comprobante Adjunto
                                                    </a>
                                                )}

                                                <hr style={{ border: "0", borderTop: "1px solid #222" }} />

                                                <form action={`/api/admin/candidate/${candidate.id}/payment`} method="POST" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                                    <input
                                                        type="number"
                                                        name="paidAmount"
                                                        placeholder="Monto pago..."
                                                        defaultValue={candidate.paidAmount}
                                                        style={{ background: "#000", border: "1px solid #333", color: "white", padding: "8px", borderRadius: "6px" }}
                                                    />
                                                    <select name="status" style={{ background: "#000", border: "1px solid #333", color: "white", padding: "8px", borderRadius: "6px" }}>
                                                        <option value="PAID">PAID (Total)</option>
                                                        <option value="PARTIAL">PARTIAL</option>
                                                        <option value="UNPAID">UNPAID</option>
                                                    </select>
                                                    <button type="submit" style={{ gridColumn: "span 2", background: "#C8FF0B", color: "black", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "900", cursor: "pointer" }}>
                                                        ACTUALIZAR PAGO
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Gallery */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: "16px", display: "flex", alignItems: "center", gap: "10px", color: "var(--accent-pink)", margin: 0 }}>
                                            <FaImage /> GALERÍA ({currentPhotos.length})
                                        </h3>
                                        <label style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: '1px solid #333',
                                            color: "white",
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            fontSize: "11px",
                                            fontWeight: "bold",
                                            cursor: uploadingPhoto ? "default" : "pointer",
                                        }}>
                                            {uploadingPhoto ? "AÑADIENDO..." : "+ AÑADIR FOTO"}
                                            <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                                        </label>
                                    </div>

                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, 1fr)",
                                        gap: "15px"
                                    }}>
                                        {currentPhotos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                onMouseEnter={() => setHoveredPhoto(photo.id)}
                                                onMouseLeave={() => setHoveredPhoto(null)}
                                                style={{
                                                    position: "relative",
                                                    aspectRatio: "3/4",
                                                    border: photo.isMain ? '2px solid var(--accent-pink)' : (hoveredPhoto === photo.id ? '2px solid #444' : '2px solid #222'),
                                                    borderRadius: "12px",
                                                    overflow: "hidden",
                                                    cursor: "pointer",
                                                    transition: "all 0.2s",
                                                    transform: hoveredPhoto === photo.id ? 'scale(1.02)' : 'scale(1)'
                                                }}
                                                onClick={() => setSelectedPhoto(photo)}
                                            >
                                                <img src={photo.url} alt={photo.type} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                                                {photo.isMain && (
                                                    <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--accent-pink)', color: 'white', fontSize: '8px', padding: '4px 8px', borderRadius: '4px', fontWeight: '900' }}>
                                                        PRINCIPAL
                                                    </div>
                                                )}

                                                <div style={{
                                                    position: "absolute",
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    background: "rgba(0,0,0,0.7)",
                                                    padding: "8px",
                                                    fontSize: "10px",
                                                    textAlign: "center",
                                                    fontWeight: "bold",
                                                    textTransform: "uppercase",
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '5px'
                                                }}>
                                                    {photo.type}
                                                </div>

                                                {/* Action Buttons Overlay */}
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'rgba(0,0,0,0.4)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '10px',
                                                    opacity: hoveredPhoto === photo.id ? 1 : 0,
                                                    transition: 'opacity 0.2s'
                                                }}>
                                                    {!photo.isMain && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleSetMain(photo.id); }}
                                                            style={{ background: 'white', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}
                                                        >
                                                            HACER PRINCIPAL
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo.id); }}
                                                        style={{ background: '#ff4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}
                                                    >
                                                        ELIMINAR
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const viewerButtonStyle = {
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    backdropFilter: "blur(10px)",
    transition: "transform 0.2s"
} as const;

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div>
            <div style={{ fontSize: "11px", color: "#666", textTransform: "uppercase", marginBottom: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
                {icon} {label}
            </div>
            <div style={{ fontSize: "14px", fontWeight: "bold" }}>{value}</div>
        </div>
    );
}
