import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";

const SkillsSection = () => {
  const { data: skills, loading } = useSheetData("Skills");
  const [activeDomain, setActiveDomain] = useState("All");

  const domains = ["All", ...Array.from(new Set(skills.map((s) => s.skill_domain).filter(Boolean)))];

  const filteredSkills =
    activeDomain === "All" ? skills : skills.filter((s) => s.skill_domain === activeDomain);

  return (
    <SectionWrapper id="skills" title="Skills" subtitle="Technologies and tools I work with">
      {/* Domain Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeDomain === domain
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_hsl(192_95%_55%/0.3)]"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, i) => (
              <motion.div
                key={skill.skill_name || i}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="glass-card rounded-xl p-4 flex flex-col items-center gap-3 group hover:border-primary/30 transition-all duration-300 hover:glow-primary"
              >
                {skill.skills_logos && (
                  <img
                    src={skill.skills_logos}
                    alt={skill.skill_name}
                    className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {skill.skill_name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </SectionWrapper>
  );
};

export default SkillsSection;
