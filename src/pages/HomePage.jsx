import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import Journey from "../components/journey/Journey";
import AboutUs from "../components/about/AboutUs";
import ServicesReveal from "../components/services-section/ServicesReveal";
import Footer from "../components/layout/Footer";
import ContactSection from "../components/contact/ContactSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <ServicesReveal />
        <AboutUs />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
