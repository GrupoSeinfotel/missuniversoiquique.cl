"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaBars, FaTimes, FaChartPie, FaCrown, FaImages, FaHandshake, 
    FaFolderOpen, FaCamera, FaBullhorn, FaLayerGroup, FaFileAlt, 
    FaBullseye, FaVoteYea, FaKey, FaUsers, FaSignOutAlt, 
    FaArrowLeft, FaFingerprint, FaFire, FaTicketAlt, FaShieldAlt, FaPlusCircle 
} from "react-icons/fa";

interface AdminSidebarProps {
    userEmail?: string | null;
    userRole?: string | null;
}

export default function AdminSidebar({ userEmail, userRole }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Close sidebar on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const isJuan = userEmail?.toLowerCase()?.startsWith("juan@");

    // Nav Item Component
    const NavLink = ({ href, icon, label, active, color }: { href: string, icon: React.ReactNode, label: string, active: boolean, color?: string }) => (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                textDecoration: "none",
                background: active ? "rgba(245, 36, 95, 0.15)" : "transparent",
                color: active ? "var(--accent-pink)" : (color || "rgba(255,255,255,0.7)"),
                border: active ? "1px solid rgba(245, 36, 95, 0.3)" : "1px solid transparent",
                marginBottom: "4px",
                backdropFilter: active ? "blur(10px)" : "none",
            }}
            onMouseOver={(e) => {
                if (!active) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#fff";
                }
            }}
            onMouseOut={(e) => {
                if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = color || "rgba(255,255,255,0.7)";
                }
            }}
        >
            <span style={{ 
                fontSize: "18px", 
                width: "24px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                filter: active ? "drop-shadow(0 0 8px var(--accent-pink))" : "none"
            }}>{icon}</span>
            <span style={{ letterSpacing: "0.3px" }}>{label}</span>
        </Link>
    );

    return (
        <>
            {/* Global Styles for Scrollbar and Glassmorphism */}
            <style jsx global>{`
                .admin-sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .admin-sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .admin-sidebar-scroll::-webkit-scrollbar-thumb {
                    background: rgba(245, 36, 95, 0.3);
                    border-radius: 10px;
                }
                .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: var(--accent-pink);
                }
                .admin-sandwich-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 20px rgba(245, 36, 95, 0.4);
                }
                .accent-text-glow {
                    text-shadow: 0 0 15px rgba(245, 36, 95, 0.5);
                }
            `}</style>

            {/* Toggle Button (Universal) */}
            <div style={{
                position: "fixed",
                top: "20px",
                left: "20px",
                zIndex: 1000,
            }}>
                <button
                    onClick={toggleSidebar}
                    className="admin-sandwich-btn"
                    style={{
                        background: "linear-gradient(135deg, var(--accent-pink), #ff4d8d)",
                        color: "white",
                        border: "none",
                        width: "50px",
                        height: "50px",
                        borderRadius: "15px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.6)",
                        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        outline: "none"
                    }}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay with high-end blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.4)",
                                zIndex: 998,
                                backdropFilter: "blur(8px)"
                            }}
                        />

                        <motion.aside
                            initial={{ x: -320, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -320, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="admin-sidebar-scroll"
                            style={{
                                width: isMobile ? "100%" : "320px",
                                maxWidth: "320px",
                                background: "rgba(10, 10, 10, 0.95)",
                                borderRight: "1px solid rgba(255,255,255,0.05)",
                                padding: "100px 25px 40px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                position: "fixed",
                                top: 0,
                                left: 0,
                                height: "100vh",
                                zIndex: 999,
                                overflowY: "auto",
                                overflowX: "hidden",
                                backdropFilter: "blur(20px)",
                                boxShadow: "20px 0 50px rgba(0,0,0,0.8)"
                            }}
                        >
                            <div style={{ 
                                fontWeight: "900", 
                                fontSize: "1.4rem", 
                                marginBottom: "40px", 
                                letterSpacing: "2px", 
                                textAlign: "center", 
                                paddingBottom: "30px", 
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                color: "#fff"
                            }}>
                                <span className="accent-text-glow">ADMIN</span> PANEL
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                                {userRole === "DIRECTOR" ? (
                                    <>
                                        <div style={{ 
                                            background: "rgba(245, 36, 95, 0.1)", 
                                            padding: "20px", 
                                            borderRadius: "15px", 
                                            border: "1px dashed var(--accent-pink)",
                                            marginBottom: "20px",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ color: "var(--accent-pink)", fontWeight: "900", fontSize: "12px", marginBottom: "5px" }}>CERTAMEN FINALIZADO</div>
                                            <div style={{ color: "#888", fontSize: "10px" }}>PRÓXIMA APERTURA 2027</div>
                                        </div>
                                        <NavLink href="/admin" icon={<FaChartPie />} label="Resumen" active={pathname === "/admin"} />
                                        <NavLink href="/admin/sponsors" icon={<FaHandshake />} label="Patrocinadores" active={pathname.includes("/sponsors")} />
                                        <NavLink href="/admin/anuncios" icon={<FaBullhorn />} label="Anuncios (Home)" active={pathname.includes("/anuncios")} />
                                        <NavLink href="/admin/perfil" icon={<FaKey />} label="Cambiar Contraseña" active={pathname.includes("/perfil")} />
                                    </>
                                ) : (
                                    <>
                                        <NavLink href="/admin" icon={<FaChartPie />} label="Resumen General" active={pathname === "/admin"} />
                                        <NavLink href="/admin/preventa" icon={<FaTicketAlt />} label="Preventa Entradas" active={pathname.includes("/preventa")} color="#00ff88" />
                                        <NavLink href="/admin/entradas/lista" icon={<FaTicketAlt />} label="🎟️ Venta de Entradas" active={pathname.includes("/entradas/lista")} color="#f5a623" />
                                        {isJuan && <NavLink href="/admin/entradas/nuevo" icon={<FaPlusCircle />} label="✨ Emitir Entradas" active={pathname.includes("/entradas/nuevo")} color="#C8FF0B" />}
                                        {isJuan && <NavLink href="/admin/entradas/ventas" icon={<FaChartPie />} label="📊 Reporte de Ventas" active={pathname.includes("/entradas/ventas")} color="#C8FF0B" />}
                                        <NavLink href="/admin/entradas/metas" icon={<FaBullseye />} label="🎯 Metas de Tickets" active={pathname.includes("/entradas/metas")} color="#f5245f" />
                                        <NavLink href="/admin/analisis" icon={<FaChartPie />} label="Análisis Compromiso" active={pathname.includes("/analisis")} color="#C8FF0B" />
                                        <NavLink href="/admin/payments" icon={<FaHandshake />} label="Reporte Financiero" active={pathname.includes("/payments")} color="#C8FF0B" />
                                        <NavLink href="/admin/candidatas" icon={<FaCrown />} label="Candidatas" active={pathname.includes("/candidatas")} />
                                        <NavLink href="/admin/galeria" icon={<FaImages />} label="Galería de Fotos" active={pathname.includes("/galeria")} />
                                        <NavLink href="/admin/sponsors" icon={<FaHandshake />} label="Patrocinadores" active={pathname.includes("/sponsors")} />
                                        <NavLink href="/admin/assets" icon={<FaFolderOpen />} label="Recursos de Marca" active={pathname.includes("/assets")} />
                                        <NavLink href="/admin/fotografia" icon={<FaCamera />} label="Estudio Foto" active={pathname.includes("/fotografia")} />
                                        <NavLink href="/admin/anuncios" icon={<FaBullhorn />} label="Anuncios" active={pathname.includes("/anuncios")} />
                                        <NavLink href="/admin/slider" icon={<FaLayerGroup />} label="Slider Editor" active={pathname.includes("/slider")} />
                                        <NavLink href="/admin/cms" icon={<FaFileAlt />} label="Gestor de Contenido" active={pathname.includes("/cms")} />
                                        <NavLink href="/admin/missions" icon={<FaBullseye />} label="Misiones Sociales" active={pathname.includes("/missions")} />
                                        <NavLink href="/admin/votos" icon={<FaVoteYea />} label="Registro Votos" active={pathname.includes("/votos")} />
                                        <NavLink href="/admin/perfil" icon={<FaKey />} label="Cambiar Contraseña" active={pathname.includes("/perfil")} />

                                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "20px 0" }}></div>
                                        <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", padding: "0 20px 10px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: "800" }}>Vista Programas</div>
                                        <NavLink href="/admin/referidos" icon={<FaUsers />} label="Programa de Referidos" active={pathname.includes("/referidos")} color="#60a5fa" />
                                        <NavLink href="/admin/sponsors-view" icon={<FaHandshake />} label="Programa de Sponsors" active={pathname.includes("/sponsors-view")} color="#60a5fa" />

                                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "20px 0" }}></div>
                                        <NavLink href="/admin/mensajes" icon={<FaBullhorn />} label="Mensajes Candidatas" active={pathname === "/admin/mensajes"} color="#C8FF0B" />
                                        <NavLink href="/admin/chat-directores" icon={<FaUsers />} label="Chat Directores" active={pathname === "/admin/chat-directores"} color="#C8FF0B" />

                                        {isJuan && (
                                            <>
                                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", margin: "20px 0" }}></div>
                                                <NavLink href="/admin/happy-hour" icon={<FaFire />} label="Hora Feliz 🔥" active={pathname === "/admin/happy-hour"} color="#f5245f" />
                                                <NavLink href="/admin/seguridad" icon={<FaShieldAlt />} label="Seguridad y Blindaje" active={pathname === "/admin/seguridad"} color="#C8FF0B" />
                                                <NavLink href="/admin/auditoria" icon={<FaFingerprint />} label="Auditoría de Votos" active={pathname === "/admin/auditoria"} color="#C8FF0B" />
                                                <NavLink href="/admin/directors" icon={<FaUsers />} label="Gestión Directores" active={pathname.includes("/directors")} color="var(--accent-pink)" />
                                            </>
                                        )}
                                    </>
                                )}
                            </div>

                            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "5px", paddingTop: "30px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <NavLink href="/dashboard" icon={<FaArrowLeft />} label="Volver al Portal" active={false} color="#888" />
                                <form action="/api/auth/logout" method="POST" style={{ width: "100%" }}>
                                    <button type="submit" style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "14px",
                                        padding: "12px 20px",
                                        borderRadius: "12px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        background: "transparent",
                                        color: "#ff4d4d",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,77,77,0.1)"}
                                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span style={{ fontSize: "18px", width: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}><FaSignOutAlt /></span>
                                        Cerrar Sesión
                                    </button>
                                </form>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence >
        </>
    );
}
