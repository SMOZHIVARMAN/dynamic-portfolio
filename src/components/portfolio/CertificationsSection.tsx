import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import ImageModal from "./ImageModal";
import { ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";

const CertificationsSection = () => {
  const { data: certs, loading } = useSheetData("Certifications");
  const [current, setCurrent] = useState(0);
  const [filter, setFilter] = useState("All");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [direction, setDirection] = useState(0); // -1 left, 1 right

  const modes = ["All", ...Array.from(new Set(certs.map((c) => c.certificate_mode).filter(Boolean)))];
  const filtered = filter === "All" ? certs : certs.filter((c) => c.certificate_mode === filter);

  const next = useCallback(() => {
    if (filtered.length > 1) {
      setDirection(1);
      setCurrent((p) => (p + 1) % filtered.length);
    }
  }, [filtered.length]);

  const prev = useCallback(() => {
    if (filtered.length > 1) {
      setDirection(-1);
      setCurrent((p) => (p - 1 + filtered.length) % filtered.length);
    }
  }, [filtered.length]);

  useEffect(() => {
    if (filtered.length <= 1) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [filtered.length, next]);

  useEffect(() => {
    setCurrent(0);
    setDirection(0);
  }, [filter]);

  const cert = filtered[current];
  const prevCert = filtered.length > 1 ? filtered[(current - 1 + filtered.length) % filtered.length] : null;
  const nextCert = filtered.length > 1 ? filtered[(current + 1) % filtered.length] : null;

  if (loading) {
    return (
      <SectionWrapper id="certifications" title="Certifications">
        <div className="h-80 glass-card rounded-2xl animate-pulse" />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="certifications" title="Certifications" subtitle="Professional certifications and courses">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setFilter(mode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === mode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            {mode}
          </button>
        ))}
        <button
          onClick={() => setShowAll(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-all"
        >
          View All
        </button>
      </div>

      {/* Carousel with right → center → left motion */}
      {!showAll && filtered.length > 0 && (
        <div className="relative flex items-center justify-center gap-2 md:gap-6 py-4">
          {/* Left arrow */}
          <button onClick={prev} className="slider-btn shrink-0 z-10">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div className="relative flex items-center justify-center w-full max-w-4xl" style={{ minHeight: "420px" }}>
            {/* Previous card (left, small) */}
            <AnimatePresence initial={false}>
              {prevCert && (
                <motion.div
                  key={`prev-${(current - 1 + filtered.length) % filtered.length}`}
                  className="absolute left-0 md:left-4 z-0 cursor-pointer hidden md:block"
                  initial={{ opacity: 0, x: direction >= 0 ? -120 : 0, scale: 0.55 }}
                  animate={{ opacity: 0.5, x: 0, scale: 0.65 }}
                  exit={{ opacity: 0, x: -120, scale: 0.55 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  onClick={prev}
                >
                  <div className="glass-card rounded-2xl overflow-hidden w-48 lg:w-56 pointer-events-none">
                    <img
                      src={prevCert.certification_image}
                      alt={prevCert.certification_title}
                      className="w-full h-36 lg:h-40 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground truncate">{prevCert.certification_title}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center card (main, large) */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`center-${current}`}
                className="relative z-10"
                initial={{ opacity: 0, x: direction > 0 ? 200 : direction < 0 ? -200 : 0, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction > 0 ? -200 : 200, scale: 0.8 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="glass-card rounded-2xl overflow-hidden w-80 md:w-[420px] lg:w-[480px] mx-auto">
                  <div className="relative">
                    <img
                      src={cert?.certification_image}
                      alt={cert?.certification_title}
                      className="w-full h-64 md:h-72 lg:h-80 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex gap-2">
                      {cert?.certificate_download_link && (
                        <a
                          href={cert.certificate_download_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="slider-btn w-9 h-9"
                        >
                          <Download className="w-4 h-4 text-foreground" />
                        </a>
                      )}
                      <button
                        onClick={() => setViewImage(cert?.certification_image || null)}
                        className="slider-btn w-9 h-9"
                      >
                        <Eye className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground text-base md:text-lg mb-1">{cert?.certification_title}</h3>
                    <p className="text-muted-foreground text-sm">{cert?.certificate_distributor_name}</p>
                    {cert?.certificate_achievement && (
                      <p className="text-sm text-primary mt-2 font-medium">{cert.certificate_achievement}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next card (right, small) */}
            <AnimatePresence initial={false}>
              {nextCert && (
                <motion.div
                  key={`next-${(current + 1) % filtered.length}`}
                  className="absolute right-0 md:right-4 z-0 cursor-pointer hidden md:block"
                  initial={{ opacity: 0, x: direction <= 0 ? 120 : 0, scale: 0.55 }}
                  animate={{ opacity: 0.5, x: 0, scale: 0.65 }}
                  exit={{ opacity: 0, x: 120, scale: 0.55 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  onClick={next}
                >
                  <div className="glass-card rounded-2xl overflow-hidden w-48 lg:w-56 pointer-events-none">
                    <img
                      src={nextCert.certification_image}
                      alt={nextCert.certification_title}
                      className="w-full h-36 lg:h-40 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground truncate">{nextCert.certification_title}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <button onClick={next} className="slider-btn shrink-0 z-10">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}

      {/* Dot indicators */}
      {!showAll && filtered.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {filtered.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-primary w-6" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* View All Modal */}
      <AnimatePresence>
        {showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAll(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-10 w-full max-w-4xl max-h-[80vh] overflow-y-auto glass-card rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold gradient-text mb-6">All Certifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {certs.map((c, i) => (
                  <div key={i} className="glass-card rounded-xl overflow-hidden group cursor-pointer"
                    onClick={() => { setShowAll(false); setViewImage(c.certification_image); }}>
                    <img src={c.certification_image} alt={c.certification_title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <p className="p-2 text-xs text-muted-foreground">{c.certification_title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ImageModal src={viewImage} onClose={() => setViewImage(null)} />
    </SectionWrapper>
  );
};

export default CertificationsSection;
