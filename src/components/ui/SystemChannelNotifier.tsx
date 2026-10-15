"use client";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SystemChannelNotifier() {
    const [notification, setNotification] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial config (will be updated from API)
    const config = useRef({
        minDelay: 20,
        maxDelay: 90
    });

    const fetchAndShow = async () => {
        try {
            const res = await fetch("/api/public/notifications/system", { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();

            if (data.notification) {
                setNotification(data.notification);
                setVisible(true);

                // Hide after 6 seconds
                if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
                hideTimerRef.current = setTimeout(() => {
                    setVisible(false);
                }, 6000);
            }
        } catch (err) {
            console.error("Error in system notifier:", err);
        }
    };

    const scheduleNext = () => {
        const delay = (Math.random() * (config.current.maxDelay - config.current.minDelay) + config.current.minDelay) * 1000;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(async () => {
            await fetchAndShow();
            scheduleNext(); // Recursive call for next one
        }, delay);
    };

    useEffect(() => {
        // Fetch current settings for timing
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const min = data.find((s: any) => s.key === "NOTIF_MIN_DELAY")?.value;
                    const max = data.find((s: any) => s.key === "NOTIF_MAX_DELAY")?.value;
                    if (min) config.current.minDelay = parseInt(min);
                    if (max) config.current.maxDelay = parseInt(max);
                }

                // Start the cycle after a small initial random delay
                const initialDelay = 10000 + Math.random() * 5000;
                timerRef.current = setTimeout(() => {
                    scheduleNext();
                }, initialDelay);
            })
            .catch(err => {
                console.error("Error fetching notification settings", err);
                // Fallback start
                scheduleNext();
            });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && notification && (
                <motion.div
                    initial={{ x: -400, opacity: 0 }}
                    animate={{ x: 20, opacity: 1 }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    style={floatingStyle}
                >
                    <div style={imgWrapperStyle}>
                        {notification.imageUrl ? (
                            <img src={notification.imageUrl} style={imgStyle} alt="Notif" />
                        ) : (
                            <div style={{ ...imgStyle, background: 'var(--accent-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                {notification.type === 'voto' ? '✓' : '★'}
                            </div>
                        )}
                    </div>
                    <div style={textContainerStyle}>
                        <p style={messageStyle}>{notification.message}</p>
                        <p style={agoStyle}>Hace un momento</p>
                    </div>
                    <button onClick={() => setVisible(false)} style={closeButtonStyle}>×</button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const floatingStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    padding: "12px 18px",
    zIndex: 9999,
    width: "320px",
    border: "1px solid rgba(245, 36, 95, 0.2)",
};

const imgWrapperStyle: React.CSSProperties = {
    marginRight: "15px",
    flexShrink: 0
};

const imgStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid var(--accent-pink)"
};

const textContainerStyle: React.CSSProperties = {
    flex: 1
};

const messageStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "13px",
    color: "#111",
    fontWeight: "500",
    lineHeight: "1.4"
};

const agoStyle: React.CSSProperties = {
    margin: "3px 0 0 0",
    fontSize: "10px",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
};

const closeButtonStyle: React.CSSProperties = {
    marginLeft: "10px",
    background: "none",
    border: "none",
    color: "#ccc",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px"
};
