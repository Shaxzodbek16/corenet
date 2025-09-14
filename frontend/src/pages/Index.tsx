import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Header } from "@/components/navigation/Header";
import { Hero } from "@/components/hero/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { DevelopmentProcess } from "@/components/sections/DevelopmentProcessProgressBar";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/contact/ContactForm";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  const navigate = useNavigate();

  const handleViewAllProjects = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section with Project Carousel */}
        <section id="home">
          <Hero />
        </section>


        {/* Development Process Animation */}
        <section id="process">
          <DevelopmentProcess />
        </section>

        {/* Project Showcase */}
        <section id="projects">
          <ProjectShowcase onViewAllProjects={handleViewAllProjects} />
        </section>

        {/* About Us Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
