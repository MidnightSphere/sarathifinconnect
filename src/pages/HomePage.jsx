import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import Journey from "../components/journey/Journey";
import AboutUs from "../components/about/AboutUs";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <AboutUs />
      </main>
      <footer className="border-t border-border px-5 py-8 text-center text-xs font-medium tracking-wide text-text-secondary">
        © {new Date().getFullYear()} Sarathi FinConnect Advisory LLP. Guidance for every journey.
      </footer>
    </>
  );
}
