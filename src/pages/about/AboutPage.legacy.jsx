import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import AboutUs from "../../components/about/AboutUs";

export default function AboutPageLegacy() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
