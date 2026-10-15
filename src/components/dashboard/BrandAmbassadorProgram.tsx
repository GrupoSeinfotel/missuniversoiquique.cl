"use client";
import { useState } from "react";
import { FaHandshake, FaFileContract, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface Props {
    accepted: boolean;
    acceptedAt: Date | null | undefined;
    candidateId: string;
}

export default function BrandAmbassadorProgram({ accepted, acceptedAt, candidateId }: Props) {
    const [expanded, setExpanded] = useState(!accepted);
    const [tab, setTab] = useState<"PROGRAM" | "LEGAL">("PROGRAM");
    const [checkProgram, setCheckProgram] = useState(false);
    const [checkLegal, setCheckLegal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleAccept = async () => {
        if (!checkProgram || !checkLegal) return;
        if (!confirm("¿Confirmas tu participación voluntaria en el programa?")) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/candidate/brand-ambassador/accept", { method: "POST" });
            if (res.ok) {
                router.refresh();
                setExpanded(false);
            } else {
                alert("Error al procesar la solicitud. Intenta nuevamente.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    if (accepted && !expanded) {
        return (
            <div style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <div style={{ background: "rgba(45, 106, 79, 0.2)", padding: "10px", borderRadius: "50%", color: "#2d6a4f" }}>
                            <FaCheckCircle size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#2d6a4f", margin: 0 }}>
                                PROGRAMA EMBAJADORA DE MARCA ACTIVO
                            </h3>
                            <p style={{ fontSize: "12px", color: "#aaa", margin: "5px 0 0 0" }}>
                                Aceptado el <span suppressHydrationWarning>{acceptedAt ? new Date(acceptedAt).toLocaleDateString() : "Fecha desconocida"}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setExpanded(true)}
                        style={{ ...btnStyle, background: "transparent", border: "1px solid #333", color: "#aaa" }}
                    >
                        Ver Documento <FaChevronDown style={{ marginLeft: "5px" }} />
                    </button>
                </div>

                {/* Referral Section */}
                <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <h4 style={{ fontSize: "14px", color: "white", marginBottom: "15px", textTransform: "uppercase" }}>Tu Enlace de Referido</h4>
                    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
                        <div style={{ background: "white", padding: "10px", borderRadius: "8px" }}>
                            {/* QR Code using API */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/sponsors?ref=${candidateId}`)}`}
                                alt="QR Code"
                                style={{ width: "120px", height: "120px", display: "block" }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>Comparte este enlace o QR con empresas. Cuando una empresa se registra y su auspicio es aprobado, <strong>recibirás automáticamente 500 puntos extra</strong> en tu perfil.</p>

                            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                                <input
                                    readOnly
                                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/sponsors?ref=${candidateId}`}
                                    style={{
                                        flex: 1,
                                        background: "#111",
                                        border: "1px solid #333",
                                        color: "var(--accent-pink)",
                                        padding: "8px",
                                        fontSize: "12px",
                                        borderRadius: "4px"
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/sponsors?ref=${candidateId}`);
                                        alert("Enlace copiado al portapapeles");
                                    }}
                                    style={{ ...btnStyle, background: "#333", color: "white", padding: "8px 15px", fontSize: "12px" }}
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", color: "white" }}>
                    <FaHandshake style={{ marginRight: "10px", color: "var(--accent-pink)" }} />
                    Programa Embajadoras de Marca
                </h3>
                {accepted && (
                    <button
                        onClick={() => setExpanded(false)}
                        style={{ ...btnStyle, background: "transparent", border: "1px solid #333", color: "#aaa", padding: "5px 10px", fontSize: "12px" }}
                    >
                        Ocultar <FaChevronUp style={{ marginLeft: "5px" }} />
                    </button>
                )}
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid #333", marginBottom: "20px" }}>
                <button
                    onClick={() => setTab("PROGRAM")}
                    style={{ ...tabStyle, borderBottom: tab === "PROGRAM" ? "2px solid var(--accent-pink)" : "2px solid transparent", color: tab === "PROGRAM" ? "white" : "#666" }}
                >
                    Programa Oficial
                </button>
                <button
                    onClick={() => setTab("LEGAL")}
                    style={{ ...tabStyle, borderBottom: tab === "LEGAL" ? "2px solid var(--accent-pink)" : "2px solid transparent", color: tab === "LEGAL" ? "white" : "#666" }}
                >
                    <FaFileContract style={{ marginRight: "5px" }} /> Anexo Legal
                </button>
            </div>

            <div style={{ height: "400px", overflowY: "auto", background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "8px", border: "1px solid #333", marginBottom: "20px" }}>
                {tab === "PROGRAM" ? (
                    <div style={contentStyle}>
                        <h2 style={titleStyle}>PROGRAMA OFICIAL<br />EMBAJADORAS DE MARCA & ALIANZAS ESTRATÉGICAS</h2>
                        <h4 style={subtitleStyle}>Miss Universe Iquique 2026</h4>

                        <h3 style={sectionTitleStyle}>1. Presentación General</h3>
                        <p style={paraStyle}>El Programa Oficial de Embajadoras de Marca & Alianzas Estratégicas es una iniciativa voluntaria, formativa y complementaria del certamen Miss Universe Iquique 2026, creada para aquellas candidatas que deseen involucrarse activamente en el desarrollo del proyecto, adquirir habilidades profesionales reales y contribuir al fortalecimiento del ecosistema del certamen.</p>
                        <p style={paraStyle}>Este programa no constituye una obligación, no condiciona la participación, no define automáticamente resultados y no reemplaza ninguna etapa oficial del certamen.</p>

                        <h3 style={sectionTitleStyle}>2. Naturaleza del Programa</h3>
                        <p style={paraStyle}>Miss Universe Iquique se concibe como una plataforma de formación, liderazgo, representación y proyección profesional, más allá de una competencia escénica.</p>
                        <p style={paraStyle}>El Programa de Embajadoras de Marca ha sido diseñado para:</p>
                        <ul style={listStyle}><li style={liStyle}>Desarrollar habilidades reales en networking, marketing y representación corporativa.</li><li style={liStyle}>Profesionalizar la relación entre candidatas, marcas y comunidad.</li><li style={liStyle}>Fortalecer la sostenibilidad del certamen mediante alianzas locales.</li><li style={liStyle}>Elevar el estándar del evento, su producción y su proyección nacional.</li><li style={liStyle}>Construir una cultura de colaboración, responsabilidad y liderazgo.</li></ul>
                        <p style={{ ...paraStyle, fontWeight: 700, color: "white" }}>La participación en este programa es estrictamente voluntaria.</p>

                        <h3 style={sectionTitleStyle}>3. Objetivo del Programa</h3>
                        <p style={paraStyle}>El objetivo del Programa de Embajadoras de Marca & Alianzas Estratégicas es:</p>
                        <ul style={listStyle}><li style={liStyle}>Formar candidatas con capacidades reales de representación institucional.</li><li style={liStyle}>Facilitar el aprendizaje práctico en gestión de alianzas y marcas.</li><li style={liStyle}>Fortalecer el vínculo entre el certamen y el ecosistema empresarial local.</li><li style={liStyle}>Contribuir al crecimiento estructural del proyecto Miss Universe Iquique.</li><li style={liStyle}>Incrementar, según alcance real, la capacidad de apoyo a la Representante Oficial en su etapa nacional.</li></ul>
                        <p style={paraStyle}>El programa opera bajo un principio fundamental: <strong style={{ color: "white" }}>el crecimiento del proyecto es colectivo y proporcional al compromiso y gestión real de quienes participan.</strong></p>

                        <h3 style={sectionTitleStyle}>4. ¿En qué consiste el Programa?</h3>
                        <p style={paraStyle}>Las candidatas que decidan incorporarse al programa recibirán:</p>
                        <ul style={listStyle}><li style={liStyle}>Un enlace personal de referencia asociado a la plataforma oficial.</li><li style={liStyle}>Acceso a un sistema profesional de gestión de auspicios.</li><li style={liStyle}>Material de apoyo y lineamientos institucionales.</li><li style={liStyle}>Acompañamiento y mentoría estratégica.</li><li style={liStyle}>Registro transparente de su participación dentro del sistema.</li></ul>
                        <p style={paraStyle}>Las empresas que ingresen mediante dichos enlaces podrán:</p>
                        <ul style={listStyle}><li style={liStyle}>Conocer el proyecto Miss Universe Iquique.</li><li style={liStyle}>Seleccionar planes oficiales de auspicio.</li><li style={liStyle}>Realizar pagos electrónicos seguros directamente en la plataforma.</li></ul>

                        <h3 style={sectionTitleStyle}>5. Rol de la Candidata</h3>
                        <p style={paraStyle}>La candidata participante del programa:</p>
                        <ul style={listStyle}><li style={liStyle}>No gestiona dinero.</li><li style={liStyle}>No recibe pagos.</li><li style={liStyle}>No negocia precios.</li><li style={liStyle}>No define condiciones comerciales.</li></ul>
                        <p style={paraStyle}>Su rol es exclusivamente representativo y de vinculación, actuando como embajadora institucional que invita a empresas a conocer y apoyar el proyecto a través de los canales oficiales.</p>
                        <p style={paraStyle}>Toda gestión económica, validación y administración corresponde únicamente a la organización.</p>

                        <h3 style={sectionTitleStyle}>6. Sistema de Transparencia y Control</h3>
                        <p style={paraStyle}>El Programa opera bajo un sistema digital que garantiza:</p>
                        <ul style={listStyle}><li style={liStyle}>Precios públicos y definidos por la organización.</li><li style={liStyle}>Pagos electrónicos automatizados.</li><li style={liStyle}>Registro verificable de cada auspicio.</li><li style={liStyle}>Validación administrativa interna.</li><li style={liStyle}>Protección reputacional de candidatas, empresas y marca.</li></ul>
                        <p style={paraStyle}>La organización se reserva el derecho de aprobar o rechazar auspicios que no se alineen con los valores y estándares del certamen.</p>

                        <h3 style={sectionTitleStyle}>7. Componente Formativo y Mentoría</h3>
                        <p style={paraStyle}>El Programa incluye un componente formativo central. Las candidatas participantes accederán a capacitación y mentoría directa impartida por:</p>
                        <p style={{ ...paraStyle, background: "rgba(255,255,255,0.04)", padding: "10px 14px", borderLeft: "3px solid var(--accent-pink)", borderRadius: "4px" }}><strong style={{ color: "white" }}>Juan Limache</strong><br />Director General — Miss Universe Iquique 2026</p>
                        <p style={paraStyle}>La formación abordará, entre otros contenidos:</p>
                        <ul style={listStyle}><li style={liStyle}>Networking estratégico y profesional.</li><li style={liStyle}>Marketing personal y de marca.</li><li style={liStyle}>Representación institucional.</li><li style={liStyle}>Presentación de propuestas de valor.</li><li style={liStyle}>Construcción de comunidades activas.</li><li style={liStyle}>Relación profesional con empresas y marcas.</li><li style={liStyle}>Liderazgo aplicado a proyectos culturales y sociales.</li></ul>
                        <p style={paraStyle}>Esta formación posee valor práctico y transferible, aplicable a múltiples ámbitos profesionales más allá del certamen.</p>

                        <h3 style={sectionTitleStyle}>8. Sistema de Reconocimiento y Puntaje</h3>
                        <p style={paraStyle}>La participación activa entrega puntaje relevante dentro del sistema de misiones y desempeño del certamen:</p>
                        <ul style={listStyle}>
                            <li style={{ ...liStyle, color: "var(--accent-pink)", fontWeight: "bold" }}>Cada auspicio (Sponsor) aprobado suma 500 puntos automáticamente.</li>
                            <li style={liStyle}>Reconoce liderazgo, iniciativa y compromiso.</li>
                            <li style={liStyle}>Forma parte de la evaluación integral de la candidata.</li>
                            <li style={liStyle}>No sustituye criterios escénicos, artísticos o disciplinarios.</li>
                            <li style={liStyle}>No garantiza posiciones finales ni coronación.</li>
                        </ul>
                        <p style={paraStyle}>El sistema de evaluación mantiene múltiples dimensiones para asegurar equilibrio, legitimidad y transparencia.</p>

                        <h3 style={sectionTitleStyle}>9. Potencial Apoyo a la Representante Oficial</h3>
                        <p style={paraStyle}>Si una candidata participante resulta electa como Representante Oficial, la organización podrá priorizar recursos generados a través de su gestión para apoyar su etapa nacional (viaje, estadía, preparación), siempre sujeto a:</p>
                        <ul style={listStyle}><li style={liStyle}>Disponibilidad presupuestaria real.</li><li style={liStyle}>Viabilidad operativa del proyecto.</li><li style={liStyle}>Decisión de la Dirección General y del Comité Directivo.</li></ul>
                        <p style={paraStyle}>Este apoyo: No es automático. No es garantizado. No constituye un premio económico. No implica transferencia directa de dinero.</p>

                        <h3 style={sectionTitleStyle}>10. Principios del Programa</h3>
                        <ul style={listStyle}><li style={liStyle}>Voluntariedad absoluta.</li><li style={liStyle}>Transparencia operativa.</li><li style={liStyle}>Respeto por la candidata.</li><li style={liStyle}>Protección de la imagen institucional.</li><li style={liStyle}>No promesas económicas individuales.</li><li style={liStyle}>Crecimiento colectivo.</li><li style={liStyle}>Supervisión permanente del Comité Directivo.</li></ul>
                        <p style={paraStyle}>La organización podrá suspender o modificar el programa si la integridad del certamen lo requiere.</p>

                        <h3 style={sectionTitleStyle}>11. Candidatas que no participen</h3>
                        <ul style={listStyle}><li style={liStyle}>Mantienen intactos todos sus derechos dentro del certamen.</li><li style={liStyle}>No reciben penalización ni desventaja.</li><li style={liStyle}>No asumen compromiso alguno.</li><li style={liStyle}>No reciben promesas de apoyo económico.</li></ul>
                        <p style={paraStyle}>La participación o no participación no condiciona la evaluación general ni el desarrollo del certamen.</p>

                        <h3 style={sectionTitleStyle}>12. Declaración Institucional</h3>
                        <p style={paraStyle}>Miss Universe Iquique 2026 es una marca, una plataforma y una comunidad. Este programa busca formar liderazgos, no imponer obligaciones.</p>
                        <p style={paraStyle}>Las candidatas que se suman lo hacen desde la convicción, el aprendizaje y la colaboración, entendiendo que los resultados dependen del trabajo conjunto y del alcance real del proyecto.</p>

                        <h3 style={sectionTitleStyle}>13. Aceptación del Programa</h3>
                        <p style={paraStyle}>Al aceptar este programa, la candidata declara que:</p>
                        <ul style={listStyle}><li style={liStyle}>Ha leído y comprendido íntegramente esta información.</li><li style={liStyle}>Entiende que su participación es voluntaria.</li><li style={liStyle}>Reconoce que no existen garantías económicas individuales.</li><li style={liStyle}>Acepta que los recursos forman parte del fondo general del certamen.</li><li style={liStyle}>Comprende que cualquier apoyo estará sujeto a viabilidad real.</li><li style={liStyle}>Se compromete a actuar con responsabilidad y respeto institucional.</li></ul>
                    </div>
                ) : (
                    <div style={contentStyle}>
                        <h2 style={titleStyle}>ANEXO LEGAL</h2>
                        <h4 style={subtitleStyle}>PROGRAMA OFICIAL DE EMBAJADORAS DE MARCA & ALIANZAS ESTRATÉGICAS</h4>

                        <h3>1. Objeto del Anexo</h3>
                        <p>El presente Anexo Legal regula las condiciones de participación voluntaria de la candidata en el Programa Oficial de Embajadoras de Marca & Alianzas Estratégicas.</p>

                        <h3>2. Voluntariedad de la Participación</h3>
                        <p>La candidata declara expresamente que su incorporación al Programa es absolutamente voluntaria y no es requisito para competir en el certamen.</p>

                        <h3>3. Naturaleza No Laboral</h3>
                        <p>La candidata reconoce y acepta que el Programa no constituye una relación laboral, contractual ni de prestación de servicios.</p>

                        <h3>4. Gestión Económica y Sponsors</h3>
                        <p>La candidata declara conocer y aceptar que no administra dinero, no recibe pagos de ningún tipo y no negocia precios.</p>

                        <h3>5. No Existencia de Promesas Económicas</h3>
                        <p>La candidata reconoce que la organización no garantiza financiamiento, reembolsos ni apoyo económico individual.</p>

                        <h3>6. Apoyo Condicionado a la Representante Oficial</h3>
                        <p>En el caso de que la candidata participante resulte electa como Representante Oficial, la organización podrá priorizar el uso de recursos generados para apoyar su participación nacional, sujeto a disponibilidad y evaluación interna.</p>

                        <h3>7. Sistema de Puntaje y Evaluación</h3>
                        <p>La candidata acepta que la participación en el Programa puede otorgar puntaje dentro del sistema de misiones del certamen, pero no garantiza posiciones finales.</p>

                        <h3>8. Uso de Imagen y Comunicación</h3>
                        <p>La candidata autoriza a la organización a utilizar su nombre, imagen y participación en el Programa para fines comunicacionales.</p>

                        <h3>9. Conducta y Representación</h3>
                        <p>La candidata se compromete a actuar con respeto, responsabilidad y ética.</p>

                        <h3>10. Modificación o Término del Programa</h3>
                        <p>La organización puede modificar, suspender o finalizar el Programa en cualquier momento.</p>

                        <h3>11. Aceptación y Consentimiento</h3>
                        <p>Al aceptar este Anexo Legal, la candidata declara que ha leído y comprendido íntegramente su contenido y acepta todas las condiciones aquí establecidas.</p>
                    </div>
                )}
            </div>

            {
                !accepted && (
                    <div style={{ background: "rgba(0,0,0,0.5)", padding: "20px", borderRadius: "8px", border: "1px solid #444" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={checkProgram}
                                    onChange={(e) => setCheckProgram(e.target.checked)}
                                    style={{ marginTop: "3px", transform: "scale(1.2)" }}
                                />
                                <span style={{ fontSize: "14px", color: checkProgram ? "white" : "#aaa" }}>
                                    Acepto participar voluntariamente en el Programa Oficial de Embajadoras de Marca & Alianzas Estratégicas
                                </span>
                            </label>
                            <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={checkLegal}
                                    onChange={(e) => setCheckLegal(e.target.checked)}
                                    style={{ marginTop: "3px", transform: "scale(1.2)" }}
                                />
                                <span style={{ fontSize: "14px", color: checkLegal ? "white" : "#aaa" }}>
                                    Declaro haber leído y aceptado el Anexo Legal del Programa.
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={handleAccept}
                            disabled={!checkProgram || !checkLegal || submitting}
                            style={{
                                ...btnStyle,
                                width: "100%",
                                background: (!checkProgram || !checkLegal) ? "#333" : "var(--accent-pink)",
                                color: (!checkProgram || !checkLegal) ? "#666" : "white",
                                cursor: (!checkProgram || !checkLegal) ? "not-allowed" : "pointer"
                            }}
                        >
                            {submitting ? "Procesando..." : "CONFIRMAR PARTICIPACIÓN"}
                        </button>

                        <p style={{ marginTop: "15px", fontSize: "11px", color: "#666", textAlign: "center" }}>
                            Al confirmar, se registrará digitalmente tu aceptación con fecha y hora.
                        </p>
                    </div>
                )
            }
        </div >
    );
}

const cardStyle = {
    background: "var(--secondary-bg)",
    padding: "25px",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "8px",
    marginBottom: "30px"
};

const tabStyle = {
    background: "transparent",
    border: "none",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "bold" as const,
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
};

const contentStyle = {
    fontSize: "13px",
    lineHeight: "1.7",
    color: "#ccc"
};

const titleStyle = {
    color: "white",
    fontSize: "17px",
    marginBottom: "5px",
    textAlign: "center" as const,
    fontWeight: 900 as const,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
};

const subtitleStyle = {
    color: "var(--accent-pink)",
    fontSize: "13px",
    marginBottom: "24px",
    textAlign: "center" as const
};

const sectionTitleStyle = {
    color: "white",
    fontSize: "13px",
    fontWeight: 900 as const,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    borderBottom: "1px solid #222",
    paddingBottom: "6px",
    marginTop: "24px",
    marginBottom: "10px",
};

const paraStyle = {
    marginBottom: "10px",
    marginTop: "6px",
    color: "#ccc",
};

const listStyle = {
    paddingLeft: "20px",
    marginBottom: "12px",
    marginTop: "6px",
};

const liStyle = {
    marginBottom: "6px",
    color: "#bbb",
};

const btnStyle = {
    padding: "12px 20px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold" as const,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s"
};
