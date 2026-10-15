"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AboutExact({ minimal = false }: { minimal?: boolean }) {
    const [content, setContent] = useState({
        mission: "Miss Universo Iquique es una organización dedicada al empoderamiento femenino...",
        vision: "Posicionar a Iquique como una potencia en los certámenes de belleza...",
        quote: "No buscamos solo una cara bonita; buscamos una voz, una líder y una embajadora que lleve la banda de Iquique con orgullo en el escenario nacional.",
        director: "Nelson Velásquez, Director Regional",
        media: [] as any[]
    });

    useEffect(() => {
        fetch("/api/admin/settings", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const findVal = (key: string) => data.find((s: any) => s.key === key)?.value;

                    const mission = findVal("ABOUT_MISSION");
                    const vision = findVal("ABOUT_VISION");
                    const quote = findVal("ABOUT_QUOTE");
                    const director = findVal("ABOUT_DIRECTOR");
                    const mediaJson = findVal("ABOUT_MEDIA");
                    const oldImage = findVal("ABOUT_IMAGE");

                    setContent(prev => {
                        let mediaItems = prev.media;
                        if (mediaJson) {
                            try {
                                mediaItems = JSON.parse(mediaJson);
                            } catch (e) {
                                console.error("Error parsing ABOUT_MEDIA", e);
                            }
                        } else if (oldImage) {
                            mediaItems = [{ type: "IMAGE", url: oldImage }];
                        }

                        return {
                            mission: mission || prev.mission,
                            vision: vision || prev.vision,
                            quote: quote || prev.quote,
                            director: director || prev.director,
                            media: mediaItems
                        };
                    });
                }
            })
            .catch(err => console.error("Fetch error in AboutExact", err));
    }, []);

    return (
        <section id="about" className="section-padding" style={{ background: "var(--primary-bg)" }}>
            <div className="container about-grid" style={minimal ? { gridTemplateColumns: "1fr 1fr", gap: "60px" } : {}}>

                {/* Text Column */}
                <div className="about-text-content">
                    <h3 className="serif-italic" style={{
                        color: "var(--accent-pink)",
                        fontSize: "24px",
                        marginBottom: "15px",
                        fontStyle: "italic"
                    }}>
                        Nuestra Misión y Visión
                    </h3>
                    <h2 className="responsive-h2" style={{
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "30px",
                        lineHeight: "1.2"
                    }}>
                        MÁS QUE BELLEZA, <span className="accent-text">EMPODERAMIENTO</span>
                    </h2>


                    {!minimal ? (
                        <>
                            <div style={{ marginBottom: "30px" }}>
                                <h4 style={{ color: "white", fontSize: "18px", marginBottom: "10px", textTransform: "uppercase" }}>Misión</h4>
                                <p style={{
                                    color: "var(--text-gray)",
                                    lineHeight: "1.8",
                                    fontSize: "15px"
                                }}>
                                    {content.mission}
                                </p>
                            </div>

                            <div style={{ marginBottom: "30px" }}>
                                <h4 style={{ color: "white", fontSize: "18px", marginBottom: "10px", textTransform: "uppercase" }}>Visión</h4>
                                <p style={{
                                    color: "var(--text-gray)",
                                    lineHeight: "1.8",
                                    fontSize: "15px"
                                }}>
                                    {content.vision}
                                </p>
                            </div>

                            <div className="quote-box" style={{
                                marginTop: "40px",
                                padding: "30px",
                                background: "var(--secondary-bg)",
                                borderLeft: "4px solid var(--accent-pink)",
                                fontStyle: "italic"
                            }}>
                                <p style={{ color: "white", fontSize: "14px", lineHeight: "1.6", marginBottom: "15px" }}>
                                    "{content.quote}"
                                </p>
                                <p style={{ color: "var(--accent-pink)", fontWeight: "bold", fontSize: "12px", textTransform: "uppercase" }}>
                                    — {content.director}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div style={{ marginTop: "20px" }}>
                            <p style={{ color: "var(--text-gray)", lineHeight: "1.8", fontSize: "16px", marginBottom: "30px" }}>
                                Somos más que un concurso de belleza. Miss Universo Iquique es la plataforma más importante del norte grande para el liderazgo y empoderamiento de la mujer iquiqueña.
                            </p>
                            <a href="/sobre-nosotros" className="btn-primary" style={{ display: "inline-block", padding: "12px 30px", fontSize: "12px", fontWeight: "900" }}>
                                CONOCER NUESTRA MISIÓN Y VISIÓN
                            </a>
                        </div>
                    )}
                </div>

                {/* Image/Video Column */}
                <div className="about-image-wrapper" style={{
                    display: 'grid',
                    gridTemplateColumns: content.media && content.media.length > 1 ? '1fr 1fr' : '1fr',
                    gap: '20px'
                }}>
                    {content.media && content.media.length > 0 ? (
                        content.media.map((item: any, idx: number) => (
                            <div key={idx} style={{
                                position: 'relative',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                height: content.media.length > 1 ? '300px' : '600px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                {item.type === "VIDEO" ? (
                                    <video
                                        src={item.url}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'black' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: `url(${item.url}) center/cover no-repeat` }} />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="about-main-image" style={{ borderRadius: '15px', overflow: 'hidden' }}></div>
                    )}
                </div>

            </div>
        </section>
    );
}
