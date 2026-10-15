"use client";
import { useState, useEffect } from "react";
import { FaTrash, FaImage, FaEdit, FaTimes, FaHistory, FaHeart, FaShare, FaChartLine, FaSyncAlt } from "react-icons/fa";
import MediaGalleryModal from "./MediaGalleryModal";

interface MediaItem {
    type: "IMAGE" | "VIDEO";
    url: string;
}

export default function AdminPostCreator() {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState<MediaItem[]>([]);

    // Intelligent Growth States
    const [growthBaseLikes, setGrowthBaseLikes] = useState(0);
    const [growthLikesRate, setGrowthLikesRate] = useState(0);
    const [growthBaseShares, setGrowthBaseShares] = useState(0);
    const [growthSharesRate, setGrowthSharesRate] = useState(0);

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [showMediaModal, setShowMediaModal] = useState(false);

    // Management states
    const [posts, setPosts] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/feed");
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data.slice(0, 10));
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        try {
            const payload = {
                content,
                imageUrl: media.length > 0 ? media[0].url : "",
                mediaJson: JSON.stringify(media),
                growthBaseLikes: Number(growthBaseLikes),
                growthLikesRate: Number(growthLikesRate) / 100, // UI uses percentage
                growthBaseShares: Number(growthBaseShares),
                growthSharesRate: Number(growthSharesRate) / 100
            };

            const res = await fetch(editingId ? `/api/feed/${editingId}` : "/api/feed", {
                method: editingId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setStatus("success");
                resetForm();
                fetchPosts();
            } else {
                const errorData = await res.json();
                console.error("SERVER ERROR:", errorData);
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setContent("");
        setMedia([]);
        setGrowthBaseLikes(0);
        setGrowthLikesRate(0);
        setGrowthBaseShares(0);
        setGrowthSharesRate(0);
        setEditingId(null);
    };

    const handleEdit = (post: any) => {
        setEditingId(post.id);
        setContent(post.content);
        setGrowthBaseLikes(post.growthBaseLikes || 0);
        setGrowthLikesRate((post.growthLikesRate || 0) * 100);
        setGrowthBaseShares(post.growthBaseShares || 0);
        setGrowthSharesRate((post.growthSharesRate || 0) * 100);

        try {
            const parsedMedia = post.mediaJson ? JSON.parse(post.mediaJson) :
                (post.imageUrl ? [{ type: "IMAGE", url: post.imageUrl }] : []);
            setMedia(parsedMedia);
        } catch (e) {
            setMedia(post.imageUrl ? [{ type: "IMAGE", url: post.imageUrl }] : []);
        }
    };

    const handleResetDate = async () => {
        if (!editingId) return;
        try {
            await fetch(`/api/feed/${editingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resetGrowthDate: true })
            });
            fetchPosts();
            alert("Fecha de crecimiento reiniciada a hoy.");
        } catch (e) { console.error(e); }
    }

    const handleDelete = async (postId: string) => {
        if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;
        try {
            const res = await fetch(`/api/feed/${postId}`, { method: "DELETE" });
            if (res.ok) fetchPosts();
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: "#222", padding: "25px", borderRadius: "20px", border: "1px solid #333", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", margin: 0, color: editingId ? "var(--accent-pink)" : "white", letterSpacing: "1px" }}>
                        {editingId ? "EDITANDO PUBLICACIÓN" : "NUEVA PUBLICACIÓN"}
                    </h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {editingId && (
                            <button onClick={handleResetDate} title="Reiniciar fecha de crecimiento" style={{ background: '#333', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaSyncAlt /> Reiniciar Día 1
                            </button>
                        )}
                        {editingId && (
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <FaTimes /> Cancelar
                            </button>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escribe el contenido de la publicación..."
                        required
                        style={{
                            background: "#111",
                            border: "1px solid #333",
                            padding: "15px",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "14px",
                            minHeight: "120px",
                            outline: "none",
                            resize: "none"
                        }}
                    />

                    {/* Intelligent Engagement Controls */}
                    <div className="admin-post-grid">
                        <div>
                            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "var(--accent-pink)", marginBottom: "8px", fontWeight: "bold" }}>
                                <FaHeart /> LIKES (CRECIMIENTO INTELIGENTE)
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                    <span style={{ fontSize: '9px', color: '#666', display: 'block' }}>BASE INICIAL</span>
                                    <input
                                        type="number"
                                        value={growthBaseLikes}
                                        onChange={e => setGrowthBaseLikes(Number(e.target.value))}
                                        style={statInputStyle}
                                    />
                                </div>
                                <div>
                                    <span style={{ fontSize: '9px', color: '#666', display: 'block' }}>CRECIMIENTO % DIA</span>
                                    <input
                                        type="number"
                                        value={growthLikesRate}
                                        onChange={e => setGrowthLikesRate(Number(e.target.value))}
                                        style={statInputStyle}
                                        placeholder="60"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#3b82f6", marginBottom: "8px", fontWeight: "bold" }}>
                                <FaShare /> SHARES (CRECIMIENTO INTELIGENTE)
                            </label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                <div>
                                    <span style={{ fontSize: '9px', color: '#666', display: 'block' }}>BASE INICIAL</span>
                                    <input
                                        type="number"
                                        value={growthBaseShares}
                                        onChange={e => setGrowthBaseShares(Number(e.target.value))}
                                        style={statInputStyle}
                                    />
                                </div>
                                <div>
                                    <span style={{ fontSize: '9px', color: '#666', display: 'block' }}>CRECIMIENTO % DIA</span>
                                    <input
                                        type="number"
                                        value={growthSharesRate}
                                        onChange={e => setGrowthSharesRate(Number(e.target.value))}
                                        style={statInputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media Preview Area */}
                    {media.length > 0 && (
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {media.map((it, idx) => (
                                <div key={idx} style={{ position: "relative", width: "100px", height: "100px", borderRadius: "10px", overflow: "hidden", border: "1px solid #444" }}>
                                    {it.type === "IMAGE" ? (
                                        <img src={it.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <video src={it.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setMedia(media.filter((_, i) => i !== idx))}
                                        style={{ position: "absolute", top: "5px", right: "5px", background: "rgba(0,0,0,0.7)", border: "none", color: "white", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}
                                    >
                                        <FaTrash />
                                    </button>
                                    <span style={{ position: "absolute", bottom: "5px", left: "5px", fontSize: "8px", background: "var(--accent-pink)", padding: "2px 4px", borderRadius: "3px", fontWeight: "900" }}>{it.type}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            type="button"
                            onClick={() => setShowMediaModal(true)}
                            style={{
                                flex: 1,
                                background: "#333",
                                color: "white",
                                border: "none",
                                padding: "12px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}
                        >
                            <FaImage /> USAR MEDIA CENTER
                        </button>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-primary"
                            style={{ flex: 1, padding: "12px", opacity: loading ? 0.5 : 1, fontWeight: "900" }}
                        >
                            {loading ? "GUARDANDO..." : editingId ? "GUARDAR CAMBIOS" : "PUBLICAR AHORA"}
                        </button>
                    </div>

                    {status === "success" && <p style={{ color: "#4caf50", fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>✓ Operación realizada con éxito.</p>}
                    {status === "error" && <p style={{ color: "#f44336", fontSize: "12px", textAlign: "center", fontWeight: "bold" }}>✕ Error al procesar. Intenta de nuevo.</p>}
                </form>
            </div>

            {/* List of recent posts */}
            <div style={{ background: "#111", padding: "25px", borderRadius: "20px", border: "1px solid #222" }}>
                <h3 style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "20px", color: "#666", display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaHistory /> ÚLTIMAS PUBLICACIONES
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {posts.map(post => {
                        return (
                            <div key={post.id} style={{ display: 'flex', gap: '15px', padding: '15px', background: '#1a1a1a', borderRadius: '15px', border: editingId === post.id ? '1px solid var(--accent-pink)' : '1px solid #222' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                                    {post.imageUrl ? (
                                        <img 
                                            src={post.imageUrl} 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/60x60/1a1a1a/333333?text=Error';
                                            }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}><FaImage /></div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#ccc', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <span style={{ fontSize: "11px", color: "var(--accent-pink)", display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaHeart /> {post.legacyLikes || 0}
                                            <span style={{ fontSize: '9px', opacity: 0.5 }}> (+{((post.growthLikesRate || 0) * 100).toFixed(0)}%/día)</span>
                                        </span>
                                        <span style={{ fontSize: "11px", color: "#3b82f6", display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaShare /> {post.legacyShares || 0}
                                            <span style={{ fontSize: '9px', opacity: 0.5 }}> (+{((post.growthSharesRate || 0) * 100).toFixed(0)}%/día)</span>
                                        </span>
                                        <div style={{ flex: 1 }}></div>
                                        <button onClick={() => handleEdit(post)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showMediaModal && (
                <MediaGalleryModal
                    onClose={() => setShowMediaModal(false)}
                    onSelect={(url, type) => {
                        setMedia([...media, { type, url }]);
                        setShowMediaModal(false);
                    }}
                />
            )}
        </div>
    );
}

const statInputStyle = {
    background: "#000",
    border: "1px solid #333",
    color: "white",
    borderRadius: "8px",
    padding: "8px",
    width: "100%",
    fontSize: "12px",
    outline: "none"
};
