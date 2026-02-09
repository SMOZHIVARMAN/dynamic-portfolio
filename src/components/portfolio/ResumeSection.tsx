import { useState } from "react";
import { motion } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import ImageModal from "./ImageModal";
import { Download, ZoomIn, Mail } from "lucide-react";

const ResumeSection = () => {
  const { data, loading } = useSheetData("Resume");
  const [viewImage, setViewImage] = useState<string | null>(null);
  const resume = data[0];

  if (loading) {
    return (
      <SectionWrapper id="resume" title="Resume">
        <div className="h-80 rounded-2xl bg-muted animate-pulse" />
      </SectionWrapper>
    );
  }

  if (!resume) return null;

  const keySkills =
    resume.resume_keyskills
      ?.split(",")
      .map((s: string) => s.trim())
      .filter(Boolean) || [];

  return (
    <SectionWrapper
      id="resume"
      title="Resume"
      subtitle="Download my resume or view it below"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT: Resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          {/* 🔥 THIS IS THE IMPORTANT PART */}
          <div
            className="
              relative group
              rounded-2xl overflow-hidden cursor-zoom-in
              max-w-[420px]
              lg:max-w-[480px]
              xl:max-w-[520px]
            "
            onClick={() => setViewImage(resume.resume_image_link || null)}
          >
            {/* Download icon INSIDE resume */}
            {resume.resume_download_link && (
              <a
                href={resume.resume_download_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="
                  absolute top-3 right-3 z-10
                  w-9 h-9 rounded-full
                  bg-black/60 backdrop-blur
                  flex items-center justify-center
                  hover:bg-black/80
                  transition
                "
              >
                <Download className="w-4 h-4 text-white" />
              </a>
            )}

            {/* Resume image */}
            {resume.resume_image_link ? (
              <img
                src={resume.resume_image_link}
                alt="Resume"
                className="
                  w-full
                  max-h-[520px]
                  lg:max-h-[580px]
                  object-contain
                "
              />
            ) : (
              <div className="h-96 bg-secondary flex items-center justify-center">
                <span className="text-muted-foreground">
                  No resume preview
                </span>
              </div>
            )}

            {/* Hover zoom overlay */}
            <div
              className="
                absolute inset-0
                bg-black/0 group-hover:bg-black/10
                transition
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
              "
            >
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Content */}
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
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Key Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {keySkills.map((skill: string, i: number) => (
                  <span key={i} className="badge-skill">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            {resume.resume_download_link && (
              <a
                href={resume.resume_download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2 px-6 py-3 rounded-xl
                  bg-primary text-primary-foreground font-medium
                  hover:shadow-[0_0_25px_hsl(192_95%_55%/0.4)]
                  transition-all duration-300
                "
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            )}

            <a
              href="#contact"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-xl
                border border-foreground/20
                hover:bg-foreground/5
                transition-all duration-300
              "
            >
              <Mail className="w-4 h-4" />
              Hire Me
            </a>
          </div>
        </motion.div>
      </div>

      <ImageModal src={viewImage} onClose={() => setViewImage(null)} />
    </SectionWrapper>
  );
};

export default ResumeSection;
