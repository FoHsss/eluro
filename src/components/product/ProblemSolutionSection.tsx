import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

export const ProblemSolutionSection = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-10 px-6 bg-muted/20 rounded-2xl mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary/60" />
        <h3 className="text-lg font-medium text-foreground">
          {t('product.problemTitle')}
        </h3>
      </div>
      
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>{t('product.problemText1')}</p>
        <p>{t('product.problemText2')}</p>
      </div>
    </motion.section>
  );
};
