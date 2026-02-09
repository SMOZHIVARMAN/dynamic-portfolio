import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";

const AnimatedCounter = ({ target, label }: { target: number; label: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || target === 0) return;
    const duration = 1500;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target]);

  // If no number found, just show the raw label text
  if (target === 0 && label) {
    return (
      <span ref={ref} className="text-lg md:text-xl font-bold gradient-text mono-text leading-tight">
        {label}
      </span>
    );
  }

  return (
    <span ref={ref} className="text-2xl md:text-3xl font-bold gradient-text mono-text">
      {count}+
    </span>
  );
};

function extractNumber(str: string): number {
  const match = str.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function extractLabel(str: string): string {
  // Remove the number and +/- signs, return the descriptive text
  return str.replace(/\d+\+?/g, "").trim();
}

const CodingProfilesSection = () => {
  const { data: profiles, loading } = useSheetData("Coding Profiles");

  if (loading) {
    return (
      <SectionWrapper id="coding" title="Coding Profiles">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="coding" title="Coding Profiles" subtitle="Competitive programming & open source">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {profiles.map((profile, i) => {
          const rawStats = profile.coding_stats || "";
          const statsNum = extractNumber(rawStats);
          const statsLabel = extractLabel(rawStats) || "Problems Solved";
          return (
            <motion.a
              key={i}
              href={profile.coding_profile_link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 flex flex-col items-center gap-4 group hover:border-primary/30 transition-all duration-300 hover:glow-primary text-center"
            >
              {profile.coding_profile_image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary p-2 group-hover:scale-110 transition-transform duration-300">
                  <img src={profile.coding_profile_image} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <div>
                <AnimatedCounter target={statsNum} label={rawStats} />
                <p className="text-xs text-muted-foreground mt-1">{statsLabel}</p>
              </div>
            </motion.a>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default CodingProfilesSection;
