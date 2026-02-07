import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === 'ru' ? 'RU' : 'EN';

  return (
    <motion.button
      onClick={toggleLanguage}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full 
                 bg-background/80 backdrop-blur-xl border border-border shadow-lg
                 hover:bg-background hover:shadow-xl transition-all duration-300"
      aria-label={`Switch to ${i18n.language === 'ru' ? 'English' : 'Russian'}`}
    >
      <Globe className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{currentLang}</span>
    </motion.button>
  );
};

export default LanguageSwitcher;
