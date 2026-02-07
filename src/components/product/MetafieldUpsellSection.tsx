import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/stores/cartStore";

interface UpsellProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
}

interface MetafieldUpsellSectionProps {
  upsellProducts: UpsellProduct[] | null;
  onUpsellSelect?: (selectedIds: string[]) => void;
}

export const MetafieldUpsellSection = ({ 
  upsellProducts,
  onUpsellSelect 
}: MetafieldUpsellSectionProps) => {
  const { t } = useTranslation();
  const { addItem, isLoading } = useCartStore();
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
  const [addingId, setAddingId] = useState<string | null>(null);

  // Don't render if no upsell products configured
  if (!upsellProducts || upsellProducts.length === 0) return null;

  const handleToggleUpsell = (productId: string) => {
    setSelectedUpsells(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      onUpsellSelect?.(Array.from(next));
      return next;
    });
  };

  const handleQuickAdd = async (product: UpsellProduct) => {
    const availableVariant = product.variants.edges.find(v => v.node.availableForSale)?.node;
    if (!availableVariant) return;

    setAddingId(product.id);
    
    try {
      await addItem({
        product: { node: product as any },
        variantId: availableVariant.id,
        variantTitle: availableVariant.title,
        price: availableVariant.price,
        quantity: 1,
        selectedOptions: availableVariant.selectedOptions,
      });

      toast.success(t('upsell.added'), {
        description: product.title,
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-4"
    >
      {/* Section Header */}
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 text-center">
        {t('upsell.addToOrder')}
      </p>

      {/* Upsell Cards */}
      <div className="space-y-2">
        {upsellProducts.map((product) => {
          const image = product.images.edges[0]?.node;
          const availableVariant = product.variants.edges.find(v => v.node.availableForSale)?.node;
          const price = availableVariant?.price || product.priceRange.minVariantPrice;
          const isSelected = selectedUpsells.has(product.id);
          const isAdding = addingId === product.id;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                isSelected 
                  ? 'bg-primary/5 border-primary/30' 
                  : 'bg-secondary/30 border-border/50 hover:border-border'
              }`}
            >
              {/* Checkbox */}
              <Checkbox
                id={`upsell-${product.id}`}
                checked={isSelected}
                onCheckedChange={() => handleToggleUpsell(product.id)}
                className="flex-shrink-0"
              />

              {/* Product Image */}
              <div className="w-14 h-14 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                {image ? (
                  <img
                    src={image.url}
                    alt={image.altText || product.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    —
                  </div>
                )}
              </div>

              {/* Product Info */}
              <label 
                htmlFor={`upsell-${product.id}`}
                className="flex-1 min-w-0 cursor-pointer"
              >
                <h4 className="font-medium text-sm text-foreground truncate">
                  {product.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  +{price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                </p>
              </label>

              {/* Quick Add Button */}
              <button
                onClick={() => handleQuickAdd(product)}
                disabled={isLoading || isAdding || !availableVariant}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 flex-shrink-0"
              >
                {isAdding ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3 h-3" />
                    {t('upsell.addButton')}
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
