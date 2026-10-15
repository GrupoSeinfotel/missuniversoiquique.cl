"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return null;

    const items = [
        { label: "Días", value: timeLeft.days },
        { label: "Hrs", value: timeLeft.hours }, // Shortened labels for small mobile
        { label: "Min", value: timeLeft.minutes },
        { label: "Seg", value: timeLeft.seconds },
    ];

    return (
        <div className="countdown-container">
            {items.map((item, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    style={{ textAlign: "center" }}
                >
                    <div className="countdown-value">
                        {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="countdown-label">
                        {item.label}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
