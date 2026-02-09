import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const SectionWrapper = ({ id, children, className = "", title, subtitle }: SectionWrapperProps) => {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      <div className="section-container">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl">
                {subtitle}
              </p>
            )}
            <div className="mt-4 h-px w-20 bg-primary/40" />
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;
