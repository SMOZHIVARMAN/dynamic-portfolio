import { motion } from "framer-motion";
import { useSheetData } from "@/hooks/useSheetData";
import SectionWrapper from "./SectionWrapper";

const ContactSection = () => {
  const { data: contacts, loading } = useSheetData("Contact Me");

  // Categorize contacts
  const infoItems = contacts.filter((c) => {
    const media = (c["contact_media"] || c["contact_media "] || "").trim().toLowerCase();
    return ["mail", "location", "status"].includes(media);
  });

  const socialItems = contacts.filter((c) => {
    const media = (c["contact_media"] || c["contact_media "] || "").trim().toLowerCase();
    return ["linkedin", "instagram", "youtube", "github"].includes(media);
  });

  const email = contacts.find((c) => {
    const media = (c["contact_media"] || c["contact_media "] || "").trim().toLowerCase();
    return media === "mail";
  })?.contact_link || "";

  const phone = contacts.find((c) => {
    const media = (c["contact_media"] || c["contact_media "] || "").trim().toLowerCase();
    return media === "phone";
  })?.contact_link || "";

  // Order info items: Location, Mail, Status
  const orderedInfo = ["location", "mail", "status"]
    .map((key) => infoItems.find((c) => {
      const media = (c["contact_media"] || c["contact_media "] || "").trim().toLowerCase();
      return media === key;
    }))
    .filter(Boolean) as Record<string, string>[];

  return (
    <SectionWrapper id="contact" title="Contact" subtitle="Let's connect and build something great">
      {/* Upper Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-6 md:p-8 mb-8"
      >
        <p className="text-muted-foreground text-center mb-8 text-sm">
          Feel free to reach out — I'm always open to new conversations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orderedInfo.map((item, i) => {
            const media = (item["contact_media"] || item["contact_media "] || "").trim();
            const value = (item.contact_link || "").trim();
            const iconUrl = (item.contact_image || "").trim();
            const isEmail = media.toLowerCase() === "mail";

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                {iconUrl && (
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group">
                    <img
                      src={iconUrl}
                      alt={media}
                      className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1 capitalize">{media}</p>
                  {isEmail ? (
                    <a
                      href={`mailto:${value}`}
                      className="text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-foreground">{value}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Lower Section - Social Links */}
      {socialItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {socialItems.map((link, i) => {
            const media = (link["contact_media"] || link["contact_media "] || "").trim();
            const iconUrl = (link.contact_image || "").trim();
            const url = (link.contact_link || "").trim();

            return (
              <motion.a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="glass-card rounded-xl w-16 h-16 flex items-center justify-center hover:border-primary/30 transition-all duration-300 hover:glow-primary group"
                title={media}
              >
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={media}
                    className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-xs font-medium text-foreground capitalize">{media}</span>
                )}
              </motion.a>
            );
          })}
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20 pt-8 border-t border-border"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-foreground font-bold text-lg">MOZHIVARMAN S</p>
            <p className="text-muted-foreground text-xs">Java Developer & Cybersecurity Analyst</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">© 2026 All rights reserved</p>
            {(email || phone) && (
              <p className="text-muted-foreground text-xs mt-1">
                {email}{email && phone ? " • " : ""}{phone}
              </p>
            )}
          </div>
        </div>
      </motion.footer>
    </SectionWrapper>
  );
};

export default ContactSection;
