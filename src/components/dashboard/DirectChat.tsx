"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
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

export default function DirectChat({ peerId, peerName, currentUserId }: { peerId: string, peerName: string, currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = () => {
            fetch(`/api/messages?peerId=${peerId}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMessages(data);
                    setLoading(false);
                })
                .catch(err => console.error("Chat error", err));
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Polling every 5s for simplicity
        return () => clearInterval(interval);
    }, [peerId]);

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
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: peerId, content: tempInput })
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
            height: "500px",
            display: "flex",
            flexDirection: "column",
            background: "#0a0a0a",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.05)",
            overflow: "hidden"
        }}>
            {/* Header */}
            <div style={{ padding: "15px 20px", background: "var(--secondary-bg)", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "700", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>MENSAJE DIRECTO: <span className="accent-text">{peerName}</span></span>
                <span style={{ fontSize: "10px", color: "var(--accent-pink)" }}>• EN LÍNEA</span>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{
                        alignSelf: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: msg.senderId === currentUserId ? "flex-end" : "flex-start",
                        gap: "2px"
                    }}>
                        {msg.senderId !== currentUserId && (
                            <span style={{ fontSize: "10px", color: "#666", fontWeight: "bold" }}>
                                {msg.sender.username || msg.sender.email}
                            </span>
                        )}
                        <div style={{
                            padding: "10px 15px",
                            borderRadius: "15px",
                            background: msg.senderId === currentUserId ? "var(--accent-pink)" : "rgba(255,255,255,0.05)",
                            fontSize: "13px",
                            color: "white"
                        }}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} style={{ padding: "15px", background: "rgba(0,0,0,0.5)", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "10px 15px",
                        borderRadius: "20px",
                        color: "white",
                        fontSize: "13px",
                        outline: "none"
                    }}
                />
                <button type="submit" style={{
                    background: "var(--accent-pink)",
                    border: "none",
                    color: "white",
                    padding: "0 20px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    fontSize: "12px",
                    cursor: "pointer"
                }}>ENVIAR</button>
            </form>
        </div>
    );
}
