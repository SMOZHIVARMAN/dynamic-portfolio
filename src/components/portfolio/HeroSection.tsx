import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfileData } from "@/hooks/useSheetData";
import { ArrowRight, FileText, Code2 } from "lucide-react";

const HeroSection = () => {
  const { profile, loading } = useProfileData();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const roles = profile?.profile_roles
    ? profile.profile_roles.split(",").map((r: string) => r.trim())
    : ["Developer"];

  useEffect(() => {
    const currentRole = roles[roleIndex] || "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => setDisplayText(currentRole.slice(0, displayText.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 40);
      } else {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/5 blur-[100px]" />
      </div>

      <div className="section-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24">
        {/* Left: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-base md:text-lg mb-3 mono-text"
          >
            Hi, I am
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight"
          >
            MOZHIVARMAN S
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-10 md:h-12 mb-8 flex items-center"
          >
            <span className="text-xl md:text-2xl font-medium gradient-text">
              {displayText}
            </span>
            <span className="ml-0.5 w-0.5 h-6 bg-primary animate-pulse-glow inline-block" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => scrollTo("#contact")}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-[0_0_25px_hsl(192_95%_55%/0.4)] hover:scale-105"
            >
              Contact
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo("#resume")}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium transition-all duration-300 hover:border-primary/40 hover:bg-primary/5"
            >
              <FileText className="w-4 h-4" />
              Resume
            </button>
            <button
              onClick={() => scrollTo("#projects")}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-medium transition-all duration-300 hover:border-accent/40 hover:bg-accent/5"
            >
              <Code2 className="w-4 h-4" />
              Projects
            </button>
          </motion.div>
        </motion.div>

        {/* Right: Profile Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-[60px] scale-110" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-2 border-primary/20 glow-primary">
              {!loading && profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt="Mozhivarman S"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-6xl font-bold gradient-text">SKM</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
