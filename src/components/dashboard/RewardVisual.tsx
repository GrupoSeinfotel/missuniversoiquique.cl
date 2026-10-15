
"use client";
import { useEffect } from "react";
import { FaTrophy, FaTimes, FaStar } from "react-icons/fa";
import confetti from "canvas-confetti";

interface Props {
    candidateName: string;
    points: number;
    message: string;
    onClose: () => void;
}

export default function RewardVisual({ candidateName, points, message, onClose }: Props) {
    useEffect(() => {
        // Trigger confetti when visual appears
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#C8FF0B", "#F5245F", "#FFD700"]
        });
    }, []);

    return (
        <div style={overlayStyle}>
            <div className="reward-card-container" style={cardContainerStyle}>
                {/* Background Glows */}
                <div style={glowStyle1}></div>
                <div style={glowStyle2}></div>

                <button onClick={onClose} style={closeButtonStyle}>
                    <FaTimes />
                </button>

                <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={trophyCircleStyle}>
                        <FaTrophy style={{ fontSize: "2.5rem", color: "#C8FF0B" }} />
                    </div>

                    <h2 style={titleStyle}>¡FELICIDADES {candidateName.split(" ")[0].toUpperCase()}!</h2>

                    <div style={pointsContainerStyle}>
                        <span style={pointsValueStyle}>+{points}</span>
                        <span style={pointsLabelStyle}>PUNTOS PREMIO</span>
                    </div>

                    <div style={messageBoxStyle}>
                        <p style={messageTextStyle}>
                            "{message}"
                        </p>
                    </div>

                    <div style={footerStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#C8FF0B" }}>
                            <FaStar /> <FaStar /> <FaStar />
                        </div>
                        <p style={{ fontSize: "10px", color: "#666", margin: "10px 0 0" }}>
                            ORGANIZACIÓN MISS UNIVERSO
                        </p>
                    </div>

                    <button onClick={onClose} style={claimButtonStyle}>
                        ¡EXCELENTE! ✨
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .reward-card-container {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.92)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99999,
    backdropFilter: "blur(15px)"
};

const cardContainerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #111 0%, #050505 100%)",
    border: "2px solid #C8FF0B",
    padding: "40px",
    borderRadius: "30px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 0 100px rgba(200, 255, 11, 0.2)"
};

const glowStyle1: React.CSSProperties = {
    position: "absolute",
    top: "-100px",
    right: "-100px",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, rgba(200, 255, 11, 0.15) 0%, transparent 70%)",
    filter: "blur(40px)"
};

const glowStyle2: React.CSSProperties = {
    position: "absolute",
    bottom: "-100px",
    left: "-100px",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, rgba(245, 36, 95, 0.15) 0%, transparent 70%)",
    filter: "blur(40px)"
};

const closeButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "rgba(255,255,255,0.05)",
    border: "none",
    color: "#444",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    zIndex: 2
};

const trophyCircleStyle: React.CSSProperties = {
    width: "100px",
    height: "100px",
    background: "rgba(200, 255, 11, 0.05)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 25px",
    border: "1px solid rgba(200, 255, 11, 0.2)"
};

const titleStyle: React.CSSProperties = {
    fontSize: "1.4rem",
    fontWeight: 900,
    color: "white",
    letterSpacing: "4px",
    marginBottom: "20px"
};

const pointsContainerStyle: React.CSSProperties = {
    margin: "30px 0",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
};

const pointsValueStyle: React.CSSProperties = {
    fontSize: "4.5rem",
    fontWeight: 900,
    color: "#C8FF0B",
    lineHeight: 1,
    textShadow: "0 0 30px rgba(200, 255, 11, 0.3)"
};

const pointsLabelStyle: React.CSSProperties = {
    fontSize: "0.8rem",
    color: "#888",
    letterSpacing: "2px",
    fontWeight: "bold"
};

const messageBoxStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    padding: "20px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.05)",
    margin: "30px 0"
};

const messageTextStyle: React.CSSProperties = {
    color: "#bbb",
    fontSize: "1rem",
    fontStyle: "italic",
    lineHeight: "1.6",
    margin: 0
};

const footerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px"
};

const claimButtonStyle: React.CSSProperties = {
    marginTop: "30px",
    width: "100%",
    padding: "16px",
    background: "var(--accent-pink)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "900",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 10px 20px rgba(245, 36, 95, 0.3)"
};
