"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GroupMessage {
    id: string;
    content: string;
    senderId: string;
    sender: {
        username: string | null;
        email: string;
        role: string;
    };
    createdAt: string;
}

export default function GroupChat({ currentUserId, groupName = "DIRECTORS" }: { currentUserId: string, groupName?: string }) {
    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = () => {
            fetch(`/api/group-messages?groupName=${groupName}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMessages(data);
                    setLoading(false);
                })
                .catch(err => console.error("Group Chat error", err));
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Polling every 3s for group chat
        return () => clearInterval(interval);
    }, [groupName]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const tempInput = input;
        setInput("");

        try {
            const res = await fetch("/api/group-messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: tempInput, groupName })
            });
            if (res.ok) {
                const newMessage = await res.json();
                setMessages([...messages, newMessage]);
            }
        } catch (err) {
            console.error("Send error", err);
        }
    };

    return (
        <div style={{
            height: "600px",
            display: "flex",
            flexDirection: "column",
            background: "#0a0a0a",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden"
        }}>
            {/* Header */}
            <div style={{ padding: "15px 20px", background: "var(--secondary-bg)", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>SALA DE MANDO: <span className="accent-text">{groupName}</span></span>
                <span style={{ fontSize: "10px", color: "var(--accent-pink)" }}>• CHAT INTERNO</span>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        alignSelf: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                        gap: "4px"
                    }}>
                        <div style={{ fontSize: "10px", color: "var(--text-gray)", fontWeight: "bold" }}>
                            {msg.sender.username || msg.sender.email} ({msg.sender.role === 'SUPERADMIN' ? 'SUPER' : 'DIRECTOR'})
                        </div>
                        <div style={{
                            padding: "10px 15px",
                            borderRadius: "15px",
                            background: msg.senderId === currentUserId ? "var(--accent-pink)" : "rgba(255,255,255,0.05)",
                            fontSize: "13px",
                            color: "white",
                            boxShadow: msg.senderId === currentUserId ? "0 4px 15px rgba(245, 36, 95, 0.2)" : "none"
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && <p style={{ textAlign: 'center', color: '#444' }}>Cargando mensajes...</p>}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} style={{ padding: "20px", background: "rgba(0,0,0,0.5)", display: "flex", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe un mensaje interno..."
                    style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "12px 20px",
                        borderRadius: "25px",
                        color: "white",
                        fontSize: "14px",
                        outline: "none"
                    }}
                />
                <button type="submit" style={{
                    background: "var(--accent-pink)",
                    border: "none",
                    color: "white",
                    padding: "0 25px",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    fontSize: "12px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(245, 36, 95, 0.3)"
                }}>ENVIAR</button>
            </form>
        </div>
    );
}
