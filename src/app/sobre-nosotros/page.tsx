import HeaderExact from "@/components/layout/HeaderExact";
import FooterExact from "@/components/layout/FooterExact";
import AboutExact from "@/components/home/AboutExact";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function SobreNosotrosPage() {
    return (
        <div className="main-wrapper">
            <HeaderExact />

            {/* Simple Hero/Header for the page */}
            <section style={{
                padding: "160px 0 80px",
                background: "var(--secondary-bg)",
                textAlign: "center",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
                <div className="container">
                    <h4 className="serif-italic accent-text" style={{ fontSize: "1.2rem", marginBottom: "10px" }}>Nuestra Organización</h4>
                    <h1 style={{ fontSize: "3rem", textTransform: "uppercase", letterSpacing: "4px" }}>SOBRE <span className="accent-text">NOSOTROS</span></h1>
                </div>
            </section>

            <ScrollReveal direction="up">
                <AboutExact />
            </ScrollReveal>

            {/* You might want to add more sections here later, like History if it's also moved */}

            <FooterExact />
        </div>
    );
}
