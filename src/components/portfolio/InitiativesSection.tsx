import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const InitiativesSection = () => {
  const { data: initiatives, loading } = useSheetData("Initiatives");
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (initiatives.length) setCurrent((p) => (p + 1) % initiatives.length);
  }, [initiatives.length]);

  const prev = useCallback(() => {
    if (initiatives.length) setCurrent((p) => (p - 1 + initiatives.length) % initiatives.length);
  }, [initiatives.length]);

  useEffect(() => {
    if (!initiatives.length) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [initiatives.length, next]);

  const item = initiatives[current];

  if (loading || !item) {
    return (
      <SectionWrapper id="initiatives" title="Applied Learning">
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="initiatives" title="Applied Learning" subtitle="Initiatives and self-driven projects">
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
              <div className="h-64 lg:h-auto">
                {item.initiative_image ? (
                  <img src={item.initiative_image} alt={item.initiative_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary min-h-[250px]" />
                )}
              </div>

              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-foreground mb-2">{item.initiative_name}</h3>
                {item.initiative_domain && <span className="badge-domain w-fit mb-4">{item.initiative_domain}</span>}
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{item.initiative_description}</p>

                {item.initiative_link && (
                  <a href={item.initiative_link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary text-sm hover:underline w-fit">
                    View Initiative <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <div className="flex gap-1.5 mt-6">
                  {initiatives.map((_, i) => (
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

export default InitiativesSection;
