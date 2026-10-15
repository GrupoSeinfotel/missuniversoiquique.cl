import prisma from "@/lib/db";
import UltimateVideoPlayer from "@/components/ui/UltimateVideoPlayer";
import { notFound } from "next/navigation";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import CandidateGallery from "@/components/candidate/CandidateGallery";
import PremiumVoteButton from "@/components/candidate/PremiumVoteButton";
import FreeVoteButton from "@/components/candidate/FreeVoteButton";
import ShareProfileButton from "@/components/candidate/ShareProfileButton";
import { Metadata } from "next";
import { calculateGrowthEngagement } from "@/lib/engagement";
import { FaFacebookF, FaInstagram, FaTiktok, FaShieldAlt, FaFingerprint, FaNetworkWired, FaTicketAlt } from "react-icons/fa";
import { lucia } from "@/lib/auth";
// cookies removed for static export
import { getLevelData, isFeatureUnlocked } from "@/lib/gamification";
import LevelBadge from "@/components/dashboard/LevelBadge";
import { FaCheckCircle, FaHeart } from "react-icons/fa";

export async function generateStaticParams() {
    const candidates = await prisma.user.findMany({
        where: { role: "CANDIDATE" },
        select: { slug: true, id: true }
    });
    return candidates.map((candidate) => ({
        slug: candidate.slug || candidate.id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { slug: slug },
                { id: slug }
            ]
        },
        select: {
            id: true,
            email: true,
            slug: true,
            candidate: {
                select: {
                    fullName: true,
                    photos: {
                        select: {
                            url: true,
                            isMain: true,
                            type: true
                        }
                    }
                }
            }
        }
    });

    if (!user || !user.candidate) return { title: "Candidata no encontrada" };

    const candidate = user.candidate;
    const ogImage = candidate.photos.find(p => p.isMain)?.url || candidate.photos.find(p => p.type === "PROFILE")?.url || candidate.photos[0]?.url;

    return {
        title: candidate.fullName,
        description: `Conoce a ${candidate.fullName}, candidata oficial a Miss Universe Iquique 2026. Apóyala con tu voto y descubre su portfolio.`,
        openGraph: {
            images: ogImage ? [ogImage] : [],
        },
    };
}

