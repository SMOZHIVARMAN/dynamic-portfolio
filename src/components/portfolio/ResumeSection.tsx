import { useState } from "react";
import { motion } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import ImageModal from "./ImageModal";
import { Download, ZoomIn } from "lucide-react";

const ResumeSection = () => {
  const { data, loading } = useSheetData("Resume");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const resume = data[0];

  if (loading) {
    return (
      <SectionWrapper id="resume" title="Resume">
        <div className="h-80 glass-card rounded-2xl animate-pulse" />
      </SectionWrapper>
    );
  }

  if (!resume) return null;

  const keySkills = resume.resume_keyskills?.split(",").map((s: string) => s.trim()).filter(Boolean) || [];

  return (
    <SectionWrapper id="resume" title="Resume" subtitle="Download my resume or view it below">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Resume Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative group"
        >
          {resume.resume_download_link && (
            <a
              href={resume.resume_download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 z-10 slider-btn w-10 h-10"
            >
              <Download className="w-4 h-4 text-foreground" />
            </a>
          )}

          <div
            className="glass-card rounded-2xl overflow-hidden cursor-zoom-in"
            onClick={() => setViewImage(resume.resume_image_link || null)}
          >
            {resume.resume_image_link ? (
              <img src={resume.resume_image_link} alt="Resume" className="w-full object-contain" />
            ) : (
              <div className="h-96 bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground">No resume preview</span>
              </div>
            )}
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <ZoomIn className="w-8 h-8 text-foreground" />
            </div>
          </div>
        </motion.div>

        {/* Right: Description & Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col justify-center"
        >
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {resume.resume_description}
          </p>

          {keySkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Key Skills</h4>
              <div className="flex flex-wrap gap-2">
                {keySkills.map((skill: string, i: number) => (
                  <span key={i} className="badge-skill">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {resume.resume_download_link && (
            <a
              href={resume.resume_download_link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:shadow-[0_0_25px_hsl(192_95%_55%/0.4)] transition-all duration-300 w-fit"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          )}
        </motion.div>
      </div>

      <ImageModal src={viewImage} onClose={() => setViewImage(null)} />
    </SectionWrapper>
  );
};

export default ResumeSection;
