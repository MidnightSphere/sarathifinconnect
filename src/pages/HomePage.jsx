import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import Journey from "../components/journey/Journey";
import AboutUs from "../components/about/AboutUs";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Journey />
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
