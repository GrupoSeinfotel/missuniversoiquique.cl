"use client";

import { FaGem, FaGraduationCap, FaCamera, FaCertificate, FaUserTie, FaUsers, FaHeart, FaStar, FaCrown, FaTv, FaArrowRight, FaCheck, FaChartLine, FaLightbulb, FaHandshake, FaTrophy, FaGlobe } from "react-icons/fa";

export default function BeneficiosPage() {
    return (
        <main style={{ background: "var(--primary-bg)", color: "white", minHeight: "100vh" }}>
            {/* Hero Section */}
            <section style={{
                minHeight: "70vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(245,36,95,0.15)), url('/hero-benefits.jpg') center/cover no-repeat",
                padding: "80px 20px",
                position: "relative"
            }}>
                <div style={{ maxWidth: "1000px", position: "relative", zIndex: 2 }}>
                    <h1 style={{
                        fontSize: "clamp(2.5rem, 8vw, 5rem)",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        letterSpacing: "6px",
                        marginBottom: "30px",
                        lineHeight: "1.1"
                    }}>
                        Miss Universo <span className="accent-text">Iquique</span>
                    </h1>
                    <p style={{
                        fontSize: "clamp(1.1rem, 3vw, 1.8rem)",
                        letterSpacing: "3px",
                        marginBottom: "20px",
                        fontWeight: "300"
                    }}>
                        Beneficios para las Candidatas
                    </p>
                    <p style={{
                        fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                        letterSpacing: "2px",
                        opacity: 0.9,
                        fontStyle: "italic"
                    }}>
                        Estructura de valor real: <span className="accent-text">Experiencia + Reputación + Oportunidades</span>
                    </p>
                </div>
            </section>

            <div className="container" style={{ padding: "clamp(60px, 10vw, 120px) 20px" }}>
                {/* Intro Premium */}
                <div style={{
                    maxWidth: "1000px",
                    margin: "0 auto 100px auto",
                    textAlign: "center",
                    padding: "50px",
                    background: "rgba(245,36,95,0.03)",
                    borderRadius: "24px",
                    border: "1px solid rgba(245,36,95,0.1)"
                }}>
                    <h2 style={{
                        fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                        marginBottom: "30px",
                        color: "var(--accent-pink)"
                    }}>
                        No es solo un concurso de belleza
                    </h2>
                    <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: "1.9", color: "#ccc" }}>
                        <strong>Miss Universo Iquique</strong> es un proyecto de <strong>formación, visibilidad y posicionamiento</strong>, diseñado para desarrollar talento, construir marca personal y generar oportunidades reales, <span className="accent-text">independiente de si la candidata obtiene o no la corona</span>.
                    </p>
                    <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", lineHeight: "1.8", color: "#999", marginTop: "25px" }}>
                        Cada candidata participa en un proceso estructurado con: <strong>entregables reales</strong>, exposición pública planificada, actividades con marcas, y evidencias verificables que pueden ser utilizadas en su vida personal y profesional.
                    </p>
                </div>

                {/* Propuesta de Valor */}
                <section style={{ marginBottom: "120px" }}>
                    <h2 style={{
                        fontSize: "clamp(1.8rem, 5vw, 3rem)",
                        textAlign: "center",
                        marginBottom: "20px",
                        textTransform: "uppercase",
                        letterSpacing: "3px"
                    }}>
                        La Propuesta de <span className="accent-text">Valor Integral</span>
                    </h2>
                    <p style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 60px auto", fontSize: "1.1rem", color: "#999" }}>
                        La experiencia se construye con tres efectos directos:
                    </p>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: "30px"
                    }}>
                        <ValueCard
                            icon={<FaChartLine />}
                            title="Mejora del Perfil"
                            desc="Personal y profesional, con competencias aplicables a la vida real y el mercado laboral."
                        />
                        <ValueCard
                            icon={<FaGlobe />}
                            title="Visibilidad Sostenida"
                            desc="A través de contenido estratégico en plataformas oficiales y medios de comunicación."
                        />
                        <ValueCard
                            icon={<FaHandshake />}
                            title="Historial Demostrable"
                            desc="Con instituciones, comunidad y marcas. Evidencias reales para tu carrera."
                        />
                    </div>
                </section>

                {/* BENEFITS SECTION - DETALLADO */}
                <section style={{ marginBottom: "120px" }}>
                    <h2 style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        textAlign: "center",
                        marginBottom: "30px",
                        textTransform: "uppercase"
                    }}>
                        Lo que <span className="accent-text serif-italic">TÚ</span> ganas
                    </h2>
                    <p style={{ textAlign: "center", fontSize: "clamp(1rem, 2vw, 1.3rem)", marginBottom: "80px", color: "#999" }}>
                        (Seas o no la reina coronada)
                    </p>

                    {/* Benefit 1 */}
                    <BenefitDetail
                        number="01"
                        icon={<FaGraduationCap />}
                        title="Formación y Preparación Profesional"
                        items={[
                            "Clases de pasarela y modelaje profesional a cargo de la Academia Ena María Models",
                            "Enfoque en postura, desplazamiento, seguridad en pasarela y presencia escénica",
                            "Proyección personal con técnicas avanzadas de expresión corporal",
                            "Esta formación NO es simbólica: forma parte del proceso base del certamen"
                        ]}
                    />

                    {/* Benefit 2 */}
                    <BenefitDetail
                        number="02"
                        icon={<FaTv />}
                        title="Visibilidad y Posicionamiento de Marca Personal"
                        items={[
                            "Presencia en contenidos del proyecto (reels, cápsulas, entrevistas, sesiones y actividades)",
                            "Aparición constante en hitos comunicacionales: selección, etapas, activaciones y eventos",
                            "Posicionamiento como rostro público de una experiencia con propósito",
                            "Oportunidad de crecer audiencia con una narrativa clara: liderazgo, disciplina y elegancia",
                            "El proyecto genera contextos naturalmente virales que facilitan alcance y engagement real"
                        ]}
                    />

                    {/* Benefit 3 */}
                    <BenefitDetail
                        number="03"
                        icon={<FaCamera />}
                        title="Contenido Profesional para Portafolio"
                        subtitle="(Usable más allá del certamen)"
                        items={[
                            "Fotografías profesionales en actividades corporativas, comunitarias e institucionales",
                            "Videos de participación real (activaciones, cápsulas, testimonios y entrevistas)",
                            "Backstage y material de storytelling para redes personales",
                            "Contenido apto para CV y portafolio profesional (LinkedIn, postulaciones, agencias)",
                            "Evidencias claras de participación mediante registro audiovisual",
                            "Esto transforma la participación en un portafolio REAL, no en un recuerdo informal"
                        ]}
                    />

                    {/* Benefit 4 */}
                    <BenefitDetail
                        number="04"
                        icon={<FaCertificate />}
                        title="Reconocimiento Formal y Evidencias Verificables"
                        items={[
                            "Certificados de participación en actividades de impacto (ambientales, comunitarias o educativas)",
                            "Diplomas vinculados a hitos de activación con marcas (según sponsor y desempeño)",
                            "Reconocimientos tipo 'Embajadora de [Causa/Concepto]' asociados a acciones reales",
                            "Cartas de recomendación en casos puntuales (cuando alianzas lo permitan)",
                            "Estas evidencias fortalecen la credibilidad y el valor percibido de cada candidata"
                        ]}
                    />

                    {/* Benefit 5 */}
                    <BenefitDetail
                        number="05"
                        icon={<FaLightbulb />}
                        title="Experiencia Real que Suma al Currículum"
                        subtitle="(Más allá de lo estético)"
                        items={[
                            "Participación en proyectos sociales y comunitarios (limpieza, reciclaje, educación)",
                            "Coordinación y liderazgo en dinámicas y desafíos con objetivos claros",
                            "Exposición a protocolos de eventos, backstage y producción real",
                            "Oratoria práctica: entrevistas, cápsulas, presentaciones y manejo de cámara",
                            "Disciplina, preparación, cumplimiento de metas y trabajo bajo estructura",
                            "No es 'modelo por un día', es un proceso con aprendizaje aplicable y medible"
                        ]}
                    />

                    {/* Benefit 6 */}
                    <BenefitDetail
                        number="06"
                        icon={<FaUsers />}
                        title="Networking y Contactos que Abren Puertas"
                        items={[
                            "Vinculación con empresas, marcas, emprendedores y líderes locales",
                            "Conexión con áreas de marketing, comunicaciones, RRPP y RSE",
                            "Relación con equipos creativos: fotógrafos, videógrafos, maquilladores y productores",
                            "Posibilidad real de colaboraciones futuras (campañas, eventos, embajadurías)",
                            "Las oportunidades no dependen de la suerte, sino de una estructura diseñada para generarlas"
                        ]}
                    />

                    {/* Benefit 7 */}
                    <BenefitDetail
                        number="07"
                        icon={<FaHeart />}
                        title="Motivación, Pertenencia y Experiencia Memorable"
                        items={[
                            "Pertenencia a un equipo y comunidad con valores compartidos",
                            "Participación con impacto visible: 'hicimos algo real'",
                            "Reconocimientos por desempeño, disciplina y constancia (no solo por estética)",
                            "Hitos emocionales y memorables que pasan a formar parte de tu historia personal"
                        ]}
                    />
                </section>

                {/* RESUMEN DE BENEFICIOS FINALES */}
                <div style={{
                    background: "linear-gradient(135deg, rgba(245,36,95,0.1), rgba(245,36,95,0.03))",
                    padding: "clamp(40px, 8vw, 80px) clamp(30px, 6vw, 60px)",
                    borderRadius: "24px",
                    marginBottom: "120px",
                    border: "2px solid rgba(245,36,95,0.2)",
                    textAlign: "center"
                }}>
                    <h3 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "30px", color: "var(--accent-pink)" }}>
                        <FaTrophy style={{ marginRight: "15px" }} />
                        Beneficio Final para TODAS las Candidatas
                    </h3>
                    <p style={{ fontSize: "clamp(1rem, 2vw, 1.3rem)", lineHeight: "1.8", maxWidth: "900px", margin: "0 auto", color: "#ccc" }}>
                        Incluso si no obtienes la corona, <strong>te llevas</strong>: un portafolio real con evidencia, exposición y crecimiento en redes con contenido profesional, reconocimientos y participación verificable, experiencia y contactos valiosos, y un relato sólido de disciplina, liderazgo e impacto.
                    </p>
                </div>

                {/* Investment Section */}
                <section style={{
                    background: "var(--secondary-bg)",
                    padding: "clamp(50px, 10vw, 100px) clamp(30px, 6vw, 60px)",
                    borderRadius: "30px",
                    textAlign: "center",
                    border: "1px solid rgba(245, 36, 95, 0.3)",
                    marginBottom: "120px",
                    position: "relative",
                    overflow: "hidden"
                }}>
                    <div style={{ position: "absolute", top: "-80px", right: "-80px", opacity: 0.03, transform: "rotate(-15deg)" }}>
                        <FaGem size={300} />
                    </div>

                    <h2 style={{
                        fontSize: "clamp(1rem, 3vw, 1.4rem)",
                        letterSpacing: "5px",
                        color: "var(--accent-pink)",
                        marginBottom: "15px",
                        textTransform: "uppercase",
                        fontWeight: "300"
                    }}>
                        ¿Qué incluye la inscripción?
                    </h2>
                    <h3 style={{ fontSize: "clamp(2rem, 6vw, 4rem)", marginBottom: "50px", fontWeight: "900" }}>
                        Inversión en tu Futuro
                    </h3>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "40px",
                        flexWrap: "wrap",
                        marginBottom: "50px"
                    }}>
                        <PriceBox label="Inscripción General" price="$150.000" currency="CLP" />
                        <PriceBox label="Inscripción Anticipada" price="$100.000" currency="CLP" highlight sub="Hasta el 15 de Febrero" />
                    </div>

                    <p style={{
                        maxWidth: "700px",
                        margin: "0 auto",
                        fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                        color: "#aaa",
                        lineHeight: "1.7"
                    }}>
                        Este valor cubre la participación completa en el proceso oficial del certamen y <strong>todos los beneficios descritos</strong>. No es un gasto, es una <span className="accent-text">inversión en tu carrera y marca personal</span>.
                    </p>
                </section>

                {/* WINNER BENEFITS - COMPLETO */}
                <section style={{ marginBottom: "100px" }}>
                    <h2 style={{
                        fontSize: "clamp(2rem, 6vw, 4rem)",
                        textAlign: "center",
                        marginBottom: "20px",
                        textTransform: "uppercase",
                        background: "linear-gradient(135deg, #fff, var(--accent-pink))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text"
                    }}>
                        <FaCrown style={{ color: "var(--accent-pink)" }} /> El Gran Sueño
                    </h2>
                    <p style={{ textAlign: "center", fontSize: "clamp(1.1rem, 3vw, 1.5rem)", marginBottom: "80px", color: "var(--accent-pink)" }}>
                        Beneficios Adicionales para la Ganadora
                    </p>

                    <WinnerBenefit
                        title="Representante Oficial rumbo a Miss Universo Chile 2026"
                        description="Ganar Miss Universo Iquique significa representar oficialmente a la comuna y avanzar al circuito nacional de Miss Universo Chile 2026, accediendo a un nivel superior de exposición, preparación y oportunidades."
                    />

                    <WinnerBenefit
                        title="1. Representación Nacional y Viaje a Santiago"
                        items={[
                            "Reconocimiento oficial como representante comunal ante la Organización Nacional, medios y marcas",
                            "Participación en actividades oficiales del certamen nacional",
                            "Exposición ante audiencias de alcance nacional, abriendo proyección real fuera de la región"
                        ]}
                    />

                    <WinnerBenefit
                        title="2. Participación en un Certamen Nacional Televisado"
                        description="Miss Universo Chile 2026 se realizará en un importante canal de televisión, consolidándose como una de las vitrinas más relevantes del país."
                        items={[
                            "Exposición masiva y reputación pública inmediata",
                            "Fortalecimiento de marca personal con visibilidad nacional",
                            "Proyección mediática y comercial posterior (campañas, embajadurías, eventos)"
                        ]}
                    />

                    <WinnerBenefit
                        title="3. Acceso a un Cronograma Oficial de Alto Valor"
                        description="La ganadora participará en instancias formales diseñadas para medir y potenciar su desempeño integral:"
                        items={[
                            "Imposición oficial de banda y presentación nacional",
                            "Sesiones fotográficas y video profesional oficial",
                            "Masterclass de preparación (pasarela, entrevista, protocolo y desarrollo personal)",
                            "Gira de medios y actividades vinculadas al canal",
                            "Entrevista personal con jurado",
                            "Fashion show y desfiles de alto nivel",
                            "Acción social oficial",
                            "Competencias preliminares (traje de baño, gala e entrevista)",
                            "Gala de coronación transmitida por televisión nacional"
                        ]}
                        highlight="Esto convierte tu participación en una experiencia de élite, con evidencia profesional y alto valor de carrera."
                    />

                    <WinnerBenefit
                        title="4. Preparación con Estándares Nacionales"
                        items={[
                            "Desempeño escénico, presencia y proyección de nivel superior",
                            "Manejo de cámara y entrevistas con técnicas avanzadas",
                            "Disciplina y planificación de imagen profesional",
                            "Comprensión de protocolos, agenda y exigencias de un proyecto televisivo",
                            "Esto acelera tu desarrollo personal y profesional en un entorno competitivo real"
                        ]}
                    />

                    <WinnerBenefit
                        title="5. Credenciales, Contratos y Respaldo Formal"
                        items={[
                            "Contrato con canal de televisión (derecho de imagen y confidencialidad)",
                            "Contrato con la Organización Nacional (uso de imagen, funciones, obligaciones y premios)",
                            "Claridad de acuerdos respecto a apoyos ofrecidos (vestuario, pasajes, estadías u otros)",
                            "No es una experiencia informal, es una plataforma estructurada y respaldada"
                        ]}
                    />

                    <WinnerBenefit
                        title="6. Ventana Real de Oportunidades y Networking Nacional"
                        items={[
                            "Marcas auspiciadoras de mayor tamaño y alcance nacional",
                            "Medios de comunicación nacionales de primer nivel",
                            "Profesionales del rubro (productores, estilistas, agencias y equipos creativos)",
                            "Redes del directorio nacional del certamen",
                            "Esto abre posibilidades concretas de colaboraciones y oportunidades post-certamen"
                        ]}
                    />

                    <WinnerBenefit
                        title="7. Si ganas Miss Universo Chile: Proyección Internacional y Contrato Millonario"
                        description="Si la representante de Iquique obtiene el título de Miss Universo Chile, inicia una nueva etapa bajo responsabilidad exclusiva de la Organización Nacional, que se encarga de su preparación rumbo a Miss Universe."
                        items={[
                            "Firma de un contrato de alto valor económico (contrato millonario)",
                            "Representante oficial de Chile a nivel internacional",
                            "Acceso a un ciclo de preparación de nivel superior",
                            "Compromisos oficiales, mediáticos y comerciales de alto perfil",
                            "Transformación en una figura pública nacional con proyección global"
                        ]}
                        highlight="Este es el nivel máximo de proyección profesional y comercial al que puedes aspirar."
                    />
                </section>

                {/* Final CTA */}
                <div style={{
                    marginTop: "100px",
                    textAlign: "center",
                    padding: "80px 30px",
                    background: "linear-gradient(135deg, rgba(245,36,95,0.05), transparent)",
                    borderRadius: "30px"
                }}>
                    <h3 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", marginBottom: "30px" }}>
                        ¿Lista para comenzar tu transformación?
                    </h3>
                    <a href="/casting" className="btn-primary" style={{
                        padding: "clamp(15px, 3vw, 25px) clamp(40px, 8vw, 80px)",
                        fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "15px",
                        borderRadius: "50px",
                        boxShadow: "0 10px 40px rgba(245,36,95,0.3)"
                    }}>
                        Postula Ahora <FaArrowRight />
                    </a>
                </div>
            </div>
        </main>
    );
}

