import { useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/layout/Footer";
import OurStory from "../../components/about/ported/OurStory";
import WhoWeAre from "../../components/about/ported/WhoWeAre";
import PrinciplesSection from "../../components/about/ported/PrinciplesSection";
import SarathiNameStory from "../../components/about/ported/SarathiNameStory";
import LeadershipSection from "../../components/about/ported/LeadershipSection";
import WhatWeDoSection from "../../components/about/ported/WhatWeDoSection";

export default function AboutPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "About Us | Sarathi FinConnect";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <WhoWeAre />
        <OurStory />
        <PrinciplesSection />
        <SarathiNameStory />
        <LeadershipSection />
        <WhatWeDoSection />
      </main>
      <Footer />
    </>
  );
}
