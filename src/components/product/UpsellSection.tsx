import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

interface UpsellSectionProps {
  products: ShopifyProduct[];
  currentHandle: string;
}

export const UpsellSection = ({ products, currentHandle }: UpsellSectionProps) => {
  const { t } = useTranslation();
  const { addItem, isLoading } = useCartStore();
  
  // Find a different product that's available for sale
  const upsellProduct = products.find(p => 
    p.node.handle !== currentHandle && 
    p.node.variants.edges.some(v => v.node.availableForSale)
  );
  
  // Don't render if no other products exist
  if (!upsellProduct) return null;

  const { node } = upsellProduct;
  const image = node.images.edges[0]?.node;
  const availableVariant = node.variants.edges.find(v => v.node.availableForSale)?.node;
  const price = availableVariant?.price || node.priceRange.minVariantPrice;

  const handleQuickAdd = async () => {
    if (!availableVariant) return;
    
    await addItem({
      product: upsellProduct,
      variantId: availableVariant.id,
      variantTitle: availableVariant.title,
      price: availableVariant.price,
      quantity: 1,
      selectedOptions: availableVariant.selectedOptions,
    });

    toast.success(t('upsell.added'), {
      description: node.title,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-10 border-t border-border"
    >
      <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 text-center">
        {t('upsell.title')}
      </h3>

      <div className="max-w-sm mx-auto bg-secondary/50 rounded-xl overflow-hidden border border-border/50">
        <div className="flex items-center gap-4 p-4">
          {/* Product Image */}
          <div className="w-24 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
            {image ? (
              <img
                src={image.url}
                alt={image.altText || node.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                No image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-display text-base font-medium text-foreground truncate mb-1">
              {node.title}
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </p>
            
            {/* Quick Add Button */}
            <button
              onClick={handleQuickAdd}
              disabled={isLoading || !availableVariant}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('upsell.addButton')
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
