import Navbar from "../components/navbar/Navbar";
import Footer from "../components/layout/Footer";
import EmiCalculator from "../components/emi/EmiCalculator";

export default function EmiCalculatorPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-surface text-brand-navy">
      <Navbar />
      <main className="px-4 pb-16 pt-32 sm:px-6 md:pb-24 md:pt-40">
        <EmiCalculator variant="page" showLoanSelector />
      </main>
      <Footer />
    </div>
  );
}
