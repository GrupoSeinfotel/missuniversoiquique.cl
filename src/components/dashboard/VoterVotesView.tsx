"use client";

interface VoterVotesViewProps {
    votes: any[];
}

export default function VoterVotesView({ votes }: VoterVotesViewProps) {
    if (votes.length === 0) {
        return (
            <div style={{
                padding: "60px 20px",
                textAlign: "center",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "15px",
                border: "1px dashed rgba(255,255,255,0.1)"
            }}>
                <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🗳️</div>
                <h3 style={{ color: "white", marginBottom: "10px" }}>Aún no has emitido votos</h3>
                <p style={{ color: "#888", fontSize: "0.9rem" }}>Apoya a tus candidatas favoritas para ver tu historial aquí.</p>
                <a href="/ranking-candidatas" style={{
                    display: "inline-block",
                    marginTop: "25px",
                    padding: "12px 25px",
                    background: "var(--accent-pink)",
                    color: "white",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "0.85rem"
                }}>
                    IR A VOTAR
                </a>
            </div>
        );
    }

    return (
        <div className="voter-votes-container">
            <h2 style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", marginBottom: 28, color: "white" }}>
                🗳️ Mis <span style={{ color: "var(--accent-pink)" }}>Votos Emitidos</span>
            </h2>

            <div className="votes-grid" style={{ display: "grid", gap: "15px" }}>
                {votes.map((vote) => (
                    <div key={vote.id} style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px"
                    }}>
                        <div>
                            <div style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "4px" }}>Candidata Apoyada</div>
                            <div style={{ color: "white", fontWeight: "bold", fontSize: "1rem" }}>{vote.candidateName}</div>
                        </div>

                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "4px" }}>Cantidad</div>
                            <div style={{
                                color: "var(--accent-pink)",
                                fontWeight: "900",
                                fontSize: "1.2rem",
                                textShadow: "0 0 10px rgba(245,36,95,0.3)"
                            }}>
                                {vote.amount > 0 ? `+${vote.amount}` : "1"}
                            </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#888", fontSize: "0.7rem", textTransform: "uppercase", marginBottom: "4px" }}>Tipo / Fecha</div>
                            <div style={{ color: "white", fontSize: "0.85rem", fontWeight: "500" }}>
                                {vote.type === "PAID" ? "💎 PREMIUM" : "✨ LIBRE"}
                            </div>
                            <div style={{ color: "#555", fontSize: "0.75rem", marginTop: "2px" }}>
                                {new Date(vote.createdAt).toLocaleDateString("es-CL")}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
