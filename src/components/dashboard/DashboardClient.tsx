"use client";
import { useState, useEffect } from "react";
import DashboardShell from "./DashboardShell";
import ProfileView from "./ProfileView";
import VoterVotesView from "./VoterVotesView";
import DirectChat from "./DirectChat";
import BrandAmbassadorProgram from "./BrandAmbassadorProgram";
import ReferralProgram from "./ReferralProgram";
import PaymentStatusOverlay from "./PaymentStatusOverlay";
import Link from "next/link";
import LevelBadge from "./LevelBadge";
import LevelProgressBar from "./LevelProgressBar";
import RewardCard from "./RewardCard";
import { isFeatureUnlocked } from "@/lib/gamification";
import CandidateVoteAnalytics from "./CandidateVoteAnalytics";
import TicketSalesMeta from "./TicketSalesMeta";


interface Props {
    userRole: string;
    userEmail: string;
    userId: string;
    candidate: any;
    announcements: any[];
    adminUserId: string | null;
    adminUserName: string;
    cityName: string;
    citySlug: string;
    userSlug: string | null;
    voterVotes?: any[];
}

export default function DashboardClient({
    userRole,
    userEmail,
    userId,
    candidate,
    announcements,
    adminUserId,
    adminUserName,
    cityName,
    citySlug,
    userSlug,
    voterVotes = [],
}: Props) {
    const [activeTab, setActiveTab] = useState("perfil");
    const [missions, setMissions] = useState<any[]>([]);
    const [loadingMissions, setLoadingMissions] = useState(false);
    const [missionError, setMissionError] = useState<string | null>(null);

    useEffect(() => {
        if (activeTab === "misiones") {
            setLoadingMissions(true);
            setMissionError(null);
            fetch("/api/candidate/missions")
                .then(async res => {
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || "Error al cargar misiones");
                    return data;
                })
                .then(data => {
                    setMissions(Array.isArray(data) ? data : []);
                    setLoadingMissions(false);
                })
                .catch(err => {
                    console.error("Error fetching missions:", err);
                    setMissionError(err.message);
                    setLoadingMissions(false);
                });
        }
    }, [activeTab]);

    const isCandidate = userRole === "CANDIDATE";
    const totalPoints = isCandidate ? (candidate?.points || 0) : 0;
    const isAnalyticsUnlocked = isFeatureUnlocked(totalPoints, "Análisis de Votos");


    const mainPhoto = candidate?.photos?.find((p: any) => p.isMain) || candidate?.photos?.[0];
    const candidateSlug = userSlug ?? candidate?.id;

    return (
        <>
            {userRole === "CANDIDATE" && candidate && (
                <>
                    <PaymentStatusOverlay candidate={candidate} />
                    {candidate.rewards && candidate.rewards.length > 0 && (
                        <RewardCard
                            rewards={candidate.rewards}
                            candidateName={candidate.fullName}
                        />
                    )}
                </>
            )}

            <DashboardShell
                activeTab={activeTab}
                onTabChange={setActiveTab}
                candidateName={candidate?.user?.name || ""}
                candidatePhoto={mainPhoto?.url}
                candidateCity={candidate?.city}
                candidatePoints={totalPoints}
                userEmail={userEmail}
                citySlug={citySlug}
                userRole={userRole}
                pendingAnnouncementsCount={announcements.length}
                isAnalyticsUnlocked={isAnalyticsUnlocked}
            >

                {/* ── PERFIL ── */}
                {activeTab === "perfil" && (
                    <>
                        {isCandidate && candidate && (
                            <div className="dash-hero-content" style={{ padding: "0 0 40px 0" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
                                    <div>
                                        <h1 className="dash-hero-title">¡Hola, {candidate?.fullName.split(" ")[0]}! ✨</h1>
                                        <p className="dash-hero-subtitle">Bienvenida a tu panel de control oficial.</p>
                                        <div style={{ marginTop: "15px" }}>
                                            <LevelBadge points={totalPoints} />
                                        </div>
                                    </div>

                                    <div style={{
                                        background: "rgba(0,0,0,0.3)",
                                        padding: "20px",
                                        borderRadius: "15px",
                                        width: "100%",
                                        maxWidth: "400px",
                                        border: "1px solid rgba(255,255,255,0.05)"
                                    }}>
                                        <h4 style={{ fontSize: "0.85rem", color: "white", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                            Camino a la Corona 👑
                                        </h4>
                                        <LevelProgressBar points={totalPoints} />
                                    </div>

                                    {/* Presentation Data CTA */}
                                    <Link href="/datospresentacion" style={{
                                        background: "linear-gradient(135deg, rgba(245,36,95,0.2) 0%, rgba(245,36,95,0.05) 100%)",
                                        padding: "20px",
                                        borderRadius: "15px",
                                        width: "100%",
                                        maxWidth: "400px",
                                        border: "1px solid rgba(245,36,95,0.3)",
                                        textDecoration: "none",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        transition: "transform 0.3s ease"
                                    }} className="hover-scale">
                                        <div>
                                            <h4 style={{ fontSize: "0.9rem", color: "white", marginBottom: "4px", fontWeight: "900" }}>📝 DATOS PRESENTACIÓN</h4>
                                            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Completa tu info para las galas.</p>
                                        </div>
                                        <div style={{ background: "var(--accent-pink)", color: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "900" }}>
                                            LLENAR
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {candidate ? (

                            <ProfileView
                                candidate={candidate}
                                cityName={cityName}
                                candidateSlug={candidateSlug}
                            />
                        ) : (
                            /* Admin / Sin candidata */
                            <div style={{ textAlign: "center", padding: "80px 20px" }}>
                                {(userRole === "SUPERADMIN" || userRole === "DIRECTOR") ? (
                                    <>
                                        <div style={{ fontSize: "3rem", marginBottom: 20 }}>🛠️</div>
                                        <h2 style={{ color: "white", marginBottom: 16 }}>Panel de Administración</h2>
                                        <p style={{ color: "#555", marginBottom: 30 }}>
                                            Tienes privilegios de administración. Gestiona candidatas, votos y anuncios.
                                        </p>
                                        <a href="/admin" style={{
                                            display: "inline-block",
                                            padding: "14px 32px",
                                            background: "var(--accent-pink)",
                                            color: "white",
                                            borderRadius: 10,
                                            textDecoration: "none",
                                            fontWeight: 700,
                                            fontSize: "0.9rem",
                                            letterSpacing: "1px",
                                            textTransform: "uppercase"
                                        }}>
                                            Entrar al Panel Admin
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: "3rem", marginBottom: 20 }}>👸</div>
                                        <h2 style={{ color: "white", marginBottom: 16 }}>¿Lista para ser la próxima reina?</h2>
                                        <p style={{ color: "#555", marginBottom: 30 }}>
                                            Aún no has completado tu perfil. Sube tus fotos y video pitch para iniciar.
                                        </p>
                                        <a href="/casting" style={{
                                            display: "inline-block",
                                            padding: "14px 32px",
                                            background: "var(--accent-pink)",
                                            color: "white",
                                            borderRadius: 10,
                                            textDecoration: "none",
                                            fontWeight: 700,
                                            fontSize: "0.9rem",
                                            letterSpacing: "1px",
                                            textTransform: "uppercase"
                                        }}>
                                            Completar Postulación
                                        </a>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ── MIS VOTOS (VOTER) ── */}
                {activeTab === "mis-votos" && (
                    <VoterVotesView votes={voterVotes} />
                )}

                {/* ── MISIONES ── */}
                {activeTab === "misiones" && (
                    <div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 28, color: "white" }}>
                            🎯 Misiones y <span style={{ color: "#f5245f" }}>Metas de Venta</span>
                        </h2>

                        {candidate && (
                            <div style={{ marginBottom: 40 }}>
                                <TicketSalesMeta 
                                    candidateId={candidate.id} 
                                    candidateName={candidate.fullName} 
                                />
                            </div>
                        )}

                        {/* Stats */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                            {[
                                { label: "Total Ranking", value: candidate?.points || 0, accent: true },
                                { label: "Pts. Misiones", value: candidate?.taskPoints || 0, accent: false },
                                { label: "Sponsors", value: candidate?.sponsors?.length || 0, accent: false },
                            ].map(({ label, value, accent }) => (
                                <div key={label} className="profile-stat-card">
                                    <div className="profile-stat-label">{label}</div>
                                    <div className={`profile-stat-value ${accent ? "accent" : ""}`}>{value.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>

                        {/* Mission CTA */}
                        <Link href="/dashboard/missions" style={{ textDecoration: "none" }}>
                            <div className="profile-card" style={{
                                background: "linear-gradient(135deg, #111 0%, #050505 100%)",
                                border: "2px solid #C8FF0B",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 24,
                                cursor: "pointer",
                                boxShadow: "0 0 20px rgba(200, 255, 11, 0.1)"
                            }}>
                                <div>
                                    <h3 style={{ fontSize: "1.1rem", fontWeight: 900, marginBottom: 6, color: "white" }}>
                                        🎯 Gestionar Misiones
                                    </h3>
                                    <p style={{ fontSize: "0.8rem", color: "#888" }}>
                                        Envía tus reportes y adjunta pruebas para ganar puntos.
                                    </p>
                                </div>
                                <div style={{ background: "#C8FF0B", color: "black", padding: "10px 20px", borderRadius: 8, fontWeight: 900, fontSize: "0.8rem", flexShrink: 0 }}>
                                    REPORTAR AHORA
                                </div>
                            </div>
                        </Link>

                        {/* Recent Missions List */}
                        <div style={{ marginBottom: 30 }}>
                            <h4 style={{ fontSize: "0.8rem", color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
                                Desafíos Activos / Misiones Sociales
                            </h4>
                            
                            {loadingMissions ? (
                                <div style={{ color: "#444", fontSize: "0.85rem", padding: "20px", textAlign: "center" }}>Cargando desafíos...</div>
                            ) : missionError ? (
                                <div style={{ color: "#f87171", fontSize: "0.85rem", padding: "20px", border: "1px dashed #f87171", borderRadius: 16, textAlign: "center" }}>
                                    ⚠️ {missionError}
                                </div>
                            ) : missions.length > 0 ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {missions.slice(0, 5).map((m: any) => {
                                        const hasApproved = m.submissions?.some((s: any) => s.status === "APPROVED");
                                        const hasPending = m.submissions?.some((s: any) => s.status === "PENDING");

                                        return (
                                            <div key={m.id} style={{ 
                                                background: "rgba(255,255,255,0.02)", 
                                                border: "1px solid #222", 
                                                borderRadius: 16, 
                                                padding: "16px 20px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center"
                                            }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "white", marginBottom: 4 }}>{m.title}</div>
                                                    <div style={{ fontSize: "0.75rem", color: "#666", display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ color: "#C8FF0B", fontWeight: "900" }}>+{m.points} PTS</span>
                                                        <span>•</span>
                                                        <span>{m.platform}</span>
                                                    </div>
                                                </div>
                                                <div style={{ 
                                                    fontSize: "0.7rem", 
                                                    fontWeight: "900", 
                                                    padding: "5px 10px", 
                                                    borderRadius: 6, 
                                                    textTransform: "uppercase",
                                                    background: hasApproved ? "rgba(200, 255, 11, 0.1)" : hasPending ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.05)",
                                                    color: hasApproved ? "#C8FF0B" : hasPending ? "#3b82f6" : "#444",
                                                    border: `1px solid ${hasApproved ? "rgba(200, 255, 11, 0.2)" : hasPending ? "rgba(59, 130, 246, 0.2)" : "transparent"}`
                                                }}>
                                                    {hasApproved ? "Completado" : hasPending ? "En Revisión" : "Disponible"}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {missions.length > 5 && (
                                        <Link href="/dashboard/missions" style={{ textAlign: "center", color: "#C8FF0B", fontSize: "0.8rem", textDecoration: "none", marginTop: 10 }}>
                                            Ver las {missions.length} misiones completas →
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div style={{ color: "#444", fontSize: "0.85rem", padding: "20px", border: "1px dashed #222", borderRadius: 16, textAlign: "center" }}>
                                    No hay misiones disponibles en este momento.
                                </div>
                            )}
                        </div>

                        {/* Benefits */}
                        <div className="profile-card" style={{ border: "1px solid rgba(245,36,95,0.3)", background: "rgba(245,36,95,0.04)" }}>
                            <h3 style={{ fontSize: "0.9rem", fontWeight: 900, marginBottom: 16, color: "var(--accent-pink)", textTransform: "uppercase" }}>
                                💎 Beneficios de Candidata
                            </h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                                {["✨ Clases de Pasarela", "📸 Portafolio Fotos", "🎬 Portafolio Video", "🤝 Networking Marcas", "📜 Certificados RSE", "👑 Proyección Nacional"].map(b => (
                                    <div key={b} style={{ fontSize: "0.8rem", color: "#bbb", padding: "6px 0" }}>{b}</div>
                                ))}
                            </div>
                            <Link href="/beneficios" style={{
                                display: "block",
                                textAlign: "center",
                                padding: "11px",
                                background: "var(--accent-pink)",
                                color: "white",
                                borderRadius: 8,
                                textDecoration: "none",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                letterSpacing: "0.5px"
                            }}>
                                VER TODOS LOS BENEFICIOS
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── EMBAJADORAS ── */}
                {activeTab === "embajadoras" && candidate && (
                    <div>
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                                <span style={{ fontSize: "1.8rem" }}>💎</span>
                                <div>
                                    <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: "white", margin: 0 }}>
                                        PROGRAMA DE EMBAJADORAS
                                    </h2>
                                    <p style={{ fontSize: "0.78rem", color: "#555", margin: 0, marginTop: 4 }}>
                                        Accede a beneficios exclusivos como embajadora de marca oficial
                                    </p>
                                </div>
                            </div>
                        </div>
                        <BrandAmbassadorProgram
                            accepted={candidate.brandAmbassadorAccepted}
                            acceptedAt={candidate.brandAmbassadorAcceptedAt}
                            candidateId={candidate.id}
                        />
                    </div>
                )}

                {/* ── COMUNIDAD ── */}
                {activeTab === "comunidad" && candidate && (
                    <div>
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                                <span style={{ fontSize: "1.8rem" }}>🌟</span>
                                <div>
                                    <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", color: "white", margin: 0 }}>
                                        Red de Candidatas
                                    </h2>
                                    <p style={{ fontSize: "0.78rem", color: "#555", margin: 0, marginTop: 4 }}>
                                        Invita a otras chicas y crece junto a tu comunidad Miss Universe
                                    </p>
                                </div>
                            </div>
                        </div>
                        <ReferralProgram
                            accepted={candidate.referralProgramAccepted}
                            acceptedAt={candidate.referralProgramAcceptedAt}
                            candidateId={candidate.id}
                            cityName={cityName}
                        />
                    </div>
                )}

                {/* ── ANUNCIOS ── */}
                {activeTab === "anuncios" && (
                    <div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 28, color: "white" }}>
                            📣 Anuncios Oficiales
                        </h2>
                        <div className="ann-list">
                            {announcements.length > 0 ? announcements.map((ann: any) => (
                                <div key={ann.id} className="ann-item">
                                    <div className="ann-item-title">{ann.title}</div>
                                    <div className="ann-item-body">{ann.content}</div>
                                    <div className="ann-item-date">
                                        {new Date(ann.createdAt).toLocaleDateString("es-CL", { day: "numeric", month: "long" })}
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: "40px", textAlign: "center", color: "#444", border: "1px dashed #222", borderRadius: 10 }}>
                                    No hay anuncios por el momento.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── MENSAJES ── */}
                {activeTab === "mensajes" && (
                    <div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 28, color: "white" }}>
                            💬 Chat con la Organización
                        </h2>
                        {adminUserId ? (
                            <div className="profile-card">
                                <DirectChat
                                    peerId={adminUserId}
                                    peerName={adminUserName}
                                    currentUserId={userId}
                                />
                            </div>
                        ) : (
                            <div style={{ padding: "40px", textAlign: "center", color: "#444" }}>
                                Chat no disponible en este momento.
                            </div>
                        )}
                    </div>
                )}

                {/* ── GUÍA OFICIAL ── */}
                {activeTab === "guia" && (
                    <div>
                        <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 28, color: "white" }}>
                            📖 Guía Oficial del Certamen
                        </h2>
                        <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "30px", textAlign: "center" }}>
                            <div style={{ fontSize: "3rem", marginBottom: 16 }}>📖</div>
                            <p style={{ color: "#aaa", marginBottom: 20, lineHeight: 1.7, maxWidth: 400, margin: "0 auto 20px" }}>
                                Accede a la guía completa de todos los sistemas activos de Miss Universo Iquique. Incluye niveles, puntos, votación, referidos, embajadoras y más.
                            </p>
                            <Link href="/dashboard/guia" style={{
                                display: "inline-block",
                                padding: "14px 32px",
                                background: "linear-gradient(135deg, #C8FF0B, #a0d400)",
                                color: "black",
                                borderRadius: 10,
                                textDecoration: "none",
                                fontWeight: 900,
                                fontSize: "0.9rem",
                                letterSpacing: "1px",
                                textTransform: "uppercase"
                            }}>
                                Ver Guía Completa
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── ANÁLISIS DE VOTOS ── */}
                {activeTab === "analisis" && isAnalyticsUnlocked && candidate && (
                    <CandidateVoteAnalytics candidateId={candidate.id} />
                )}

            </DashboardShell>
        </>
    );
}
