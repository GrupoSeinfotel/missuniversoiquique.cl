"use client";
import { useState, useEffect } from "react";
import DirectChat from "@/components/dashboard/DirectChat";

interface ChatPartner {
    id: string;
    email: string;
    username: string | null;
    candidate: {
        fullName: string;
    } | null;
    lastMessageAt: string;
}

export default function InboxManager({ currentUserId }: { currentUserId: string }) {
    const [partners, setPartners] = useState<ChatPartner[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/messages/partners")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setPartners(data);
                setLoading(false);
            })
            .catch(err => console.error("Inbox partners error", err));
    }, []);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "20px", height: "70vh" }}>
            {/* Sidebar: Chat List */}
            <div style={{ background: "#111", border: "1px solid #222", borderRadius: "12px", overflowY: "auto" }}>
                <div style={{ padding: "20px", borderBottom: "1px solid #222", fontWeight: "bold", fontSize: "14px" }}>BANDEJA DE ENTRADA</div>
                {loading && <p style={{ padding: "20px", color: "#444" }}>Cargando conversaciones...</p>}
                {partners.map(p => (
                    <div
                        key={p.id}
                        onClick={() => setSelectedPartner(p)}
                        style={{
                            padding: "15px 20px",
                            borderBottom: "1px solid #222",
                            cursor: "pointer",
                            background: selectedPartner?.id === p.id ? "rgba(200, 255, 11, 0.05)" : "transparent",
                            transition: "all 0.2s"
                        }}
                    >
                        <div style={{ fontWeight: "700", color: selectedPartner?.id === p.id ? "#C8FF0B" : "white" }}>
                            {p.candidate?.fullName || p.username || p.email}
                        </div>
                        <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>{p.email}</div>
                    </div>
                ))}
                {!loading && partners.length === 0 && (
                    <p style={{ padding: "20px", color: "#666", fontSize: "12px" }}>No hay mensajes de candidatas aún.</p>
                )}
            </div>

            {/* Chat Area */}
            <div style={{ background: "#0a0a0a", border: "1px solid #222", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {selectedPartner ? (
                    <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column" }}>
                        <div style={{ marginBottom: "20px", borderBottom: "1px solid #222", paddingBottom: "10px" }}>
                            <h3 style={{ fontSize: "16px" }}>Chat con <span className="accent-text">{selectedPartner.candidate?.fullName || selectedPartner.username || selectedPartner.email}</span></h3>
                        </div>
                        <div style={{ flex: 1, minHeight: 0 }}>
                            <DirectChat
                                currentUserId={currentUserId}
                                peerId={selectedPartner.id}
                                peerName={selectedPartner.candidate?.fullName || selectedPartner.username || selectedPartner.email}
                            />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#444" }}>
                        Selecciona una conversación para responder
                    </div>
                )}
            </div>
        </div>
    );
}
