import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";

const ProjectsSection = () => {
  const { data: projects, loading } = useSheetData("Projects");
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (projects.length) setCurrent((p) => (p + 1) % projects.length);
  }, [projects.length]);

  const prev = useCallback(() => {
    if (projects.length) setCurrent((p) => (p - 1 + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (!projects.length) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [projects.length, next]);

  const project = projects[current];

  if (loading) {
    return (
      <SectionWrapper id="projects" title="Projects" subtitle="Featured work and applications">
        <div className="glass-card rounded-2xl h-96 animate-pulse" />
      </SectionWrapper>
    );
  }

  if (!project) return null;

  const skills = project.project_skills?.split(",").map((s: string) => s.trim()).filter(Boolean) || [];

  return (
    <SectionWrapper id="projects" title="Projects" subtitle="Featured work and applications">
      <div className="relative">
        {/* Navigation */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 z-10">
          <button onClick={prev} className="slider-btn">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 z-10">
          <button onClick={next} className="slider-btn">
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
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
              {/* Left: Image */}
              <div className="relative h-64 lg:h-auto lg:min-h-[400px] overflow-hidden">
                {project.project_image ? (
                  <img
                    src={project.project_image}
                    alt={project.project_title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <Code className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-xl font-bold text-foreground">{project.project_title}</h3>
                </div>

                {/* Links */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {project.project_github_link && (
                    <a
                      href={project.project_github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="slider-btn w-9 h-9"
                    >
                      <Github className="w-4 h-4 text-foreground" />
                    </a>
                  )}
                  {project.project_live_link && (
                    <a
                      href={project.project_live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="slider-btn w-9 h-9"
                    >
                      <ExternalLink className="w-4 h-4 text-foreground" />
                    </a>
                  )}
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  {project.project_domain && (
                    <span className="badge-domain">{project.project_domain}</span>
                  )}
                  {project.project_type && (
                    <span className="badge-skill">{project.project_type}</span>
                  )}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {project.project_description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <span key={i} className="badge-skill">{skill}</span>
                  ))}
                </div>

                {/* Dots indicator */}
                <div className="flex gap-1.5 mt-6">
                  {projects.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === current ? "w-6 bg-primary" : "w-1.5 bg-muted"
                      }`}
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

// Fallback icon
const Code = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export default ProjectsSection;
