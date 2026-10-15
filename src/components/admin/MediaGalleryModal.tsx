"use client";
import React, { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaCloudUploadAlt, FaFilm, FaTrash, FaEdit, FaCheck, FaInfoCircle } from "react-icons/fa";

interface MediaGalleryModalProps {
    onClose: () => void;
    onSelect: (url: string, type: "IMAGE" | "VIDEO") => void;
}

export default function MediaGalleryModal({ onClose, onSelect }: MediaGalleryModalProps) {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/assets/list");
            const data = await res.json();
            setAssets(Array.isArray(data) ? data : []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", file.name);
        formData.append("type", file.type.includes("video") ? "VIDEO" : "IMAGE");

        try {
            const res = await fetch("/api/admin/assets", { method: "POST", body: formData });
            if (res.ok) fetchAssets();
        } catch (e) { console.error(e); }
        finally { setUploading(false); }
    };

    const handleDelete = async (e: React.MouseEvent, id: string, usages: string[]) => {
        e.stopPropagation();
        if (usages.length > 0) {
            if (!confirm(`Este archivo se está usando en:\n- ${usages.join("\n- ")}\n\n¿Estás seguro de que quieres borrarlo? Se romperán los enlaces donde se use.`)) {
                return;
            }
        } else {
            if (!confirm("¿Seguro que quieres borrar este archivo definitivamente?")) return;
        }

        try {
            const res = await fetch(`/api/admin/assets/${id}`, { method: "DELETE" });
            if (res.ok) fetchAssets();
            else alert("Error al borrar");
        } catch (e) { console.error(e); }
    };

    const startEdit = (e: React.MouseEvent, asset: any) => {
        e.stopPropagation();
        setEditingId(asset.id);
        setEditingName(asset.name);
    };

    const saveEdit = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            const res = await fetch(`/api/admin/assets/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editingName })
            });
            if (res.ok) {
                setEditingId(null);
                fetchAssets();
            }
        } catch (e) { console.error(e); }
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <h3 style={{ margin: 0, fontWeight: 900, letterSpacing: '1px' }}>CENTRO DE MEDIOS <span style={{ color: 'var(--accent-pink)', fontSize: '0.7em' }}>AVANZADO</span></h3>
                    <button onClick={onClose} style={closeBtnStyle}><FaTimes /></button>
                </div>

                <div style={toolbarStyle}>
                    <div style={searchContainerStyle}>
                        <FaSearch color="#555" />
                        <input
                            placeholder="Buscar archivos por nombre..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                    <label style={uploadBtnStyle}>
                        {uploading ? "SUBIENDO..." : <><FaCloudUploadAlt /> SUBIR NUEVO</>}
                        <input type="file" hidden onChange={handleUpload} />
                    </label>
                </div>

                <div style={gridStyle}>
                    {loading ? (
                        <div style={{ padding: "50px", textAlign: "center", color: "#555" }}>Cargando galería...</div>
                    ) : (
                        assets
                            .filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
                            .map(asset => (
                                <div key={asset.id} className="media-item-card" onClick={() => onSelect(asset.url, asset.type === "VIDEO" ? "VIDEO" : "IMAGE")} style={itemStyle}>
                                    <div style={thumbWrapperStyle}>
                                        {asset.type === "VIDEO" ? (
                                            <div style={videoThumbStyle}><FaFilm size={24} color="#3b82f6" /></div>
                                        ) : (
                                            <img src={asset.url} style={imgThumbStyle} />
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="item-actions-overlay" style={actionsOverlayStyle}>
                                            <button onClick={(e) => startEdit(e, asset)} style={actionIconStyle} title="Renombrar"><FaEdit /></button>
                                            <button onClick={(e) => handleDelete(e, asset.id, asset.usages || [])} style={{ ...actionIconStyle, color: '#ff4444' }} title="Eliminar"><FaTrash /></button>
                                        </div>

                                        {/* Usage indicator */}
                                        {asset.usages && asset.usages.length > 0 && (
                                            <div style={usageBadgeStyle} title={`Usado en: ${asset.usages.join(", ")}`}>
                                                <FaCheck size={8} /> EN USO
                                            </div>
                                        )}
                                    </div>

                                    <div style={nameContainerStyle}>
                                        {editingId === asset.id ? (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input
                                                    autoFocus
                                                    value={editingName}
                                                    onChange={e => setEditingName(e.target.value)}
                                                    onClick={e => e.stopPropagation()}
                                                    style={editInputStyle}
                                                />
                                                <button onClick={(e) => saveEdit(e, asset.id)} style={confirmEditBtnStyle}><FaCheck /></button>
                                            </div>
                                        ) : (
                                            <div style={nameStyle}>{asset.name}</div>
                                        )}

                                        {asset.usages && asset.usages.length > 0 && (
                                            <div style={usageListStyle}>
                                                <FaInfoCircle size={10} /> {asset.usages.length} uso(s)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .media-item-card:hover .item-actions-overlay {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}

// --- Styles ---
const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", backdropFilter: 'blur(5px)' };
const modalStyle: React.CSSProperties = { background: "#0a0a0a", width: "100%", maxWidth: "1000px", height: "85vh", borderRadius: "24px", border: "1px solid #222", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: '0 20px 50px rgba(0,0,0,0.5)' };
const headerStyle: React.CSSProperties = { padding: "25px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", background: '#0f0f0f' };
const closeBtnStyle: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "none", color: "white", cursor: "pointer", fontSize: "16px", width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const toolbarStyle: React.CSSProperties = { padding: "15px 25px", background: "#080808", borderBottom: "1px solid #1a1a1a", display: "flex", gap: "20px" };
const searchContainerStyle: React.CSSProperties = { flex: 1, background: "#151515", borderRadius: "12px", display: "flex", alignItems: "center", padding: "0 15px", border: '1px solid #222' };
const searchInputStyle: React.CSSProperties = { flex: 1, background: "transparent", border: "none", padding: "12px", color: "white", outline: "none", fontSize: "14px" };
const uploadBtnStyle: React.CSSProperties = { background: "var(--accent-pink)", color: "white", padding: "10px 20px", borderRadius: "12px", fontWeight: "900", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: '0 5px 15px rgba(245, 36, 95, 0.3)' };
const gridStyle: React.CSSProperties = { flex: 1, overflowY: "auto", padding: "25px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px" };

const itemStyle: React.CSSProperties = { background: "#111", padding: "10px", borderRadius: "16px", cursor: "pointer", border: "1px solid #1a1a1a", transition: "all 0.3s ease", position: 'relative' };
const thumbWrapperStyle: React.CSSProperties = { width: "100%", height: "130px", borderRadius: "10px", overflow: "hidden", background: "#050505", position: 'relative' };
const imgThumbStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
const videoThumbStyle: React.CSSProperties = { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: 'rgba(59, 130, 246, 0.1)' };

const actionsOverlayStyle: React.CSSProperties = { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', opacity: 0, transition: 'opacity 0.2s ease' };
const actionIconStyle: React.CSSProperties = { background: 'white', border: 'none', color: 'black', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' };

const usageBadgeStyle: React.CSSProperties = { position: 'absolute', top: '8px', right: '8px', background: '#22c55e', color: 'white', fontSize: '8px', padding: '3px 6px', borderRadius: '4px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' };

const nameContainerStyle: React.CSSProperties = { marginTop: "12px", padding: '0 5px' };
const nameStyle: React.CSSProperties = { fontSize: "11px", color: "#888", fontWeight: 'bold', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };
const usageListStyle: React.CSSProperties = { fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' };

const editInputStyle: React.CSSProperties = { background: '#222', border: '1px solid var(--accent-pink)', borderRadius: '4px', color: 'white', fontSize: '11px', padding: '4px 8px', width: '100%' };
const confirmEditBtnStyle: React.CSSProperties = { background: 'var(--accent-pink)', border: 'none', color: 'white', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' };
