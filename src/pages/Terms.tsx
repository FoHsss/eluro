import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";

const Terms = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="py-20 md:py-32">
        <div className="container max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6">
              {t('terms.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('terms.lastUpdated')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8 text-muted-foreground leading-relaxed"
          >
            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('terms.section1Title')}
              </h2>
              <p>{t('terms.section1Text')}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('terms.section2Title')}
              </h2>
              <p>{t('terms.section2Text')}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('terms.section3Title')}
              </h2>
              <p>{t('terms.section3Text')}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('terms.section4Title')}
              </h2>
              <p>
                {t('terms.section4Text')}{" "}
                <a 
                  href="mailto:hello@eluro.co" 
                  className="text-foreground underline underline-offset-4"
                >
                  hello@eluro.co
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
