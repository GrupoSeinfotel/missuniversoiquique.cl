"use client";
import prisma from "@/lib/db";

export default async function SeedSlider() {
    // This is a manual trigger script or one-time use helper
    const homeSliderData = {
        name: "Home Main Slider",
        settings: {
            autoPlay: true,
            delay: 6000,
            canvasHeightDesktop: 900,
            canvasHeightMobile: 650
        },
        slides: [
            {
                id: "slide_01",
                backgroundSrc: "https://images.unsplash.com/photo-1549474843-ed830030f926?q=80&w=2070&auto=format&fit=crop",
                backgroundSize: "cover",
                layers: [
                    {
                        id: "layer_title_bg",
                        type: "text",
                        content: "IQUIQUE",
                        zIndex: 5,
                        animation: "fade-in",
                        style: { fontWeight: "900", color: "rgba(255,255,255,0.05)" },
                        desktop: { fontSize: 350, top: 150, left: 100, opacity: 1, visible: true },
                        mobile: { fontSize: 120, top: 100, left: 20, opacity: 1, visible: true }
                    },
                    {
                        id: "layer_main_title",
                        type: "text",
                        content: "MISS UNIVERSE",
                        zIndex: 10,
                        animation: "fade-in-up",
                        style: { fontWeight: "900", letterSpacing: "5px", textTransform: "uppercase" },
                        desktop: { fontSize: 120, color: "#ffffff", top: 320, left: 150, opacity: 1, visible: true },
                        mobile: { fontSize: 45, color: "#ffffff", top: 220, left: 20, opacity: 1, visible: true }
                    },
                    {
                        id: "layer_sub_title",
                        type: "text",
                        content: "IQUIQUE <span style='color: #f5245f;'>2026</span>",
                        zIndex: 11,
                        animation: "fade-in-up",
                        animationDelay: 0.8,
                        style: { fontWeight: "800", letterSpacing: "10px", textTransform: "uppercase" },
                        desktop: { fontSize: 60, color: "#ffffff", top: 440, left: 160, opacity: 1, visible: true },
                        mobile: { fontSize: 25, color: "#ffffff", top: 270, left: 20, opacity: 1, visible: true }
                    }
                ]
            }
        ]
    };

    // Since this is a server-side action in a route or script...
    // In a real app we'd trigger this via a button or initialization script.
    return null;
}
