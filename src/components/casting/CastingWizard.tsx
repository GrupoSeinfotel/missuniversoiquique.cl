"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaLock, FaFileAlt, FaUser, FaCamera, FaVideo, FaCheck } from "react-icons/fa";

interface User {
    id: string;
    email: string;
    role: string;
}

export default function CastingWizard({ user: initialUser }: { user: User | null }) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [wizardStep, setWizardStep] = useState(user ? 2 : 1); // 1: Bases & Auth, 2: Info, 3: Fotos, 4: Video, 5: Submit

    // Auth State
    const [authData, setAuthData] = useState({ email: "", password: "", confirmPassword: "" });
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [authError, setAuthError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    // Casting Data
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: "",
        height: "",
        instagram: "",
        whatsapp: "",
        bio: "",
        videoPitch: "",
        signed: false,
        bust: "",
        waist: "",
        hips: "",
        shoeSize: "",
        clothesSize: ""
    });
    const [videoMode, setVideoMode] = useState<'link' | 'upload'>('link');
    const [photos, setPhotos] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState<string | null>(null);

    const handleFileUpload = async (type: string, pendingFile: File) => {
        let file = pendingFile;
        // Convert HEIC/HEIF to JPEG if necessary (client side)
        if (type !== 'video') {
            const { convertHeicToJpegIfNeeded } = await import('@/lib/heicConverter');
            file = await convertHeicToJpegIfNeeded(file);
        }

        // Validation: Max 10MB for photos, 50MB for videos
        const maxSize = type === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`El archivo es demasiado grande. Máximo permitido: ${type === 'video' ? '50MB' : '10MB'}`);
            return;
        }

        setUploading(type);
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("type", type);

        const res = await fetch("/api/casting/upload", {
            method: "POST",
            body: uploadData,
        });

        if (res.ok) {
            const data = await res.json();
            if (type === 'video') {
                setFormData(prev => ({ ...prev, videoPitch: data.url }));
            } else {
                setPhotos(prev => ({ ...prev, [type]: data.url }));
            }
        } else {
            const error = await res.json().catch(() => ({ error: `Status ${res.status}` }));
            alert(`Error al subir archivo: ${error.error || res.statusText}`);
        }
        setUploading(null);
    };

    const handleRegister = async () => {
        setAuthError("");
        if (!termsAccepted) {
            setAuthError("Debes aceptar los términos y condiciones para continuar.");
            return;
        }
        if (!authData.email || !authData.password) {
            setAuthError("Completa todos los campos de acceso.");
            return;
        }
        if (authData.password !== authData.confirmPassword) {
            setAuthError("Las contraseñas no coinciden.");
            return;
        }

        setIsRegistering(true);
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify({ email: authData.email, password: authData.password }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (res.ok) {
                // Account created and logged in
                setUser({ id: "temp", email: authData.email, role: "VOTER" }); // We don't need the real ID yet
                setWizardStep(2);
            } else {
                setAuthError(data.error || "Error al crear cuenta");
            }
        } catch (e) {
            setAuthError("Error de conexión");
        }
        setIsRegistering(false);
    };

    const handleSubmitCasting = async () => {
        if (!formData.fullName || !formData.birthDate || !formData.height || !formData.whatsapp) {
            alert("Completa todos los datos personales obligatorios (incluyendo WhatsApp).");
            setWizardStep(2);
            return;
        }

        const requiredPhotos = ['FACE', 'PROFILE', 'FULL_BODY', 'EDITORIAL'];
        const missingPhotos = requiredPhotos.filter(type => !photos[type]);
        if (missingPhotos.length > 0) {
            alert("Sube todas las fotos requeridas.");
            setWizardStep(3);
            return;
        }

        const res = await fetch("/api/casting/apply", {
            method: "POST",
            body: JSON.stringify({ ...formData, photos }),
            headers: { "Content-Type": "application/json" }
        });

        if (res.ok) {
            window.location.href = "/dashboard";
        } else {
            const data = await res.json();
            alert(data.error || "Error al enviar postulación");
        }
    };

    const nextStep = () => setWizardStep(s => s + 1);
    const prevStep = () => setWizardStep(s => s - 1);

    const steps = [
        { id: 1, title: "Registro y Bases", icon: <FaFileAlt /> },
        { id: 2, title: "Datos Personales", icon: <FaUser /> },
        { id: 3, title: "Fotos Oficiales", icon: <FaCamera /> },
        { id: 4, title: "Video Pitch", icon: <FaVideo /> },
        { id: 5, title: "Confirmación", icon: <FaCheck /> }
    ];

    return (
        <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "var(--secondary-bg)",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
        }}>
            {/* Header / Progress */}
            <div style={{
                padding: "30px",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                {steps.map((s) => (
                    <div key={s.id} style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        opacity: s.id === wizardStep ? 1 : (s.id < wizardStep ? 0.6 : 0.3),
                        transition: "all 0.3s ease"
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: s.id <= wizardStep ? "var(--accent-pink)" : "rgba(255,255,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            color: "white",
                            boxShadow: s.id === wizardStep ? "0 0 15px var(--accent-pink)" : "none"
                        }}>
                            {s.id < wizardStep ? <FaCheckCircle /> : s.icon}
                        </div>
                        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ padding: "40px", minHeight: "450px" }}>
                <AnimatePresence mode="wait">
                    {wizardStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Bases del Concurso y Términos</h3>
                            <div style={{
                                height: "300px",
                                overflowY: "auto",
                                padding: "20px",
                                background: "var(--primary-bg)",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.05)",
                                fontSize: "13px",
                                color: "var(--text-gray)",
                                lineHeight: "1.6",
                                marginBottom: "25px"
                            }}>
                                <h4 style={{ color: "white", marginBottom: "15px", textTransform: "uppercase", fontSize: "14px" }}>BASES PÚBLICAS DE POSTULACIÓN<br />MISS UNIVERSO (FRANQUICIA REGIONAL) – PROCESO 2026</h4>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>PRESENTACIÓN</p>
                                <p>Este proceso busca seleccionar a la representante oficial de la región para el ciclo 2026. El certamen promueve la participación de mujeres chilenas con vocación de liderazgo, presencia escénica, compromiso y proyección pública.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>REQUISITOS DE PARTICIPACIÓN</p>
                                <p>Para postular, la candidata debe cumplir con lo siguiente:</p>
                                <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                                    <li><strong>Nacionalidad:</strong> Ser chilena (no se aceptan postulaciones de extranjeras, aunque cuenten con permanencia definitiva u otra condición migratoria).</li>
                                    <li><strong>Edad mínima:</strong> Tener 18 años cumplidos al 1 de enero de 2026.</li>
                                    <li><strong>Residencia / vínculo regional:</strong> Contar con vínculo real con la región (residencia, estudios, trabajo o desarrollo de vida en la zona).</li>
                                    <li><strong>Concurso inclusivo:</strong> No existen requisitos adicionales de estatura, medidas, estado civil, maternidad u otros criterios tradicionales.</li>
                                </ul>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>INSCRIPCIÓN</p>
                                <p>La postulación se realiza mediante el formulario oficial del certamen. La organización podrá solicitar documentación para validar identidad y requisitos.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>PROCESO DE SELECCIÓN</p>
                                <p>El proceso puede incluir, según planificación:</p>
                                <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                                    <li>Revisión de antecedentes de postulación.</li>
                                    <li>Contacto por parte del equipo para coordinación.</li>
                                    <li>Entrevistas (online o presenciales).</li>
                                    <li>Actividades de evaluación y/o casting presencial.</li>
                                    <li>Selección de candidatas por etapas.</li>
                                </ul>
                                <p>La organización se reserva el derecho de definir fechas, formatos y etapas según necesidades operativas.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>COMPROMISO Y DISPONIBILIDAD</p>
                                <p>Las candidatas preseleccionadas deberán contar con disponibilidad para participar en actividades oficiales y contenidos de difusión del proceso (grabaciones, sesiones, eventos, etc.) en fechas previamente informadas. Los requerimientos específicos de preparación, presentación y participación se comunicarán directamente a las candidatas que avancen en el proceso.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>CONDUCTA Y REPRESENTACIÓN</p>
                                <p>La candidata debe mantener una conducta acorde a una representante pública del certamen, respetando a la organización, al equipo, a las demás candidatas y a la comunidad.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>CAUSALES DE DESCALIFICACIÓN</p>
                                <p>La organización podrá descalificar a una candidata si:</p>
                                <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
                                    <li>Entrega información falsa o documentación adulterada.</li>
                                    <li>No cumple requisitos obligatorios (nacionalidad o edad).</li>
                                    <li>Incumple compromisos esenciales de participación una vez confirmada en el proceso.</li>
                                    <li>Realiza acciones graves que dañen la imagen del certamen o vulneren la convivencia y respeto.</li>
                                </ul>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>USO DE IMAGEN</p>
                                <p>Al postular, la candidata autoriza a la organización a utilizar su imagen (foto/video/nombre) en contenidos de difusión relacionados con el proceso, siempre dentro del marco del certamen. En caso de avanzar a etapas posteriores, se podrá solicitar la firma de autorizaciones específicas.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>CONFIDENCIALIDAD DEL PROCESO</p>
                                <p>Ciertos aspectos internos del proyecto (metodología, coordinación, planificación y decisiones) pueden ser reservados. La organización podrá solicitar acuerdos adicionales a candidatas que avancen a etapas definidas.</p>

                                <p style={{ fontWeight: "bold", color: "white", marginTop: "15px" }}>ACEPTACIÓN DE BASES</p>
                                <p>La postulación implica que la candidata declara haber leído y aceptado estas bases.</p>
                            </div>

                            <div style={{
                                padding: "20px",
                                background: "rgba(223, 168, 116, 0.1)", // Sutil tono dorado/piel
                                border: "1px solid rgba(223, 168, 116, 0.2)",
                                borderRadius: "10px",
                                marginBottom: "25px",
                                textAlign: "center"
                            }}>
                                <p style={{ fontSize: "14px", margin: 0, color: "white" }}>
                                    ✨ ¿Sabías que ser candidata tiene grandes ventajas?
                                    <br />
                                    <a href="/beneficios" target="_blank" style={{
                                        color: "var(--accent-pink)",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                        display: "inline-block",
                                        marginTop: "5px"
                                    }}>
                                        CONOCE AQUÍ LOS BENEFICIOS DE PARTICIPAR
                                    </a>
                                </p>
                            </div>

                            <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px", cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={e => setTermsAccepted(e.target.checked)}
                                    style={{ width: "18px", height: "18px" }}
                                />
                                <span style={{ fontSize: "14px" }}>He leído y acepto las Bases del Concurso y los Términos y Condiciones.</span>
                            </label>

                            <hr style={{ border: "0", borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: "30px" }} />

                            <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Configura tu Acceso</h3>
                            <p style={{ color: "var(--text-gray)", fontSize: "14px", marginBottom: "20px" }}>Necesitarás estos datos para entrar a tu perfil de candidata más adelante.</p>

                            {authError && <div style={{ color: "var(--accent-pink)", fontSize: "14px", marginBottom: "15px" }}>{authError}</div>}

                            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    style={inputStyle}
                                    value={authData.email}
                                    onChange={e => setAuthData({ ...authData, email: e.target.value })}
                                />
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <input
                                        type="password"
                                        placeholder="Crea una contraseña"
                                        style={inputStyle}
                                        value={authData.password}
                                        onChange={e => setAuthData({ ...authData, password: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirma contraseña"
                                        style={inputStyle}
                                        value={authData.confirmPassword}
                                        onChange={e => setAuthData({ ...authData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleRegister}
                                className="btn-primary"
                                style={{ width: "100%", marginTop: "30px", height: "55px", fontSize: "16px" }}
                                disabled={isRegistering || !termsAccepted}
                            >
                                {isRegistering ? "CREANDO CUENTA..." : "ACEPTAR Y CONTINUAR"}
                            </button>
                            <p style={{ textAlign: "center", marginTop: "15px", fontSize: "12px", color: "var(--text-gray)" }}>
                                ¿Ya tienes cuenta? <a href="/auth" style={{ color: "var(--accent-pink)" }}>Inicia sesión aquí</a>
                            </p>
                        </motion.div>
                    )}

                    {wizardStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 style={{ fontSize: "24px", marginBottom: "25px" }}>Datos Personales</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div className="form-group">
                                    <label style={labelStyle}>Nombre Completo</label>
                                    <input
                                        type="text"
                                        style={inputStyle}
                                        placeholder="Ej: Maria Ignacia Lopez"
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>WhatsApp (con +569...)</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            placeholder="+56912345678"
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Instagram (sin @)</label>
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            placeholder="mi_perfil"
                                            value={formData.instagram}
                                            onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Fecha de Nacimiento</label>
                                        <input
                                            type="date"
                                            style={inputStyle}
                                            value={formData.birthDate}
                                            onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Estatura (cm)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="175"
                                            value={formData.height}
                                            onChange={e => setFormData({ ...formData, height: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Busto (cm)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="90"
                                            value={formData.bust}
                                            onChange={e => setFormData({ ...formData, bust: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Cintura (cm)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="60"
                                            value={formData.waist}
                                            onChange={e => setFormData({ ...formData, waist: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Cadera (cm)</label>
                                        <input
                                            type="number"
                                            style={inputStyle}
                                            placeholder="90"
                                            value={formData.hips}
                                            onChange={e => setFormData({ ...formData, hips: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                    <div className="form-group">
                                        <label style={labelStyle}>Talla de Calzado</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            style={inputStyle}
                                            placeholder="38"
                                            value={formData.shoeSize}
                                            onChange={e => setFormData({ ...formData, shoeSize: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={labelStyle}>Talla de Ropa (S, M, L...)</label>
                                        <select
                                            style={inputStyle}
                                            value={formData.clothesSize}
                                            onChange={e => setFormData({ ...formData, clothesSize: e.target.value })}
                                        >
                                            <option value="">Selecciona...</option>
                                            <option value="XS">XS</option>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                            <option value="XL">XL</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label style={labelStyle}>Bio Corta / Cuéntanos sobre ti</label>
                                    <textarea
                                        style={{ ...inputStyle, height: "100px", resize: "none" }}
                                        placeholder="Háblanos de tus sueños..."
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
                                <button onClick={nextStep} className="btn-primary" style={{ padding: "12px 50px" }}>CONTINUAR</button>
                            </div>
                        </motion.div>
                    )}

                    {wizardStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 style={{ fontSize: "24px", marginBottom: "25px" }}>Galería Oficial</h3>
                            <p style={{ color: "var(--text-gray)", fontSize: "14px", marginBottom: "25px" }}>Estas fotos serán evaluadas por el jurado inicial.</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                {[
                                    { label: 'Rostro (Frontal)', type: 'FACE' },
                                    { label: 'Perfil', type: 'PROFILE' },
                                    { label: 'Cuerpo Completo', type: 'FULL_BODY' },
                                    { label: 'Editorial / Glam', type: 'EDITORIAL' }
                                ].map((item) => (
                                    <div key={item.type} style={{
                                        position: "relative",
                                        height: "180px",
                                        borderRadius: "12px",
                                        border: photos[item.type] ? "2px solid var(--accent-pink)" : "2px dashed rgba(255,255,255,0.1)",
                                        background: photos[item.type] ? `url(${photos[item.type]}) center/cover` : "rgba(255,255,255,0.01)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease"
                                    }}>
                                        {!photos[item.type] && (
                                            <>
                                                <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{item.label}</span>
                                                <span style={{ fontSize: "24px", marginTop: "10px" }}>{uploading === item.type ? "..." : <FaCamera />}</span>
                                            </>
                                        )}
                                        {photos[item.type] && (
                                            <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "var(--accent-pink)", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
                                                <FaCheck />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(item.type, e.target.files[0])}
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                                <button onClick={prevStep} style={backBtnStyle}>VOLVER</button>
                                <button onClick={nextStep} className="btn-primary" style={{ padding: "12px 50px" }}>CONTINUAR</button>
                            </div>
                        </motion.div>
                    )}

                    {wizardStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 style={{ fontSize: "24px", marginBottom: "25px" }}>Tu Video Pitch</h3>
                            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                                <button
                                    onClick={() => setVideoMode('link')}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: "8px",
                                        background: videoMode === 'link' ? "var(--accent-pink)" : "rgba(255,255,255,0.05)",
                                        color: "white", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold",
                                        transition: "all 0.2s"
                                    }}
                                >USAR LINK EXTERNO</button>
                                <button
                                    onClick={() => setVideoMode('upload')}
                                    style={{
                                        flex: 1, padding: "12px", borderRadius: "8px",
                                        background: videoMode === 'upload' ? "var(--accent-pink)" : "rgba(255,255,255,0.05)",
                                        color: "white", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold",
                                        transition: "all 0.2s"
                                    }}
                                >SUBIR VIDEO DIRECTO</button>
                            </div>

                            {videoMode === 'link' ? (
                                <div className="form-group" style={{ marginBottom: "30px" }}>
                                    <label style={labelStyle}>Link Video Pitch (YouTube/Vimeo/Drive Público)</label>
                                    <input
                                        type="text"
                                        style={inputStyle}
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={formData.videoPitch}
                                        onChange={e => setFormData({ ...formData, videoPitch: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div style={{
                                    marginBottom: "30px",
                                    padding: "40px 20px",
                                    border: (formData.videoPitch && videoMode === 'upload') ? "2px solid var(--accent-pink)" : "2px dashed rgba(255,255,255,0.1)",
                                    borderRadius: "15px",
                                    textAlign: "center",
                                    position: "relative",
                                    background: "rgba(255,255,255,0.01)"
                                }}>
                                    {uploading === 'video' ? (
                                        <div style={{ textAlign: "center" }}>
                                            <p style={{ fontSize: "14px", fontWeight: "bold" }}>SUBIENDO VIDEO...</p>
                                            <p style={{ fontSize: "12px", opacity: 0.6 }}>Por favor no cierres esta pestaña</p>
                                        </div>
                                    ) : (
                                        <>
                                            {(formData.videoPitch && videoMode === 'upload' && formData.videoPitch.startsWith('/uploads/')) ? (
                                                <div style={{ color: "var(--accent-pink)" }}>
                                                    <FaCheckCircle size={40} style={{ marginBottom: "15px" }} />
                                                    <p style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase" }}>Video Cargado</p>
                                                    <p style={{ fontSize: "12px", opacity: 0.6, marginTop: "5px" }}>Listo para enviar</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <FaVideo size={40} style={{ marginBottom: "15px", opacity: 0.2 }} />
                                                    <p style={{ fontSize: "15px", fontWeight: "600" }}>Seleccionar archivo de video</p>
                                                    <p style={{ fontSize: "12px", opacity: 0.5, marginTop: "5px" }}>MP4, MOV o WEBM (Máx 50MB)</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload('video', e.target.files[0])}
                                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                            <div style={{ background: "rgba(245, 36, 95, 0.05)", padding: "25px", borderRadius: "15px", border: "1px solid rgba(245, 36, 95, 0.2)" }}>
                                <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#ccc" }}>
                                    <strong style={{ color: "white" }}>Sugerencia MU:</strong> Graba un video de máximo 1 minuto.
                                    Preséntate, dinos tu nombre, edad, estatura y por qué crees que serías una excelente representante de Iquique ante el Universo.
                                    Asegúrate de que haya buena iluminación y sonido.
                                </p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                                <button onClick={prevStep} style={backBtnStyle}>VOLVER</button>
                                <button onClick={nextStep} className="btn-primary" style={{ padding: "12px 50px" }}>CONTINUAR</button>
                            </div>
                        </motion.div>
                    )}

                    {wizardStep === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            style={{ textAlign: "center" }}
                        >
                            <div style={{ fontSize: "60px", color: "var(--accent-pink)", marginBottom: "20px" }}>
                                <FaCheckCircle />
                            </div>
                            <h3 style={{ fontSize: "28px", marginBottom: "20px" }}>¡Todo Listo!</h3>
                            <p style={{ color: "var(--text-gray)", lineHeight: "1.8", maxWidth: "400px", margin: "0 auto 40px auto" }}>
                                Has completado todos los pasos de la inscripción. Al hacer clic en enviar, tu perfil será enviado a revisión oficial en Iquique.
                            </p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "center" }}>
                                <button
                                    onClick={handleSubmitCasting}
                                    className="btn-primary"
                                    style={{ width: "300px", height: "60px", fontWeight: "900", fontSize: "16px", borderRadius: "30px" }}
                                >
                                    ENVIAR POSTULACIÓN FINAL
                                </button>
                                <button onClick={prevStep} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: "12px" }}>
                                    REVISAR DATOS DE NUEVO
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "15px",
    background: "var(--primary-bg)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    outline: "none",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease"
};

const labelStyle = {
    display: "block",
    marginBottom: "10px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: "1px"
} as const;

const backBtnStyle = {
    background: "transparent",
    color: "#888",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "12px 40px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
} as const;
