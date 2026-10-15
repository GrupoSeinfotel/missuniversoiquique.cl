"use client";
import { useState, useEffect } from "react";

export default function TimelineExact() {
    const [phases, setPhases] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/settings", { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const timelineJson = data.find((s: any) => s.key === "UI_TIMELINE")?.value;
                    if (timelineJson) setPhases(JSON.parse(timelineJson));
                    else {
                        setPhases([
                            { phase: "Fase 1", title: "Convocatoria", date: "Enero - Febrero", desc: "Casting virtual." },
                            { phase: "Fase 2", title: "Casting Presencial", date: "Marzo", desc: "Selección de finalistas." },
                            { phase: "Fase 3", title: "Concentración", date: "Abril", desc: "Preparación intensa." },
                            { phase: "Fase 4", title: "La Gran Final", date: "25 de Abril", desc: "Coronación." }
                        ]);
                    }
                }
            });
    }, []);

    return (
        <section id="timeline" className="section-padding" style={{ background: "var(--secondary-bg)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                    <h3 className="serif-italic" style={{ color: "var(--accent-pink)", fontSize: "24px", marginBottom: "10px" }}>
                        El Camino a la Corona
                    </h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>
                        CRONOGRAMA DE <span className="accent-text">ACTIVIDADES</span>
                    </h2>
                </div>

                <div className="timeline-wrapper">
                    {/* Vertical Line */}
                    <div className="timeline-line"></div>

                    {phases.map((item, idx) => (
                        <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                            {/* Dot */}
                            <div className="timeline-dot"></div>

                            <div className="timeline-content">
                                <div className="timeline-date">
                                    {item.phase} • {item.date}
                                </div>
                                <h4 className="timeline-title">{item.title}</h4>
                                <p className="timeline-desc">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
