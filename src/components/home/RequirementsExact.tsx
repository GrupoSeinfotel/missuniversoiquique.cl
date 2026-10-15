"use client";

export default function RequirementsExact() {
    const requirements = [
        { title: "Nacionalidad", desc: "Tener nacionalidad chilena." },
        { title: "Edad", desc: "Ser mayor de 18 años. Sin límite de edad superior según las nuevas normativas internacionales." },
        { title: "Estado Civil", desc: "Se aceptan mujeres solteras, casadas, divorciadas, con o sin hijos." },
        { title: "Disponibilidad", desc: "Disponibilidad para cumplir con la preparación, ensayos y eventos oficiales." }
    ];

    return (
        <section id="requirements" className="section-padding" style={{ background: "var(--secondary-bg)" }}>
            <div className="container">
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                    <h3 className="serif-italic" style={{ color: "var(--accent-pink)", fontSize: "24px", marginBottom: "10px" }}>
                        ¿Quieres ser la próxima reina?
                    </h3>
                    <h2 className="responsive-h2" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>
                        REQUISITOS <span className="accent-text">OFICIALES</span>
                    </h2>
                </div>

                <div className="req-grid">
                    {requirements.map((req, idx) => (
                        <div key={idx} className="req-card">
                            <h4 style={{ color: "white", fontSize: "16px", textTransform: "uppercase", marginBottom: "10px", letterSpacing: "1px" }}>
                                {req.title}
                            </h4>
                            <p style={{ color: "var(--text-gray)", fontSize: "14px", lineHeight: "1.6" }}>
                                {req.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: "50px", textAlign: "center" }}>
                    <p style={{ color: "var(--text-gray)", marginBottom: "30px", fontSize: "15px" }}>
                        Si cumples con estos requisitos, el escenario del Universo está esperando por ti.
                    </p>
                    <a href="/casting" className="btn-primary">POSTULAR AHORA</a>
                </div>
            </div>
        </section>
    );
}
