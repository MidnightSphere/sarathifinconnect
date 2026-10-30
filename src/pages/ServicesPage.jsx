import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import ServicesHero from "../components/services/ServicesHero";
import LoanGrid from "../components/services/LoanGrid";
import AdvisorStrip from "../components/services/AdvisorStrip";
import "../components/services/ServicesPage.css";

export default function ServicesPage() {
  return (
    <div className="services-page min-h-screen overflow-x-clip text-brand-navy">
      <Navbar />
      <main>
        <ServicesHero />
        <LoanGrid />
        <section className="bg-[#f8fafc] px-4 pb-14 sm:px-6 md:pb-20" aria-label="Talk to an advisor">
          <div className="mx-auto max-w-7xl"><AdvisorStrip /></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
