import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";

const Privacy = () => {
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
              {t('privacy.title')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('privacy.lastUpdated')}
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
                {t('privacy.section1Title')}
              </h2>
              <p>{t('privacy.section1Text')}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('privacy.section2Title')}
              </h2>
              <p>{t('privacy.section2Text')}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('privacy.section3Title')}
              </h2>
              <p>{t('privacy.section3Text')}</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                {t('privacy.section4Title')}
              </h2>
              <p>
                {t('privacy.section4Text')}{" "}
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

export default Privacy;
