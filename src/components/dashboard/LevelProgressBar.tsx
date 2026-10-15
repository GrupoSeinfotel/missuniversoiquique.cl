import { getLevelData, getNextLevel } from "@/lib/gamification";
import { useState } from "react";
import LevelPreviewCard from "./LevelPreviewCard";

interface LevelProgressBarProps {
    points: number;
}

export default function LevelProgressBar({ points }: LevelProgressBarProps) {
    const currentLevel = getLevelData(points);
    const nextLevel = getNextLevel(points);
    const [hoveredLevel, setHoveredLevel] = useState<any>(null);

    if (!nextLevel) {
        return (
            <div className="level-progress-containerMax">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem", color: "#888" }}>
                    <span>Nivel Máximo alcanzado</span>
                    <span>{points.toLocaleString()} pts</span>
                </div>
                <div className="progress-bar-bg" style={{ height: "8px", background: "#111", borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "var(--dash-accent)" }} />
                </div>
                <p style={{ marginTop: "10px", fontSize: "0.7rem", color: "var(--dash-accent)", textAlign: "center" }}>
                    ⭐ ERES UNA ESTRELLA MU 👑
                </p>
            </div>
        );
    }

    const startPoints = currentLevel.minPoints;
    const endPoints = nextLevel.minPoints;
    const progress = ((points - startPoints) / (endPoints - startPoints)) * 100;
    const remaining = endPoints - points;

    return (
        <div className="level-progress-container">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem", fontWeight: 600, position: "relative" }}>
                <span
                    style={{ color: currentLevel.badgeColor, cursor: "pointer", borderBottom: "1px dashed transparent" }}
                    onMouseEnter={() => setHoveredLevel(currentLevel)}
                    onMouseLeave={() => setHoveredLevel(null)}
                    onClick={() => setHoveredLevel(hoveredLevel?.level === currentLevel.level ? null : currentLevel)}
                >
                    {currentLevel.name}
                    {hoveredLevel?.level === currentLevel.level && <LevelPreviewCard level={currentLevel} isLocked={false} />}
                </span>

                <span style={{ color: "#555" }}>{points.toLocaleString()} / {endPoints.toLocaleString()} pts</span>

                <span
                    style={{ color: nextLevel.badgeColor, cursor: "pointer", borderBottom: `1px dashed ${nextLevel.badgeColor}` }}
                    onMouseEnter={() => setHoveredLevel(nextLevel)}
                    onMouseLeave={() => setHoveredLevel(null)}
                    onClick={() => setHoveredLevel(hoveredLevel?.level === nextLevel.level ? null : nextLevel)}
                >
                    {nextLevel.name}
                    {hoveredLevel?.level === nextLevel.level && <LevelPreviewCard level={nextLevel} isLocked={true} />}
                </span>
            </div>

            <div className="progress-bar-bg" style={{
                height: "10px",
                background: "#0a0a0a",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #111"
            }}>
                <div style={{
                    width: `${Math.min(100, progress)}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${currentLevel.badgeColor} 0%, ${nextLevel.badgeColor} 100%)`,
                    boxShadow: `0 0 10px ${currentLevel.badgeColor}44`,
                    transition: "width 1s ease-out"
                }} />
            </div>

            <p style={{ marginTop: "12px", fontSize: "0.7rem", color: "#444", textAlign: "center" }}>
                Te faltan <strong style={{ color: "#888" }}>{remaining.toLocaleString()} puntos</strong> para desbloquear: <br />
                <span style={{ color: nextLevel.badgeColor, fontWeight: 700 }}>🎁 {nextLevel.features[0]}</span>
            </p>
        </div>
    );
}
