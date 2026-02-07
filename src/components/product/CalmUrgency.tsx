import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Clock, Package } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CalmUrgencyProps {
  /** Show after scrolling this many pixels */
  showAfterScroll?: number;
  /** Hours until availability update (for countdown) */
  countdownHours?: number;
  /** Show limited quantity message */
  showLimitedQuantity?: boolean;
  /** Show preferred price message */
  showPreferredPrice?: boolean;
  /** Show curated selection message */
  showCuratedSelection?: boolean;
}

const CalmUrgency = ({
  showAfterScroll = 200,
  countdownHours = 48,
  showLimitedQuantity = true,
  showPreferredPrice = true,
  showCuratedSelection = false,
}: CalmUrgencyProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  // Calculate countdown (no seconds - calm approach)
  useEffect(() => {
    // Calculate end time based on countdownHours from now
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + countdownHours);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { days: 0, hours: 0 };
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      return { days, hours };
    };

    setTimeLeft(calculateTimeLeft());

    // Update every minute (not every second - calm approach)
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(interval);
  }, [countdownHours]);

  if (!isVisible) return null;

  const messages = [];
  
  if (showPreferredPrice) {
    messages.push({
      key: 'preferred',
      text: t('urgency.preferredPrice'),
    });
  }
  
  if (showLimitedQuantity) {
    messages.push({
      key: 'limited',
      text: t('urgency.limitedQuantity'),
      icon: Package,
    });
  }
  
  if (showCuratedSelection) {
    messages.push({
      key: 'curated',
      text: t('urgency.curatedSelection'),
    });
  }

  const showCountdown = timeLeft.days > 0 || timeLeft.hours > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-4 px-4 mb-4 rounded-xl bg-muted/30 border border-border/50"
    >
      <div className="space-y-2">
        {messages.map((msg) => (
          <div 
            key={msg.key}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            {msg.icon && <msg.icon className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>{msg.text}</span>
          </div>
        ))}
        
        {showCountdown && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {t('urgency.availabilityUpdate', { 
                time: timeLeft.days > 0 
                  ? t('urgency.daysHours', { days: timeLeft.days, hours: timeLeft.hours })
                  : t('urgency.hoursOnly', { hours: timeLeft.hours })
              })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CalmUrgency;
