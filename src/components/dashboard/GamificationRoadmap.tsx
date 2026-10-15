"use client";
import React from 'react';
import { LEVELS } from '@/lib/gamification';
import { FaLock, FaCheckCircle, FaStar, FaAward, FaCrown } from 'react-icons/fa';

interface GamificationRoadmapProps {
    currentPoints: number;
}

export default function GamificationRoadmap({ currentPoints }: GamificationRoadmapProps) {
    return (
        <div className="gamification-roadmap-container">
            <div className="roadmap-header">
                <h3 className="roadmap-title">Camino a la Corona 👑</h3>
                <p className="roadmap-subtitle">Desbloquea beneficios exclusivos acumulando puntos de apoyo.</p>
            </div>

            <div className="roadmap-grid">
                {LEVELS.map((lvl) => {
                    const isUnlocked = currentPoints >= lvl.minPoints;

                    return (
                        <div key={lvl.level} className={`roadmap-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                            <div className="roadmap-point-badge">
                                {lvl.minPoints} <span className="pts-label">pts</span>
                            </div>

                            <div className="roadmap-content">
                                <div className="roadmap-lvl-name">
                                    <span className="lvl-icon">{lvl.icon}</span>
                                    {lvl.name}
                                    {isUnlocked ? (
                                        <FaCheckCircle className="status-icon unlocked" title="Desbloqueado" />
                                    ) : (
                                        <FaLock className="status-icon locked" title="Bloqueado" />
                                    )}
                                </div>
                                <div className="roadmap-impact">
                                    {lvl.impact}
                                </div>
                            </div>

                            {isUnlocked && (
                                <div className="unlocked-shimmer"></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
                .gamification-roadmap-container {
                    background: var(--secondary-bg);
                    border-radius: 16px;
                    padding: 30px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    margin-top: 30px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                }

                .roadmap-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .roadmap-title {
                    font-size: 1.8rem;
                    color: var(--accent-pink);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 10px;
                }

                .roadmap-subtitle {
                    color: var(--text-gray);
                    font-size: 0.9rem;
                }

                .roadmap-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 15px;
                }

                .roadmap-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .roadmap-item.unlocked {
                    border-color: rgba(223, 192, 109, 0.3);
                    background: linear-gradient(135deg, rgba(223, 192, 109, 0.05) 0%, rgba(0,0,0,0.2) 100%);
                }
                
                .roadmap-item.locked {
                    opacity: 0.7;
                    filter: grayscale(0.5);
                }

                .roadmap-point-badge {
                    background: #111;
                    padding: 8px 12px;
                    border-radius: 8px;
                    color: var(--accent-pink);
                    font-weight: 800;
                    font-size: 1.1rem;
                    min-width: 80px;
                    text-align: center;
                    border: 1px solid rgba(223, 192, 109, 0.2);
                }

                .pts-label {
                    font-size: 0.6rem;
                    display: block;
                    text-transform: uppercase;
                    margin-top: -2px;
                    opacity: 0.7;
                }

                .roadmap-content {
                    flex: 1;
                }

                .roadmap-lvl-name {
                    font-weight: 700;
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                    margin-bottom: 4px;
                }

                .lvl-icon {
                    font-size: 1.2rem;
                }

                .roadmap-impact {
                    font-size: 0.75rem;
                    color: var(--text-gray);
                    line-height: 1.3;
                }

                .status-icon {
                    font-size: 0.8rem;
                }

                .status-icon.unlocked {
                    color: #4ade80;
                }

                .status-icon.locked {
                    color: #f87171;
                    opacity: 0.5;
                }

                .unlocked-shimmer {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 5px;
                    height: 100%;
                    background: var(--accent-pink);
                    box-shadow: 0 0 15px var(--accent-pink);
                    opacity: 0.5;
                }

                @media (max-width: 768px) {
                    .roadmap-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .gamification-roadmap-container {
                        padding: 20px;
                    }

                    .roadmap-title {
                        font-size: 1.4rem;
                    }
                }
            `}</style>
        </div>
    );
}
