import HeaderExact from "@/components/layout/HeaderExact";
import HeroExact from "@/components/home/HeroExact";
import TicketHeroSection from "@/components/home/TicketHeroSection";
import HistoryExact from "@/components/home/HistoryExact";
import HallOfFameExact from "@/components/home/HallOfFameExact";
import CrownWall from "@/components/home/CrownWall";
import ModelGridExact from "@/components/home/ModelGridExact";
import RequirementsExact from "@/components/home/RequirementsExact";
import TimelineExact from "@/components/home/TimelineExact";
import SponsorsExact from "@/components/home/SponsorsExact";
import InstagramExact from "@/components/home/InstagramExact";
import ContactFAQ from "@/components/home/ContactFAQ";
import FooterExact from "@/components/layout/FooterExact";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function Home() {
  const referralId = null;

  
  return (
    <div className="main-wrapper">
      <HeaderExact />
      <HeroExact />

      {/* ★ SECCIÓN COMPRA TU ENTRADA — Asociada a candidata si existe referralId ★ */}
      <TicketHeroSection candidateId={referralId} />

      <ModelGridExact />

      <ScrollReveal direction="up">
        <RequirementsExact />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <HistoryExact />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <CrownWall />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <TimelineExact />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <HallOfFameExact />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <ContactFAQ />
      </ScrollReveal>

      <ScrollReveal direction="up">
        <SponsorsExact />
      </ScrollReveal>

      <InstagramExact />

      <FooterExact />
    </div>
  );
}
