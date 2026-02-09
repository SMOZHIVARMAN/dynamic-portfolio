import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import ImageModal from "./ImageModal";
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";

const AwardsSection = () => {
  const { data: awards, loading } = useSheetData("Achievements");
  const [current, setCurrent] = useState(0);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const next = useCallback(() => {
    if (awards.length) setCurrent((p) => (p + 1) % awards.length);
  }, [awards.length]);

  const prev = useCallback(() => {
    if (awards.length) setCurrent((p) => (p - 1 + awards.length) % awards.length);
  }, [awards.length]);

  useEffect(() => {
    if (!awards.length) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [awards.length, next]);

  const award = awards[current];

  if (loading || !award) {
    return (
      <SectionWrapper id="awards" title="Awards & Achievements">
        <div className="h-64 glass-card rounded-2xl animate-pulse" />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="awards"
      title="Awards & Achievements"
      subtitle="Recognitions and accomplishments"
    >
      <div className="relative">
        {/* Navigation */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 z-10">
          <button onClick={prev} className="slider-btn">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 z-10">
          <button onClick={next} className="slider-btn">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: Image (MEDIUM SIZE) */}
              <div className="flex items-center justify-center p-6">
                {award.achievement_image ? (
                  <img
                    src={award.achievement_image}
                    alt={award.achievements_title}
                    onClick={() => setViewImage(award.achievement_image)}
                    className="
                      cursor-zoom-in
                      w-full
                      max-w-[360px]
                      max-h-[420px]
                      object-contain
                      rounded-xl
                    "
                  />
                ) : (
                  <div className="w-full h-64 bg-secondary flex items-center justify-center rounded-xl">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>

              {/* RIGHT: Content */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                {/* Title badge + mode */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap gap-2">
                    {/* ✅ achievements_title as BADGE */}
                    {award.achievements_title && (
                      <span className="badge-skill">
                        {award.achievements_title}
                      </span>
                    )}

                    {award.achievements_mode && (
                      <span className="badge-domain">
                        {award.achievements_mode}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {award.achievement_download_link && (
                      <a
                        href={award.achievement_download_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="slider-btn w-9 h-9"
                      >
                        <Download className="w-4 h-4 text-foreground" />
                      </a>
                    )}
                    <button
                      onClick={() =>
                        setViewImage(award.achievement_image || null)
                      }
                      className="slider-btn w-9 h-9"
                    >
                      <Eye className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {award.achievements_description}
                </p>

                {/* Pagination dots */}
                <div className="flex gap-1.5 mt-6">
                  {awards.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-6 bg-primary"
                          : "w-1.5 bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <ImageModal src={viewImage} onClose={() => setViewImage(null)} />
    </SectionWrapper>
  );
};

export default AwardsSection;
