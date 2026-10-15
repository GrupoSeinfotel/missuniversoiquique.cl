"use client";
import { useState, useEffect } from "react";
import ResponsiveSlider from "@/components/ui/ResponsiveSlider";
import Countdown from "@/components/landing/Countdown";
import { motion } from "framer-motion";
import PresaleModal from "@/components/ui/PresaleModal";

export default function HeroExact() {
    const [targetDate, setTargetDate] = useState("2026-04-25T18:00:00");
    const [regEnabled, setRegEnabled] = useState(true);
    const [showPresale, setShowPresale] = useState(false);

    useEffect(() => {
        fetch("/api/admin/settings.json", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const date = data.find((s: any) => s.key === "HERO_COUNTDOWN")?.value;
                    if (date) setTargetDate(date);
                    const reg = data.find((s: any) => s.key === "REGISTRATION_ENABLED")?.value;
                    if (reg === "false") setRegEnabled(false);
                }
            });
    }, []);

    return (
        <section style={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            background: "#000",
            overflow: "hidden"
        }}>
            {/* The Dynamic Premium Slider */}
            <ResponsiveSlider sliderId="home-main" />

            {/* Float Overlay Elements (Fixed on top of slider) */}
            <div className="container" style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 100,
                textAlign: "center"
            }}>
                <div style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)", padding: "20px 40px", borderRadius: "15px", display: "inline-block", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="countdown-wrapper">
                        <Countdown targetDate={targetDate} />
                    </div>
                    <div style={{ marginTop: "15px", fontSize: "13px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "2px", color: "white" }}>
                        LA GRAN FINAL: <span style={{ color: "var(--accent-pink)" }}>25 DE ABRIL</span>
                    </div>
                </div>

                <div className="hero-btns" style={{ marginTop: "30px" }}>
                    {regEnabled ? (
                        <motion.button
                            onClick={() => {
                                document.getElementById("entradas")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            whileHover={{ scale: 1.08, backgroundColor: "#f5245f" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                boxShadow: [
                                    "0 0 20px rgba(245, 36, 95, 0.4)",
                                    "0 0 40px rgba(245, 36, 95, 0.7)",
                                    "0 0 20px rgba(245, 36, 95, 0.4)"
                                ]
                            }}
                            transition={{ 
                                delay: 0.8,
                                boxShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            className="btn-hero-solid"
                            style={{ 
                                display: "inline-block", 
                                marginRight: "10px", 
                                outline: "none", 
                                border: "none",
                                padding: "18px 45px",
                                fontSize: "16px",
                                fontWeight: "900",
                                letterSpacing: "2px"
                            }}
                        >
                            COMPRA TU ENTRADA 🎫
                        </motion.button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="btn-hero-solid"
                            style={{
                                display: "inline-block",
                                marginRight: "10px",
                                opacity: 0.5,
                                cursor: 'not-allowed',
                                background: '#333'
                            }}
                        >
                            PRESENTACIÓN CERRADA
                        </motion.div>
                    )}

                    <motion.a
                        href="/#about"
                        whileHover={{ scale: 1.05, border: "1px solid var(--accent-pink)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="btn-hero-outline"
                        style={{ display: "inline-block" }}
                    >
                        CONÓCENOS
                    </motion.a>
                </div>
            </div>

            {/* Side Indicator Decorative */}
            <div style={{
                position: "absolute",
                right: "60px",
                top: "50%",
                transform: "translateY(-50%) rotate(90deg)",
                zIndex: 100,
                color: "var(--accent-pink)",
                fontSize: "12px",
                fontWeight: "900",
                letterSpacing: "5px"
            }} className="desktop-only">
                ESTÉTICA • ELEGANCIA • PODER
            </div>

            <PresaleModal isOpen={showPresale} onClose={() => setShowPresale(false)} />
        </section>
    );
}
