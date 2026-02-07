import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const PremiumInfoBar = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [
    t('urgency.preferredPrice'),
    t('urgency.limitedQuantity'),
    t('urgency.curatedEluro'),
    t('urgency.availabilityDays', { days: 2 }),
    t('urgency.readyToShip'),
  ];

  // Rotate messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <motion.div
      className="w-full h-9 flex items-center justify-center bg-[hsl(40,20%,94%)] dark:bg-[hsl(40,10%,12%)]"
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-xs font-display font-normal tracking-[0.05em] text-foreground/70"
        >
          {messages[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
};

export default PremiumInfoBar;