export default async function CandidateProfile({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { slug: slug },
                { id: slug }
            ]
        },
        include: {
            candidate: {
                select: {
                    id: true,
                    userId: true,
                    fullName: true,
                    birthDate: true,
                    height: true,
                    bio: true,
                    videoPitchUrl: true,
                    instagram: true,
                    tiktok: true,
                    facebook: true,
                    whatsapp: true,
                    eyeColor: true,
                    hairColor: true,
                    education: true,
                    occupation: true,
                    hobbies: true,
                    bust: true,
                    waist: true,
                    hips: true,
                    shoeSize: true,
                    clothesSize: true,
                    points: true,
                    taskPoints: true,
                    status: true,
                    paymentStatus: true,
                    paidAmount: true,
                    paymentProofUrl: true,
                    bypassPayment: true,
                    growthBaseVotes: true,
                    growthRate: true,
                    growthStartDate: true,
                    importedVotes: true,
                    createdAt: true,
                    brandAmbassadorAccepted: true,
                    referralProgramAccepted: true,
                    photos: true,
                    sponsors: { where: { status: "APPROVED" } },
                    missionSubmissions: {
                        where: { status: "APPROVED" },
                        include: { mission: true }
                    }
                }
            }
        }
    });

    if (!user || !user.candidate) notFound();

    const candidate = user.candidate;
    const profilePhoto = candidate.photos.find(p => p.isMain)?.url || candidate.photos.find(p => p.type === "PROFILE")?.url || candidate.photos[0]?.url;

    // auth checks removed for static export
    const currentUser = null;
    const isOwner = false;

    const bannedIps = await prisma.bannedIp.findMany({ select: { ip: true } });
    const bannedIpList = bannedIps.map(b => b.ip);

    const voteStats = await prisma.vote.groupBy({
        by: ['type'],
        where: { 
            candidateId: candidate.id,
            ipAddress: { notIn: bannedIpList }
        },
        _sum: { amount: true },
        _count: { id: true },
    });
    const freeVotes = voteStats.find(s => s.type === 'FREE')?._sum.amount || 0;
    const paidVotes = voteStats.find(s => s.type === 'PAID')?._sum.amount || 0;
    const growthVotes = calculateGrowthEngagement(
        candidate.growthBaseVotes || 0,
        candidate.growthRate || 0,
        candidate.growthStartDate || candidate.createdAt
    );

    // Tickets points
    const ticketStats = await prisma.ticket.groupBy({
        by: ['type'],
        where: { candidateId: candidate.id, status: 'PAID' },
        _count: { id: true }
    });
    const vipTickets = ticketStats.find(t => t.type === 'VIP')?._count.id || 0;
    const generalTickets = ticketStats.find(t => t.type === 'GENERAL')?._count.id || 0;
    const ticketPoints = (vipTickets * 200) + (generalTickets * 140);

    const totalVotes = Math.floor(freeVotes + paidVotes + (candidate.importedVotes || 0) + (candidate.taskPoints || 0) + growthVotes + ticketPoints);

    const gamificationPoints = (candidate.points || 0) + (candidate.taskPoints || 0);
    const levelData = getLevelData(gamificationPoints);

    const hasBadge = isFeatureUnlocked(gamificationPoints, "Badge de Verificación");
    const hasFilters = isFeatureUnlocked(gamificationPoints, "Filtros Fotográficos");
    const hasClickableSocial = isFeatureUnlocked(gamificationPoints, "Redes Clickeables");
    const hasFloatingButton = isFeatureUnlocked(gamificationPoints, "Botón Apóyame Persistente");

    return (
        <div className={`main-wrapper ${levelData.skinClass}`}>

            <HeaderExact />

            <main style={{ background: "var(--primary-bg)", color: "white", minHeight: "100vh" }}>
                <div style={{ height: "80px" }}></div>

                <div className="container profile-grid" style={{ padding: "40px 0" }}>
                    {candidate.paymentStatus === "UNPAID" && !candidate.bypassPayment && (
                        <div style={{
                            gridColumn: "1 / -1",
                            background: isOwner ? "rgba(255, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.03)",
                            border: isOwner ? "1px solid #ff4d4d" : "1px solid rgba(255, 255, 255, 0.1)",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "30px",
                            textAlign: "center",
                            color: isOwner ? "#ff8080" : "#888"
                        }}>
                            {isOwner ? (
                                <>
                                    <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                        ⚠️ Perfil en Revisión Administrativa
                                    </h3>
                                    <p style={{ fontSize: "14px", lineHeight: "1.6" }}>
                                        El sistema de votación para esta candidata se encuentra temporalmente inhabilitado por falta de abono de inscripción.
                                        <br />
                                        <strong>Nota a la candidata:</strong> Para activar tu sistema de votos, debes regularizar tu pago de inscripción con la organización.
                                    </p>
                                </>
                            ) : (
                                <p style={{ fontSize: "14px", fontStyle: "italic" }}>
                                    Sistema de votos no habilitado para esta candidata, consulte con la organización.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="profile-main">
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
                            {candidate.videoPitchUrl && (
                                <div className="profile-video-introduccion" style={{
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    border: "1px solid #222",
                                    position: "relative",
                                    background: "#000",
                                    width: "100%",
                                    maxWidth: "350px",
                                    margin: "0 auto",
                                    aspectRatio: "9/16"
                                }}>
                                    <UltimateVideoPlayer 
                                        src={candidate.videoPitchUrl}
                                        poster={candidate.photos.find(p => p.isMain)?.url || ""}
                                    />
                                    <div style={{
                                        position: "absolute",
                                        bottom: "20px",
                                        left: "20px",
                                        right: "20px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <a
                                            href="#voting-center"
                                            className="btn-apoyo-on-video"
                                            style={{
                                                background: "var(--accent-pink)",
                                                color: "white",
                                                textDecoration: "none",
                                                padding: "10px 20px",
                                                borderRadius: "30px",
                                                fontWeight: "900",
                                                fontSize: "12px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                boxShadow: "0 0 20px rgba(245, 36, 95, 0.4)"
                                            }}
                                        >
                                            ¡Apóyame Aquí! 👑
                                        </a>
                                    </div>
                                    <div style={{ position: "absolute", top: "15px", right: "15px", background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>
                                        Intro Oficial
                                    </div>
                                </div>
                            )}

                            {(() => {
                                const videoSub = candidate.missionSubmissions?.find(sub => {
                                    const url = sub.proofUrl?.toLowerCase() || "";
                                    return url.endsWith(".mp4") || url.endsWith(".mov") || url.endsWith(".webm") || url.includes("video");
                                });
                                if (!videoSub) return null;
                                return (
                                    <div className="profile-video-presentacion" style={{
                                        borderRadius: "12px",
                                        overflow: "hidden",
                                        border: "1px solid #222",
                                        position: "relative",
                                        background: "#000",
                                        width: "100%",
                                        maxWidth: "350px",
                                        margin: "0 auto",
                                        aspectRatio: "9/16"
                                    }}>
                                        <video
                                            src={videoSub.proofUrl!}
                                            loop
                                            playsInline
                                            controls
                                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        />
                                        <div style={{ position: "absolute", top: "15px", right: "15px", background: "rgba(0,0,0,0.6)", color: "white", padding: "4px 10px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold", textTransform: "uppercase" }}>
                                            Presentación
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                        <CandidateGallery photos={candidate.photos} fullName={candidate.fullName} />

                        <div style={{ borderTop: "1px solid #222", padding: "40px 0" }}>
                            <h3 style={{ fontSize: "24px", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "30px", color: "var(--accent-pink)" }}>Biografía</h3>
                            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--text-gray)", marginBottom: "40px" }}>
                                {candidate.bio}
                            </p>

                            <div className="info-subgrid">
                                <div>
                                    <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Educación</h4>
                                    <p style={{ fontSize: "14px", color: "var(--text-gray)", lineHeight: "1.6" }}>
                                        {candidate.education || "Información pendiente."}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Ocupación</h4>
                                    <p style={{ fontSize: "14px", color: "var(--text-gray)", lineHeight: "1.6" }}>
                                        {candidate.occupation || "Información pendiente."}
                                    </p>
                                </div>
                                {candidate.hobbies && (
                                    <div style={{ marginTop: "20px", gridColumn: "span 2" }}>
                                        <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>Hobbies</h4>
                                        <p style={{ fontSize: "14px", color: "var(--text-gray)", lineHeight: "1.6" }}>
                                            {candidate.hobbies}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <aside className="profile-sidebar">
                        <div className="sidebar-sticky">
                            <div className="card-inner" style={{ background: "#111", padding: "30px", border: "1px solid #222" }}>
                                <img
                                    src={profilePhoto}
                                    alt={candidate.fullName}
                                    style={{ 
                                        width: "100%", height: "auto", aspectRatio: "3/4", objectFit: "cover", marginBottom: "25px", borderRadius: "2px",
                                        filter: hasFilters ? "contrast(1.1) saturate(1.2)" : "none",
                                        boxShadow: hasFilters ? "0 0 20px rgba(255, 255, 255, 0.1)" : "none"
                                    }}
                                />
                                <h2 className="profile-name" style={{ fontSize: "28px", textTransform: "uppercase", marginBottom: "5px", lineHeight: 1.2, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                                    <span>
                                        {candidate.fullName.split(" ")[0]} <br />
                                        <span style={{ color: "var(--accent-pink)", fontWeight: "300" }}>{candidate.fullName.split(" ").slice(1).join(" ")}</span>
                                    </span>
                                    {hasBadge && (
                                        <FaCheckCircle style={{ color: "#3b82f6", fontSize: "22px", marginTop: "4px" }} title="Candidata Oficial Verificada" />
                                    )}
                                </h2>

                                <div style={{ marginTop: "15px", marginBottom: "5px" }}>
                                    <LevelBadge points={gamificationPoints} />
                                </div>

                                <div style={{ borderTop: "1px solid #333", marginTop: "20px", paddingTop: "20px" }}>
                                    <table className="measurement-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                                        <tbody>
                                            <tr style={{ borderBottom: "1px solid #222" }}>
                                                <td style={{ padding: "10px 0", color: "var(--text-gray)", fontSize: "11px", textTransform: "uppercase" }}>Estatura</td>
                                                <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold" }}>{candidate.height} CM</td>
                                            </tr>
                                            <tr style={{ borderBottom: "1px solid #222" }}>
                                                <td style={{ padding: "10px 0", color: "var(--text-gray)", fontSize: "11px", textTransform: "uppercase" }}>Cabello</td>
                                                <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold", textTransform: "uppercase" }}>{candidate.hairColor || "—"}</td>
                                            </tr>
                                            <tr style={{ borderBottom: "1px solid #222" }}>
                                                <td style={{ padding: "10px 0", color: "var(--text-gray)", fontSize: "11px", textTransform: "uppercase" }}>Ojos</td>
                                                <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold", textTransform: "uppercase" }}>{candidate.eyeColor || "—"}</td>
                                            </tr>
                                            <tr style={{ borderBottom: "1px solid #222" }}>
                                                <td style={{ padding: "10px 0", color: "var(--text-gray)", fontSize: "11px", textTransform: "uppercase" }}>Sede</td>
                                                <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold" }}>IQUIQUE OFICIAL</td>
                                            </tr>
                                            <tr style={{ borderBottom: "1px solid #222" }}>
                                                <td style={{ padding: "10px 0", color: "var(--accent-pink)", fontSize: "11px", textTransform: "uppercase", fontWeight: "bold" }}>Votos Populares</td>
                                                <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold", color: "var(--accent-pink)" }}>
                                                    {totalVotes.toLocaleString()}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div
                                id="voting-center"
                                style={{
                                    marginTop: "30px",
                                    background: "#0a0a0a",
                                    border: "1px solid #333",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    textAlign: "center"
                                }}>
                                <h3 style={{
                                    color: "white",
                                    fontSize: "14px",
                                    textTransform: "uppercase",
                                    letterSpacing: "2px",
                                    marginBottom: "5px"
                                }}>
                                    Centro de Votación
                                </h3>
                                <p style={{ fontSize: "11px", color: "#666", marginBottom: "20px" }}>
                                    Tu apoyo es fundamental para la clasificación.
                                </p>

                                {/* META DE ENTRADAS - Rediseño Legibilidad Premium */}
                                <div style={{ 
                                    background: "rgba(0,0,0,0.4)", 
                                    border: "1px solid rgba(245,36,95,0.3)", 
                                    borderRadius: "15px", 
                                    padding: "20px", 
                                    marginBottom: "25px",
                                    textAlign: "left",
                                    position: "relative",
                                    overflow: "hidden"
                                }}>
                                    <h4 style={{ color: "#f5245f", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <FaTicketAlt /> META DE ENTRADAS
                                    </h4>
                                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.9)", fontWeight: "500", lineHeight: "1.5", marginBottom: "15px" }}>
                                        Apoya comprando una entrada y sumaré <span style={{ color: "#dfc06d", fontWeight: "900" }}>140 puntos</span> (General) o <span style={{ color: "#dfc06d", fontWeight: "900" }}>200 puntos</span> (VIP).
                                    </p>
                                    <a href={`/?ref=${candidate.id}#entradas`} style={{
                                        display: "block",
                                        background: "linear-gradient(135deg, #f5245f, #9e0e41)",
                                        color: "white",
                                        textDecoration: "none",
                                        textAlign: "center",
                                        padding: "14px",
                                        borderRadius: "10px",
                                        fontWeight: "900",
                                        fontSize: "13px",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        boxShadow: "0 10px 20px rgba(245,36,95,0.3)",
                                        transition: "all 0.3s ease"
                                    }}>
                                        ¡Comprar mi entrada!
                                    </a>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <PremiumVoteButton
                                        candidateId={candidate.id}
                                        candidateName={candidate.fullName}
                                        disabled={candidate.paymentStatus === "UNPAID" && !candidate.bypassPayment}
                                    />
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "5px 0" }}>
                                        <div style={{ height: "1px", background: "#222", flex: 1 }} />
                                        <span style={{ fontSize: "10px", color: "#444" }}>O PODEMOS SER MAS LENTOS</span>
                                        <div style={{ height: "1px", background: "#222", flex: 1 }} />
                                    </div>
                                    <FreeVoteButton
                                        candidateId={candidate.id}
                                        disabled={candidate.paymentStatus === "UNPAID" && !candidate.bypassPayment}
                                    />

                                    <div style={{ marginTop: "20px", borderTop: "1px solid #222", paddingTop: "15px", textAlign: "left" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#00fff2", marginBottom: "10px", background: "rgba(0, 255, 242, 0.05)", padding: "8px", borderRadius: "6px", border: "1px solid rgba(0, 255, 242, 0.2)" }}>
                                            <FaShieldAlt size={16} />
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", lineHeight: "1" }}>
                                                    SISTEMA AUDITADO
                                                </span>
                                                <span style={{ fontSize: "8px", opacity: 0.7 }}>SEGURIDAD CRIPTOGRÁFICA</span>
                                            </div>
                                        </div>
                                        <div style={{ fontSize: "10px", color: "#aaa", lineHeight: "1.6", fontFamily: "monospace", display: "flex", flexDirection: "column", gap: "4px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <FaFingerprint size={12} color="#555" />
                                                <span>1 Voto Único x Dispositivo (Diario, Reset 00:00 CL)</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <FaNetworkWired size={12} color="#555" />
                                                <span>Máx 2 Votos por Red IP (Dispositivos Distintos)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #222" }}>
                                <ShareProfileButton slug={user.slug || ""} fullName={candidate.fullName} />

                                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                                    {candidate.instagram && (
                                        hasClickableSocial ? (
                                            <a href={`https://instagram.com/${candidate.instagram}`} target="_blank" className="social-btn" style={socialIconStyle}>
                                                <FaInstagram />
                                            </a>
                                        ) : (
                                            <div className="social-btn" style={{...socialIconStyle, cursor: "not-allowed", opacity: 0.6}} title="Desbloquea Redes Clickeables (Nivel 5)">
                                                <FaInstagram />
                                            </div>
                                        )
                                    )}
                                    {candidate.tiktok && (
                                        hasClickableSocial ? (
                                            <a href={`https://tiktok.com/@${candidate.tiktok}`} target="_blank" className="social-btn" style={socialIconStyle}>
                                                <FaTiktok />
                                            </a>
                                        ) : (
                                            <div className="social-btn" style={{...socialIconStyle, cursor: "not-allowed", opacity: 0.6}} title="Desbloquea Redes Clickeables (Nivel 5)">
                                                <FaTiktok />
                                            </div>
                                        )
                                    )}
                                    {candidate.facebook && (
                                        hasClickableSocial ? (
                                            <a href={candidate.facebook} target="_blank" className="social-btn" style={socialIconStyle}>
                                                <FaFacebookF />
                                            </a>
                                        ) : (
                                            <div className="social-btn" style={{...socialIconStyle, cursor: "not-allowed", opacity: 0.6}} title="Desbloquea Redes Clickeables (Nivel 5)">
                                                <FaFacebookF />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <FooterExact />

            {hasFloatingButton && (
                <a href="#voting-center" style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    background: "var(--accent-pink)",
                    color: "white",
                    padding: "15px 25px",
                    borderRadius: "50px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "900",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    boxShadow: "0 10px 30px rgba(245, 36, 95, 0.5)",
                    zIndex: 9999,
                    animation: "pulseBtn 2s infinite"
                }}>
                    <FaHeart /> Apóyame
                </a>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulseBtn {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 36, 95, 0.7); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(245, 36, 95, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 36, 95, 0); }
                }
            `}} />
        </div>
    );
}

const socialIconStyle = {
    flex: 1,
    textAlign: "center" as const,
    background: "#111",
    border: "1px solid #333",
    color: "white",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "18px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textDecoration: "none"
};
