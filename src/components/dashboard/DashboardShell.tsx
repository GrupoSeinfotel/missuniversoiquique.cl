"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import "./Dashboard.css";

interface NavItem {
    id: string;
    icon: string;
    label: string;
    badge?: number;
}

const getNavItems = (role: string): NavItem[] => {
    if (role === "VOTER") {
        return [
            { id: "mis-votos", icon: "🗳️", label: "Mis Votos" },
            { id: "anuncios", icon: "📣", label: "Anuncios" },
            { id: "mensajes", icon: "💬", label: "Mensajes" },
        ];
    }
    return [
        { id: "perfil", icon: "👤", label: "Mi Perfil" },
        { id: "misiones", icon: "🎯", label: "Misiones" },
        { id: "embajadoras", icon: "💎", label: "PROGRAMA DE EMBAJADORAS" },
        { id: "comunidad", icon: "🌟", label: "Refiere una Candidata" },
        { id: "anuncios", icon: "📣", label: "Anuncios" },
        { id: "mensajes", icon: "💬", label: "Mensajes" },
        { id: "guia", icon: "📖", label: "Guía Oficial" },
    ];
};

const getNavItemsWithDynamic = (role: string, isAnalyticsUnlocked: boolean): NavItem[] => {
    const baseItems = getNavItems(role);
    if (isAnalyticsUnlocked) {
        // Insert Analytics before Guia
        const guiaIndex = baseItems.findIndex(i => i.id === "guia");
        if (guiaIndex !== -1) {
            baseItems.splice(guiaIndex, 0, { id: "analisis", icon: "📊", label: "Análisis de Votos" });
        } else {
            baseItems.push({ id: "analisis", icon: "📊", label: "Análisis de Votos" });
        }
    }
    return baseItems;
};

const getBottomNavItems = (role: string): string[] => {
    if (role === "VOTER") return ["mis-votos", "anuncios", "mensajes"];
    return ["perfil", "misiones", "embajadoras", "mensajes"];
};

interface DashboardShellProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
    candidateName?: string;
    candidatePhoto?: string;
    candidateCity?: string;
    candidatePoints?: number;
    userEmail?: string;
    citySlug: string;
    userRole: string;
    pendingAnnouncementsCount?: number;
    isAnalyticsUnlocked?: boolean;
}

export default function DashboardShell({
    children,
    activeTab,
    onTabChange,
    candidateName,
    candidatePhoto,
    candidateCity,
    candidatePoints,
    userEmail,
    citySlug,
    userRole,
    pendingAnnouncementsCount = 0,
    isAnalyticsUnlocked = false,
}: DashboardShellProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Initialize the activity tracker
    useActivityTracker();

    const navItems = getNavItemsWithDynamic(userRole, isAnalyticsUnlocked).map(item => ({
        ...item,
        badge: item.id === "anuncios" && pendingAnnouncementsCount > 0 ? pendingAnnouncementsCount : undefined,
    }));

    const bottomNavItemsIds = getBottomNavItems(userRole);

    const SidebarContent = () => (
        <>
            {/* Brand */}
            <div className="dash-sidebar-brand">
                <span>MU <span className="accent">{citySlug.toUpperCase()}</span></span>
            </div>

            {/* Avatar */}
            <div className="dash-sidebar-avatar">
                {candidatePhoto ? (
                    <img src={candidatePhoto} alt={candidateName} className="dash-avatar-img" />
                ) : (
                    <div className="dash-avatar-placeholder">👸</div>
                )}
                {candidateName && (
                    <div className="dash-sidebar-name">{candidateName}</div>
                )}
                {candidateCity && (
                    <div className="dash-sidebar-city">{candidateCity}</div>
                )}
                {candidatePoints !== undefined && (
                    <div className="dash-sidebar-pts">⭐ {candidatePoints.toLocaleString()} pts</div>
                )}
            </div>

            {/* Nav */}
            <nav className="dash-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`dash-nav-item ${activeTab === item.id ? "active" : ""}`}
                        onClick={() => { onTabChange(item.id); setDrawerOpen(false); }}
                    >
                        <span className="dash-nav-icon">{item.icon}</span>
                        <span className="dash-nav-label">{item.label}</span>
                        {item.badge ? (
                            <span className="dash-nav-badge">{item.badge}</span>
                        ) : null}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="dash-sidebar-footer">
                <div style={{ fontSize: "0.65rem", color: "#333", marginBottom: "10px", textAlign: "center" }}>
                    {userEmail}
                </div>
                <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="dash-logout-btn">
                        <span>🚪</span> Cerrar Sesión
                    </button>
                </form>
            </div>
        </>
    );

    return (
        <div className={`dash-shell ${isCollapsed ? "collapsed" : ""}`}>
            {/* ── SIDEBAR (desktop) ── */}
            <aside className={`dash-sidebar ${isCollapsed ? "collapsed" : ""}`}>
                <div
                    className="sidebar-collapse-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expandir" : "Contraer"}
                >
                    {isCollapsed ? "➡️" : "⬅️"}
                </div>
                <SidebarContent />
            </aside>

            {/* ── DRAWER OVERLAY (mobile) ── */}
            <div
                className={`dash-drawer-overlay ${drawerOpen ? "open" : ""}`}
                onClick={() => setDrawerOpen(false)}
            />

            {/* ── DRAWER (mobile slide-in) ── */}
            <div className={`dash-drawer ${drawerOpen ? "open" : ""}`}>
                <SidebarContent />
            </div>

            {/* ── MOBILE HEADER ── */}
            <header className="dash-mobile-header">
                <span className="dash-mobile-brand">
                    MU <span style={{ color: "var(--dash-accent)" }}>{citySlug.toUpperCase()}</span>
                </span>
                <button
                    className={`dash-hamburger ${drawerOpen ? "open" : ""}`}
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    aria-label="Menú"
                >
                    <span /><span /><span />
                </button>
            </header>

            {/* ── MAIN CONTENT ── */}
            <main className="dash-content">
                {children}
            </main>

            {/* ── BOTTOM NAV (mobile) ── */}
            <nav className="dash-bottom-nav">
                {navItems.filter(i => bottomNavItemsIds.includes(i.id)).map(item => (
                    <button
                        key={item.id}
                        className={`dash-bottom-item ${activeTab === item.id ? "active" : ""}`}
                        onClick={() => onTabChange(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
}
