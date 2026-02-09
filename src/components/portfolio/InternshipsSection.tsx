import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import { ChevronLeft, ChevronRight } from "lucide-react";

const InternshipsSection = () => {
  const { data: internships, loading } = useSheetData("Internships");
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (internships.length) setCurrent((p) => (p + 1) % internships.length);
  }, [internships.length]);

  const prev = useCallback(() => {
    if (internships.length) setCurrent((p) => (p - 1 + internships.length) % internships.length);
  }, [internships.length]);

  useEffect(() => {
    if (!internships.length) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [internships.length, next]);

  const intern = internships[current];

  if (loading || !intern) {
    return (
      <SectionWrapper id="internships" title="Internships">
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      </SectionWrapper>
    );
  }

  const skills = intern.internship_skills?.split(",").map((s: string) => s.trim()).filter(Boolean) || [];

  return (
    <SectionWrapper id="internships" title="Internships" subtitle="Professional experience and training">
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
          <button onClick={prev} className="slider-btn"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
          <button onClick={next} className="slider-btn"><ChevronRight className="w-5 h-5 text-foreground" /></button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left: Image + Company */}
              <div className="relative">
                {intern.internship_image ? (
                  <img src={intern.internship_image} alt={intern.internship_title} className="w-full h-64 lg:h-full object-cover" />
                ) : (
                  <div className="w-full h-64 lg:h-full bg-secondary min-h-[300px]" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                  {(intern.internship_company || intern.intetnship_company) && (
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={intern.internship_company || intern.intetnship_company}
                        alt="Company"
                        className="w-8 h-8 rounded object-contain bg-foreground/10 p-1"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <p className="text-foreground font-semibold">{intern.internship_job_role || intern.internship_title}</p>
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  {intern.internship_domain && <span className="badge-domain">{intern.internship_domain}</span>}
                  {intern.internship_duration && <span className="badge-skill">{intern.internship_duration}</span>}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {intern.internship_description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s, i) => (
                    <span key={i} className="badge-skill">{s}</span>
                  ))}
                </div>

                <div className="flex gap-1.5 mt-6">
                  {internships.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-primary" : "w-1.5 bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
};

export default InternshipsSection;
