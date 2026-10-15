import prisma from "@/lib/db";
import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import { FaCrown, FaUser } from "react-icons/fa";
import "./Leaderboard.css";

// Helper to mask email
function maskEmail(email: string) {
    if (!email) return "Anónimo";
    const [name, domain] = email.split("@");
    if (name.length <= 3) return `${name}***@${domain}`;
    return `${name.substring(0, 3)}***@${domain}`;
}



export default async function LeaderboardPage() {
    // 1. Group votes by email (covering both Registered Users and Guests)
    // We filter for legit PAID/PREMIUM votes.
    const groupedVotes = await prisma.vote.groupBy({
        by: ['guestEmail'],
        _sum: {
            amount: true
        },
        where: {
            type: { in: ["PAID", "PREMIUM", "LEGACY_PREMIUM"] },
            guestEmail: { not: null }
        },
        orderBy: {
            _sum: {
                amount: 'desc'
            }
        },
        take: 50
    });

    // 2. Transform data
    // We try to find if there is a User for this email to show username if possible
    // For now, simpler to just use email for everyone and mask it.
    // If we want usernames, we'd need to fetch Users matching these emails.
    const emails = groupedVotes.map(g => g.guestEmail).filter(e => e !== null) as string[];

    const users = await prisma.user.findMany({
        where: { email: { in: emails } },
        select: { email: true, username: true }
    });

    const leaderboard = groupedVotes.map((entry, index) => {
        const user = users.find(u => u.email === entry.guestEmail);
        // Use username if exists (and looks like a username, not auto-generated which often contains @ or random chars)
        // Our auto-generated username is "email_random".
        // Let's stick to Masked Email for privacy unless they changed their username?
        // Actually, "Reyes de la Corona" implies fame. Maybe show partial name?
        // Let's show Masked Email for safety v1.

        let displayName = maskEmail(entry.guestEmail!);
        if (user && user.username && !user.username.includes("@") && !user.username.includes("_")) {
            // If they customized username (assuming we had profile edit), we'd show it.
            // But currently auto-gen is "email_random".
            // So let's stick to masked email.
        }

        return {
            rank: index + 1,
            name: displayName,
            votes: entry._sum.amount || 0,
            avatar: null // Could fetch avatar if user has one
        };
    });

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3, 50); // Show up to 50

    return (
        <div className="leaderboard-page">
            <HeaderExact />

            <div className="leaderboard-hero">
                <h1 className="leaderboard-title">Votos VIP</h1>
                <p className="leaderboard-subtitle">Nuestros Votantes VIP más destacados</p>
                <div style={{
                    maxWidth: '800px',
                    margin: '20px auto',
                    padding: '20px',
                    background: 'rgba(223, 192, 109, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(223, 192, 109, 0.3)',
                    color: '#dfc06d'
                }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '10px' }}>
                        ¡Sé parte de la realeza y apoya a tu candidata favorita!
                    </p>
                    <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                        <p>Incentivamos a nuestros votantes a ser parte del club VIP exclusivo.</p>
                        <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Premios para nuestra Realeza VIP:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                            <div>
                                <p style={{ color: '#C8FF0B', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>🥇 1ER LUGAR (TOP 1)</p>
                                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem' }}>
                                    <li style={{ marginBottom: '5px' }}>🎟️ ENTRADA PLATINUM (Ubicación preferencial).</li>
                                    <li style={{ marginBottom: '5px' }}>📸 EXPERIENCIA MEET & GREET con la nueva Reina o con su Candidata que Apoyo.</li>
                                    <li style={{ marginBottom: '5px' }}>👑 CORONA OFICIAL "Gran Votante VIP 2026".</li>
                                </ul>
                            </div>
                            <div>
                                <p style={{ color: '#eee', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '8px' }}>🥈 2DO LUGAR (TOP 2)</p>
                                <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85rem' }}>
                                    <li style={{ marginBottom: '5px' }}>🎟️ ENTRADA PLATINUM (Ubicación preferencial).</li>
                                    <li style={{ marginBottom: '5px' }}>🎖️ INSIGNIA "Votante de Honor 2026".</li>
                                    <li style={{ marginBottom: '5px' }}>✨ Reconocimiento especial en el sitio web.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="leaderboard-container">
                {/* TOP 3 PODIUM */}
                <div className="top-three">
                    {/* 2nd Place */}
                    {top3[1] && (
                        <div className="rank-card rank-2">
                            <FaCrown className="crown-icon" />
                            <div className="voter-avatar"><FaUser /></div>
                            <div className="voter-name">{top3[1].name}</div>
                            <div className="vote-count">{top3[1].votes} Votos</div>
                        </div>
                    )}

                    {/* 1st Place */}
                    {top3[0] && (
                        <div className="rank-card rank-1">
                            <FaCrown className="crown-icon" />
                            <div className="voter-avatar"><FaUser /></div>
                            <div className="voter-name" style={{ fontSize: "1.3rem" }}>{top3[0].name}</div>
                            <div className="vote-count" style={{ fontSize: "1.5rem" }}>{top3[0].votes} Votos</div>
                        </div>
                    )}

                    {/* 3rd Place */}
                    {top3[2] && (
                        <div className="rank-card rank-3">
                            <FaCrown className="crown-icon" />
                            <div className="voter-avatar"><FaUser /></div>
                            <div className="voter-name">{top3[2].name}</div>
                            <div className="vote-count">{top3[2].votes} Votos</div>
                        </div>
                    )}
                </div>

                {/* LIST */}
                <div className="rank-list">
                    {rest.map((voter) => (
                        <div key={voter.rank} className="rank-row">
                            <div className="rank-number">{voter.rank}</div>
                            <div className="voter-avatar" style={{ width: 30, height: 30, fontSize: 14, marginRight: 15 }}><FaUser /></div>
                            <h3 className="voter-name">{voter.name}</h3>
                            <div className="vote-count">{voter.votes}</div>
                        </div>
                    ))}
                </div>

                {leaderboard.length === 0 && (
                    <div style={{ textAlign: "center", padding: "50px", color: "#666" }}>
                        Aún no hay votantes VIP coronados. ¡Sé el primero!
                    </div>
                )}
            </div>

            <FooterExact />
        </div>
    );
}
