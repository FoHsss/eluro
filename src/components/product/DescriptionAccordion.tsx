import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Sparkles, Tag, Box, Truck, RotateCcw, Info, Settings, Heart, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Section {
  title: string;
  content: string;
}

interface DescriptionAccordionProps {
  descriptionHtml?: string;
  isTranslating?: boolean;
}

// Map keywords to icons
const getIconForTitle = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('highlight') || lower.includes('feature') || lower.includes('особенност')) return Sparkles;
  if (lower.includes('airtag') || lower.includes('gps') || lower.includes('track') || lower.includes('отслеж')) return Settings;
  if (lower.includes('material') || lower.includes('fabric') || lower.includes('материал')) return Box;
  if (lower.includes('ship') || lower.includes('deliver') || lower.includes('доставк')) return Truck;
  if (lower.includes('return') || lower.includes('refund') || lower.includes('возврат')) return RotateCcw;
  if (lower.includes('care') || lower.includes('wash') || lower.includes('уход')) return Heart;
  if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('гарант')) return Shield;
  if (lower.includes('size') || lower.includes('dimension') || lower.includes('размер')) return Tag;
  return Info;
};

// Parse HTML description into sections
const parseDescriptionHtml = (html: string): Section[] => {
  const sections: Section[] = [];
  
  // Match <strong> or <b> tags as section headers
  // Pattern: find bold text, then capture everything until the next bold or end
  const regex = /<(?:strong|b)[^>]*>(.*?)<\/(?:strong|b)>/gi;
  const parts = html.split(regex);
  
  // parts will be: [text before first bold, bold1, text after bold1, bold2, text after bold2, ...]
  // We start from index 1 (first bold text)
  for (let i = 1; i < parts.length; i += 2) {
    const title = parts[i]?.trim();
    let content = parts[i + 1] || '';
    
    // Clean up the content
    content = content
      .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
      .replace(/<p[^>]*>/gi, '') // Remove <p> tags
      .replace(/<\/p>/gi, '\n') // Convert </p> to newlines
      .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp;
      .replace(/&amp;/g, '&') // Replace &amp;
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\n{3,}/g, '\n\n') // Collapse multiple newlines
      .trim();
    
    if (title && content) {
      sections.push({ title, content });
    }
  }
  
  return sections;
};

const DescriptionAccordion = ({ descriptionHtml, isTranslating }: DescriptionAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Show skeleton while translating
  if (isTranslating) {
    return (
      <div className="border-t border-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-b border-border py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="w-32 h-4 rounded" />
              </div>
              <Skeleton className="w-4 h-4 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (!descriptionHtml) return null;
  
  const sections = parseDescriptionHtml(descriptionHtml);
  
  // If no sections found, don't render accordion
  if (sections.length === 0) return null;

  return (
    <div className="border-t border-border">
      {sections.map((section, index) => {
        const Icon = getIconForTitle(section.title);
        const isOpen = openIndex === index;
        
        return (
          <div key={index} className="border-b border-border">
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-4 text-left transition-colors hover:bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {section.title}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isOpen ? (
                  <Minus className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Plus className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.div>
            </button>
            
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 pl-7 pr-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default DescriptionAccordion;
