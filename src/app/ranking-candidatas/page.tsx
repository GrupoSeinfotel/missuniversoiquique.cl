import prisma from "@/lib/db";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import { FaCrown } from "react-icons/fa";
import { calculateGrowthEngagement } from "@/lib/engagement";
import Link from "next/link";
import VoteCountdown from "@/components/voting/VoteCountdown";
import "./Ranking.css";



export default async function CandidatesRankingPage() {
    // 1. Fetch ALL approved candidates
    const candidates = await prisma.candidate.findMany({
        where: { status: "APPROVED" },
        select: {
            id: true,
            fullName: true,
            status: true,
            growthBaseVotes: true,
            growthRate: true,
            growthStartDate: true,
            importedVotes: true,
            taskPoints: true,
            createdAt: true,
            photos: {
                orderBy: [
                    { isMain: 'desc' },
                    { createdAt: 'desc' }
                ],
                take: 1,
                select: {
                    url: true
                }
            },
            user: {
                select: {
                    slug: true,
                    id: true
                }
            }
        }
    });

    // 1.5 Fetch Banned IPs
    const bannedIps = await prisma.bannedIp.findMany({
        select: { ip: true }
    });
    const bannedIpList = bannedIps.map(b => b.ip);

    // 2. Fetch vote statistics (Count FREE, Sum PAID)
    const voteStats = await prisma.vote.groupBy({
        by: ['candidateId', 'type'],
        where: {
            ipAddress: {
                notIn: bannedIpList
            }
        },
        _sum: { amount: true },
        _count: { id: true }
    });

    // 2.5 Fetch ticket stats per candidate
    const ticketStats = await prisma.ticket.groupBy({
        by: ['candidateId', 'type'],
        where: { 
            status: "PAID",
            NOT: { candidateId: null }
        },
        _count: { id: true }
    });

    // 3. Map everything together (Real + Imported + Dynamic Growth)
    const ranking = candidates.map((candidate) => {
        const stats = voteStats.filter(v => v.candidateId === candidate.id);

        const freeVotes = stats.find(s => s.type === 'FREE')?._sum.amount || 0;
        const paidVotes = stats.find(s => s.type === 'PAID')?._sum.amount || 0;

        const growthVotes = calculateGrowthEngagement(
            candidate.growthBaseVotes || 0,
            candidate.growthRate || 0,
            candidate.growthStartDate || candidate.createdAt
        );

        // Calculate Ticket Points
        const tStats = ticketStats.filter(t => t.candidateId === candidate.id);
        const vipTickets = tStats.find(t => t.type === 'VIP')?._count.id || 0;
        const generalTickets = tStats.find(t => t.type === 'GENERAL')?._count.id || 0;
        const ticketPoints = (vipTickets * 360) + (generalTickets * 140);

        const totalVotes = freeVotes + paidVotes + (candidate.importedVotes || 0) + (candidate.taskPoints || 0) + growthVotes + ticketPoints;

        return {
            id: candidate.id,
            name: candidate.fullName,
            votes: Math.floor(totalVotes),
            photo: candidate.photos[0]?.url || "/placeholder-avatar.png",
            slug: candidate.user?.slug || null,
            userId: candidate.user?.id || null
        };
    })
        .sort((a, b) => b.votes - a.votes) // Sort by total votes
        .map((item, index) => ({ ...item, rank: index + 1 }));

    const top3 = ranking.slice(0, 3);
    const rest = ranking.slice(3);

    return (
        <div className="ranking-page">
            <HeaderExact />

            <div className="ranking-hero">
                <h1 className="ranking-title">Ranking Oficial</h1>
                <p className="ranking-subtitle">Participación y Respaldo del Público</p>
            </div>

            <div className="ranking-container">
                <VoteCountdown 
                    deadlineStr="2026-04-25T19:00:00-04:00" 
                    title="Cierre de Votación (Sábado 19:00)" 
                />

                {/* ── MISS VOTO POPULAR BANNER ── */}
                {top3[0] && (
                    <div style={{
                        background: "linear-gradient(135deg, rgba(30,20,0,0.95) 0%, rgba(15,10,0,0.98) 100%)",
                        border: "1px solid rgba(223,192,109,0.4)",
                        borderLeft: "4px solid #dfc06d",
                        borderRadius: "12px",
                        padding: "24px 28px",
                        marginBottom: "40px",
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}>
                        <div style={{ fontSize: "2.8rem", flexShrink: 0 }}>🎀</div>
                        <div style={{ flex: 1, minWidth: 220 }}>
                            <div style={{
                                fontSize: "0.6rem",
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                                color: "#dfc06d",
                                marginBottom: "6px",
                                fontWeight: 700
                            }}>Reconocimiento Especial</div>
                            <h3 style={{
                                fontSize: "1.3rem",
                                fontWeight: 900,
                                color: "white",
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                                margin: "0 0 8px 0"
                            }}>Banda Miss Voto Popular 2026</h3>
                            <p style={{ fontSize: "0.82rem", color: "#aaa", lineHeight: 1.7, margin: 0 }}>
                                La candidata que lidere este ranking al cierre del concurso recibe la
                                {" "}<strong style={{ color: "#dfc06d" }}>Banda Miss Voto Popular</strong>, un reconocimiento
                                honorífico exclusivo otorgado por el público, y obtiene un
                                {" "}<strong style={{ color: "#dfc06d" }}>cupo directo garantizado al TOP 5 de la Gala Final</strong>,
                                independiente de los resultados de la etapa clasificatoria.
                            </p>
                        </div>
                        <div style={{
                            background: "rgba(223,192,109,0.1)",
                            border: "1px solid rgba(223,192,109,0.3)",
                            borderRadius: "10px",
                            padding: "14px 20px",
                            textAlign: "center",
                            flexShrink: 0
                        }}>
                            <div style={{ fontSize: "0.6rem", color: "#888", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>Líder Actual</div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "#dfc06d", textTransform: "uppercase" }}>{top3[0].name}</div>
                            <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "white", marginTop: 2 }}>{top3[0].votes.toLocaleString()}</div>
                            <div style={{ fontSize: "0.6rem", color: "#555", letterSpacing: "1px" }}>VOTOS</div>
                        </div>
                    </div>
                )}

                {/* PODIUM */}
                <div className="podium">
                    {/* 2nd Place */}
                    {top3[1] && (
                        <Link href={`/candidata/${top3[1].slug || top3[1].userId}`} className="candidate-card pos-2">
                            <FaCrown className="crown-badge" />
                            <div className="candidate-img-wrapper">
                                <img src={top3[1].photo} alt={top3[1].name} className="candidate-img" />
                            </div>
                            <h2 className="candidate-name">{top3[1].name}</h2>
                            <div className="candidate-votes">{top3[1].votes}</div>
                            <span style={{ fontSize: '11px', color: '#666' }}>VOTOS</span>
                        </Link>
                    )}

                    {/* 1st Place - Miss Voto Popular */}
                    {top3[0] && (
                        <Link href={`/candidata/${top3[0].slug || top3[0].userId}`} className="candidate-card pos-1" style={{ position: 'relative', textDecoration: 'none' }}>
                            {/* Banda Miss Voto Popular */}
                            <div style={{
                                position: 'absolute',
                                top: '-14px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: 'linear-gradient(90deg, #dfc06d, #f5e090, #dfc06d)',
                                color: '#000',
                                fontSize: '0.5rem',
                                fontWeight: 900,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                whiteSpace: 'nowrap',
                                zIndex: 2,
                                boxShadow: '0 2px 12px rgba(223,192,109,0.5)'
                            }}>
                                🎀 Miss Voto Popular
                            </div>
                            <FaCrown className="crown-badge" />
                            <div className="candidate-img-wrapper">
                                <img src={top3[0].photo} alt={top3[0].name} className="candidate-img" />
                            </div>
                            <h2 className="candidate-name">{top3[0].name}</h2>
                            <div className="candidate-votes">{top3[0].votes.toLocaleString()}</div>
                            <span style={{ fontSize: '12px', color: '#888' }}>VOTOS</span>
                        </Link>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                        <Link href={`/candidata/${top3[2].slug || top3[2].userId}`} className="candidate-card pos-3">
                            <FaCrown className="crown-badge" />
                            <div className="candidate-img-wrapper">
                                <img src={top3[2].photo} alt={top3[2].name} className="candidate-img" />
                            </div>
                            <h2 className="candidate-name">{top3[2].name}</h2>
                            <div className="candidate-votes">{top3[2].votes}</div>
                            <span style={{ fontSize: '11px', color: '#666' }}>VOTOS</span>
                        </Link>
                    )}
                </div>

                {/* REST OF RANKING */}
                <div className="ranking-list">
                    {rest.map((c) => (
                        <Link href={`/candidata/${c.slug || c.userId}`} key={c.id} className="ranking-row" style={{ textDecoration: 'none' }}>
                            <div className="rank-num">#{c.rank}</div>
                            <img src={c.photo} alt={c.name} className="row-img" />
                            <div className="row-name">{c.name}</div>
                            <div className="row-votes">{c.votes}</div>
                        </Link>
                    ))}
                </div>

                {ranking.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#444' }}>
                        <p>Aún no se han registrado participaciones en esta competencia.</p>
                        <a href="/" style={{ color: '#dfc06d', textDecoration: 'underline' }}>Volver al Inicio</a>
                    </div>
                )}
            </div>

            <FooterExact />
        </div>
    );
}

