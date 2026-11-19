import { useLayoutEffect, useRef } from "react";
import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import Journey from "../components/journey/Journey";
import ServicesReveal from "../components/services-section/ServicesReveal";
import Footer from "../components/layout/Footer";
import ContactSection from "../components/contact/ContactSection";
import HomeFaq from "../components/faq/HomeFaq";
import FloatingMarquee from "../components/ui/FloatingMarquee";

export default function HomePage() {
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const hero = document.getElementById("top");
    if (!page || !hero) return undefined;
    const updatePosition = () => {
      page.style.setProperty("--home-hero-height", `${hero.getBoundingClientRect().height}px`);
    };
    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pageRef} className="home-page-shell">
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <ServicesReveal />
        <ContactSection />
        <HomeFaq />
      </main>
      <Footer />
      <FloatingMarquee />
    </div>
  );
}
