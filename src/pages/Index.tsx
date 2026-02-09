import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import InfoSection from "@/components/portfolio/InfoSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import AwardsSection from "@/components/portfolio/AwardsSection";
import InternshipsSection from "@/components/portfolio/InternshipsSection";
import CodingProfilesSection from "@/components/portfolio/CodingProfilesSection";
import ResumeSection from "@/components/portfolio/ResumeSection";
import InitiativesSection from "@/components/portfolio/InitiativesSection";
import ContactSection from "@/components/portfolio/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <InfoSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificationsSection />
      <AwardsSection />
      <InternshipsSection />
      <CodingProfilesSection />
      <ResumeSection />
      <InitiativesSection />
      <ContactSection />
    </div>
  );
};

export default Index;
