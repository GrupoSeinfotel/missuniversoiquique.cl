"use client";
import { LevelInfo } from "@/lib/gamification";
import { FaLock, FaCheckCircle, FaCrown } from "react-icons/fa";

interface LevelPreviewCardProps {
    level: LevelInfo;
    isLocked: boolean;
}

export default function LevelPreviewCard({ level, isLocked }: LevelPreviewCardProps) {
    return (
        <div className={`level-preview-card ${level.skinClass}`} style={{
            background: "#111",
            border: `1px solid ${isLocked ? "#222" : level.badgeColor}`,
            padding: "16px",
            borderRadius: "12px",
            width: "calc(100vw - 40px)",
            maxWidth: "280px",
            boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${level.badgeColor}22`,
            position: "absolute",
            bottom: "130%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            pointerEvents: "auto",
            animation: "fadeInUp 0.3s ease-out"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "1.5rem" }}>{level.icon}</span>
                <div>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: level.badgeColor, textTransform: "uppercase", letterSpacing: "1px" }}>
                        {level.name}
                    </h4>
                    <span style={{ fontSize: "0.65rem", color: "#555" }}>{level.minPoints} pts requeridos</span>
                </div>
                {isLocked && <FaLock style={{ marginLeft: "auto", color: "#444" }} />}
            </div>

            <p style={{ fontSize: "0.8rem", color: "#ccc", lineHeight: "1.5", marginBottom: "15px" }}>
                {level.previewText}
            </p>

            <div style={{ borderTop: "1px solid #222", paddingTop: "12px" }}>
                <span style={{ fontSize: "0.65rem", color: "#555", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>
                    Beneficios Unlocked
                </span>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                    {level.features.map((f, i) => (
                        <li key={i} style={{ fontSize: "0.75rem", color: "#eee", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaCheckCircle style={{ color: level.badgeColor, fontSize: "0.7rem" }} />
                            {f}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mockup Preview of Skin */}
            <div style={{ marginTop: "15px", height: "40px", borderRadius: "6px", overflow: "hidden", position: "relative", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(45deg, #000, ${level.badgeColor}33)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    color: level.badgeColor,
                    fontWeight: 800,
                    textTransform: "uppercase"
                }}>
                    Demo Estética {level.name}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translate(-50%, 10px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
}
