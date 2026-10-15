import prisma from "@/lib/db";

import Link from "next/link";
import { calculateGrowthEngagement } from "@/lib/engagement";
import { isFeatureUnlocked } from "@/lib/gamification";

export default async function ModelGridExact() {
    try {
        const dbCandidates = await prisma.candidate.findMany({
            where: { status: "APPROVED" },
            select: {
                id: true,
                fullName: true,
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
                    select: { url: true }
                },
                user: {
                    select: { id: true, slug: true }
                }
            }
        });

        // Fetch vote statistics (Count FREE, Sum PAID)
        const voteStats = await prisma.vote.groupBy({
            by: ['candidateId', 'type'],
            _sum: {
                amount: true
            },
            _count: {
                id: true
            }
        });

        const candidates = dbCandidates.map((candidate) => {
            const stats = voteStats.filter(v => v.candidateId === candidate.id);

            const freeVotes = stats.find(s => s.type === 'FREE')?._sum.amount || 0;
            const paidVotes = stats.find(s => s.type === 'PAID')?._sum.amount || 0;

            const growthVotes = calculateGrowthEngagement(
                candidate.growthBaseVotes || 0,
                candidate.growthRate || 0,
                candidate.growthStartDate || candidate.createdAt
            );

            const totalVotes = freeVotes + paidVotes + (candidate.importedVotes || 0) + (candidate.taskPoints || 0) + growthVotes;
            const gamificationPoints = totalVotes; // gamification relies on the real total map
            const hasGridPriority = isFeatureUnlocked(gamificationPoints, "Prioridad en Listas");

            return {
                ...candidate,
                totalVotes: Math.floor(totalVotes),
                hasGridPriority
            };
        }).sort((a, b) => b.totalVotes - a.totalVotes);


        return (
            <section id="models" className="section-padding" style={{ background: "var(--primary-bg)", minHeight: "600px" }}>
                <div className="container">
                    <div style={{ textAlign: "center", marginBottom: "60px" }}>
                        <h4 className="serif-italic accent-text" style={{ fontSize: "1.4rem", marginBottom: "15px" }}>Selección Oficial</h4>
                        <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "5px", marginBottom: "20px" }}>
                            NUESTRAS <span className="accent-text">CANDIDATAS</span>
                        </h2>
                        <p style={{ maxWidth: "600px", margin: "0 auto", color: "var(--text-gray)", lineHeight: "1.6" }}>
                            Conoce a las mujeres que representan el talento, la inteligencia y la belleza de la región de Tarapacá.
                        </p>
                        <div style={{ width: "60px", height: "1px", background: "var(--accent-pink)", margin: "40px auto" }}></div>
                    </div>

                    <div className="model-grid-container">
                        {candidates.map((candidate) => (
                            <Link href={`/candidata/${candidate.user.slug || candidate.user.id}`} key={candidate.id} style={{ textDecoration: "none", display: "block" }}>
                                <div className="model-card-exact">
                                    {/* Photo */}
                                    <div style={{
                                        width: "100%",
                                        height: "100%",
                                        background: `url(${candidate.photos[0]?.url || '/placeholder-model.jpg'}) center/cover no-repeat`,
                                        transition: "transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)"
                                    }} className="model-image"></div>

                                    {/* Overlay / Caption */}
                                    <div className="model-overlay-exact">
                                        <div className="model-info-exact">
                                            <h3 style={{
                                                fontSize: "24px",
                                                textTransform: "uppercase",
                                                margin: 0,
                                                color: "white",
                                                letterSpacing: "2px",
                                                fontWeight: "300"
                                            }}>
                                                {candidate.fullName.split(' ')[0]} <br />
                                                <span style={{ fontWeight: "700" }}>{candidate.fullName.split(' ').slice(1).join(' ')}</span>
                                            </h3>
                                            <div className="model-line-exact"></div>
                                            <p style={{
                                                fontSize: "11px",
                                                color: "rgba(255,255,255,0.6)",
                                                margin: "15px 0 0 0",
                                                textTransform: "uppercase",
                                                letterSpacing: "3px"
                                            }}>Candidata 2026</p>
                                        </div>
                                    </div>
                                    
                                    {candidate.hasGridPriority && (
                                        <div style={{
                                            position: "absolute",
                                            top: "20px",
                                            left: "20px",
                                            background: "rgba(251, 191, 36, 0.9)",
                                            color: "black",
                                            padding: "5px 12px",
                                            fontSize: "9px",
                                            fontWeight: "900",
                                            letterSpacing: "2px",
                                            textTransform: "uppercase",
                                            borderRadius: "4px",
                                            boxShadow: "0 4px 15px rgba(251, 191, 36, 0.4)",
                                            zIndex: 10
                                        }}>
                                            Destacada
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}

                        {/* Empty Slots for aesthetic if less than 4 */}
                        {[...Array(Math.max(0, 4 - candidates.length))].map((_, i) => (
                            <div key={i} className="empty-slot">
                                <span style={{ color: "#222", fontSize: "10px", letterSpacing: "5px", textTransform: "uppercase" }}>Próximamente</span>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        );
    } catch (error: any) {
        return (
            <section style={{ padding: "100px 0", textAlign: "center", background: "var(--primary-bg)" }}>
                <p style={{ color: "var(--accent-pink)" }}>Error al cargar candidatas. Por favor, intenta más tarde.</p>
                {process.env.NODE_ENV !== 'production' && <p style={{ fontSize: '10px' }}>{error.message}</p>}
            </section>
        );
    }
}
