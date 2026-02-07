import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
export const ProblemSolutionSection = () => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 md:py-16"
    >
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Heart className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl md:text-2xl font-display text-foreground">
          {t('product.problemTitle')}
        </h3>
        <div className="space-y-4 text-muted-foreground">
          <p>{t('product.problemText1')}</p>
          <p>{t('product.problemText2')}</p>
        </div>
      </div>
    </motion.div>
  );
};