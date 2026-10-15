"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PresaleModal from "@/components/ui/PresaleModal";

export default function HeaderExact() {
    const [scrolled, setScrolled] = useState(false);
    const [logo, setLogo] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [regEnabled, setRegEnabled] = useState(true);
    const [showPresale, setShowPresale] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            const href = link?.getAttribute('href');

            if (href && href.startsWith('/#') && href !== '/#') {
                e.preventDefault();
                const id = href.replace('/#', '');
                const element = document.getElementById(id);
                if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                    setIsMenuOpen(false);
                }
            }
        };
        document.addEventListener('click', handleClick);

        fetch("/api/admin/settings", { cache: 'no-store' })
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if (Array.isArray(data)) {
                    const logoSetting = data.find((s: any) => s.key === "SITE_LOGO");
                    if (logoSetting) setLogo(logoSetting.value);
                    const regSetting = data.find((s: any) => s.key === "REGISTRATION_ENABLED");
                    if (regSetting?.value === "false") setRegEnabled(false);
                }
            })
            .catch(err => console.error("Error loading logo", err));

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add("mobile-nav-active");
        } else {
            document.body.classList.remove("mobile-nav-active");
        }
    }, [isMenuOpen]);

    const navLinks = [
        { name: "INICIO",      href: "/" },
        { name: "RANKING",     href: "/ranking-candidatas" },
        { name: "CANDIDATAS",  href: "/#models" },
        { name: "SPONSORS",    href: "/sponsors" },
        { name: "ENTRADAS",    href: "/#entradas", highlight: true },
        { name: "PANEL",       href: "/dashboard" },
    ];

    return (
        <header style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 2000,
            transition: "all 0.3s ease",
            backgroundColor: scrolled || isMenuOpen ? "rgba(22, 23, 29, 0.98)" : "transparent",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
            padding: scrolled ? "10px 0" : "20px 0"
        }}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="logo" style={{ position: "relative", zIndex: 2020 }}>
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        {logo ? (
                            <img
                                src={logo}
                                alt="MU Iquique Logo"
                                className="site-logo"
                                style={{
                                    height: scrolled ? "45px" : "80px",
                                    transition: "all 0.4s ease",
                                    position: "relative",
                                    top: scrolled ? "0px" : "15px",
                                }}
                            />
                        ) : (
                            <div style={{
                                fontFamily: "var(--font-raleway)",
                                fontSize: "18px",
                                fontWeight: "800",
                                color: "white",
                                letterSpacing: "2px",
                                textTransform: "uppercase"
                            }}>
                                MU <span className="accent-text">IQUIQUE</span>
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="desktop-only">
                    <ul style={{ display: "flex", gap: "25px", listStyle: "none", margin: 0, padding: 0 }}>
                        {navLinks.map((link) => (
                            <li key={link.name} className={link.name === "RANKING" ? "nav-item-has-submenu" : ""}>
                                <Link
                                    href={link.href}
                                    style={link.highlight ? {
                                        fontFamily: "var(--font-raleway)",
                                        fontSize: "11px", fontWeight: "900",
                                        color: "white", letterSpacing: "1px",
                                        textTransform: "uppercase",
                                        background: "linear-gradient(135deg, #f5245f, #9e0e41)",
                                        padding: "8px 18px", borderRadius: "8px",
                                        boxShadow: "0 4px 15px rgba(245,36,95,0.4)",
                                        transition: "all 0.3s ease",
                                        display: "inline-flex", alignItems: "center", gap: "6px"
                                    } : {
                                        fontFamily: "var(--font-raleway)",
                                        fontSize: "11px", fontWeight: "700",
                                        color: pathname === link.href ? "var(--accent-pink)" : "white",
                                        letterSpacing: "1px", textTransform: "uppercase",
                                        transition: "color 0.3s ease",
                                        display: "flex", alignItems: "center"
                                    }}
                                >
                                    {link.highlight ? "🎫 " : ""}{link.name}
                                    {link.name === "RANKING" && <span style={{ marginLeft: "5px", fontSize: "8px" }}>▼</span>}
                                </Link>
                                {link.name === "RANKING" && (
                                    <ul className="nav-submenu">
                                        <li>
                                            <Link href="/reyes-de-la-corona">VOTOS VIP</Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                <button
                    className="mobile-only menu-toggle-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="mobile-menu-overlay"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            {navLinks.map((link) => (
                                <div key={link.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                    <Link
                                        href={link.href}
                                        className="mobile-menu-link"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                    {link.name === "RANKING" && (
                                        <Link
                                            href="/reyes-de-la-corona"
                                            className="mobile-menu-link"
                                            style={{ fontSize: '14px', opacity: 0.7, marginTop: '-5px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            ↳ VOTOS VIP
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <div style={{ marginTop: "40px" }}>
                                <Link
                                    href="/#entradas"
                                    onClick={() => { setIsMenuOpen(false); }}
                                    className="btn-primary"
                                    style={{ border: "none", textDecoration: "none", display: "inline-block" }}
                                >
                                    COMPRA TU ENTRADA
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <PresaleModal isOpen={showPresale} onClose={() => setShowPresale(false)} />
        </header>
    );
}
