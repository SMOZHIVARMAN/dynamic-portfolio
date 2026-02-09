import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useProfileData } from "@/hooks/useSheetData";

const InfoSection = () => {
  const { profile, loading } = useProfileData();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const logos = profile?.info_logos
    ? profile.info_logos.split(",").map((l: string) => l.trim()).filter(Boolean)
    : [];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMove);
    return () => el?.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section id="info" className="relative py-20 md:py-28">
      <div className="section-container">
        <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6">
              About Me
            </h2>
            <div className="h-px w-16 bg-primary/40 mb-6" />
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-full bg-secondary rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-secondary rounded animate-pulse" />
                <div className="h-4 w-3/5 bg-secondary rounded animate-pulse" />
              </div>
            ) : (
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
                {profile?.info_description || ""}
              </p>
            )}
          </motion.div>

          {/* Right: Floating Logos */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative h-64 md:h-80 flex items-center justify-center"
          >
            {logos.map((logo, i) => {
              const angle = (i / logos.length) * Math.PI * 2;
              const radius = 80;
              const baseX = Math.cos(angle) * radius;
              const baseY = Math.sin(angle) * radius;
              const parallaxStrength = 15 + i * 5;

              return (
                <motion.div
                  key={i}
                  className="absolute"
                  animate={{
                    x: baseX + mousePos.x * parallaxStrength,
                    y: baseY + mousePos.y * parallaxStrength,
                  }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                  <div className="w-14 h-14 md:w-18 md:h-18 glass-card rounded-xl p-3 flex items-center justify-center hover:glow-primary transition-shadow duration-300">
                    <img
                      src={logo}
                      alt="Tech logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </motion.div>
              );
            })}

            {/* Center glow */}
            <div className="w-32 h-32 rounded-full bg-primary/5 blur-[50px] absolute" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
