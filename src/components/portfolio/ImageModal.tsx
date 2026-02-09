import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

const ImageModal = ({ src, alt = "Image", onClose }: ImageModalProps) => {
  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative z-10 max-w-4xl max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border hover:border-primary/40 transition-colors"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain rounded-lg"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