// COMPONENTS

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div style={{
            background: "rgba(255,255,255,0.02)",
            padding: "clamp(30px, 5vw, 50px)",
            borderRadius: "20px",
            border: "1px solid rgba(245,36,95,0.1)",
            textAlign: "center",
            transition: "all 0.3s ease"
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.borderColor = "rgba(245,36,95,0.4)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(245,36,95,0.1)";
            }}>
            <div style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--accent-pink)", marginBottom: "20px" }}>{icon}</div>
            <h3 style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "2px" }}>{title}</h3>
            <p style={{ color: "#aaa", lineHeight: "1.7", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>{desc}</p>
        </div>
    );
}

function BenefitDetail({ number, icon, title, subtitle, items }: { number: string, icon: any, title: string, subtitle?: string, items: string[] }) {
    return (
        <div style={{
            marginBottom: "80px",
            padding: "clamp(30px, 6vw, 60px)",
            background: "rgba(255,255,255,0.01)",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.05)",
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                fontSize: "clamp(4rem, 15vw, 10rem)",
                fontWeight: "900",
                color: "rgba(245,36,95,0.03)",
                lineHeight: "1"
            }}>
                {number}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px", flexWrap: "wrap" }}>
                <div style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--accent-pink)" }}>{icon}</div>
                <div>
                    <h3 style={{ fontSize: "clamp(1.3rem, 3.5vw, 2rem)", marginBottom: subtitle ? "8px" : "0", textTransform: "uppercase" }}>{title}</h3>
                    {subtitle && <p style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "#999", fontStyle: "italic" }}>{subtitle}</p>}
                </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {items.map((item, idx) => (
                    <li key={idx} style={{
                        marginBottom: "18px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "15px",
                        fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
                        lineHeight: "1.7"
                    }}>
                        <FaCheck style={{ color: "var(--accent-pink)", flexShrink: 0, marginTop: "6px" }} size={14} />
                        <span style={{ color: "#ccc" }}>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PriceBox({ label, price, currency, highlight = false, sub = "" }: { label: string, price: string, currency: string, highlight?: boolean, sub?: string }) {
    return (
        <div style={{
            padding: "clamp(25px, 5vw, 45px)",
            border: highlight ? "3px solid var(--accent-pink)" : "1px solid #444",
            borderRadius: "24px",
            minWidth: "clamp(200px, 40vw, 300px)",
            background: highlight ? "rgba(245, 36, 95, 0.08)" : "rgba(255,255,255,0.02)",
            position: "relative",
            transition: "all 0.3s ease"
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
            {highlight && (
                <div style={{
                    position: "absolute",
                    top: "-15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--accent-pink)",
                    padding: "5px 20px",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "1px"
                }}>
                    ¡Aprovecha!
                </div>
            )}
            <div style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.9rem)", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "15px", color: highlight ? "var(--accent-pink)" : "#999" }}>{label}</div>
            <div style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: "900", marginBottom: "8px" }}>{price}</div>
            <div style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)", color: "#999" }}>{currency}</div>
            {sub && <div style={{ fontSize: "clamp(0.7rem, 1.8vw, 0.85rem)", marginTop: "15px", color: "var(--accent-pink)", fontWeight: "bold" }}>{sub}</div>}
        </div>
    );
}

function WinnerBenefit({ title, description, items, highlight }: { title: string, description?: string, items?: string[], highlight?: string }) {
    return (
        <div style={{
            background: "linear-gradient(135deg, rgba(245,36,95,0.05), rgba(245,36,95,0.01))",
            padding: "clamp(35px, 6vw, 60px)",
            borderRadius: "24px",
            border: "1px solid rgba(245,36,95,0.2)",
            marginBottom: "40px"
        }}>
            <h3 style={{
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                marginBottom: description || items ? "20px" : "0",
                color: "var(--accent-pink)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap"
            }}>
                <FaStar size={20} /> {title}
            </h3>

            {description && <p style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", lineHeight: "1.8", color: "#ccc", marginBottom: items ? "25px" : "0" }}>{description}</p>}

            {items && (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {items.map((item, idx) => (
                        <li key={idx} style={{
                            marginBottom: "15px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                            lineHeight: "1.7"
                        }}>
                            <FaCheck style={{ color: "var(--accent-pink)", flexShrink: 0, marginTop: "5px" }} size={12} />
                            <span style={{ color: "#ccc" }}>{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            {highlight && (
                <div style={{
                    marginTop: "25px",
                    padding: "20px",
                    background: "rgba(245,36,95,0.1)",
                    borderRadius: "12px",
                    borderLeft: "4px solid var(--accent-pink)",
                    fontSize: "clamp(0.9rem, 2vw, 1.05rem)",
                    fontStyle: "italic",
                    color: "#ddd"
                }}>
                    <strong>💡 {highlight}</strong>
                </div>
            )}
        </div>
    );
}
