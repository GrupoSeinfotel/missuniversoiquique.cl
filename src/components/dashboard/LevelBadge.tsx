"use client";
import { getLevelData } from "@/lib/gamification";

interface LevelBadgeProps {
    points: number;
    showName?: boolean;
}

export default function LevelBadge({ points, showName = true }: LevelBadgeProps) {
    const levelData = getLevelData(points);

    return (
        <div className="level-badge" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.05)",
            padding: "4px 12px",
            borderRadius: "20px",
            border: `1px solid ${levelData.badgeColor}44`,
            fontSize: "0.8rem",
            fontWeight: 700,
            color: levelData.badgeColor
        }}>
            <span style={{ fontSize: "1rem" }}>{levelData.icon}</span>
            {showName && <span>Nivel {levelData.level}: {levelData.name}</span>}
        </div>
    );
}
