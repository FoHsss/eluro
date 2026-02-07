import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";

const About = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="py-20 md:py-32">
        <div className="container max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {t('about.tagline')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">
              {t('about.title')}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8 text-muted-foreground leading-relaxed"
          >
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="pt-8 border-t border-border mt-12"
            >
              <p className="text-center font-display text-lg text-foreground">
                {t('about.motto')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
