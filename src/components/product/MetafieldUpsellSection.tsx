import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";

interface UpsellProduct {
  id: string;
  title: string;
  handle: string;
  description?: string;
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
        image?: {
          url: string;
          altText: string | null;
        };
      };
    }>;
  };
}

export interface UpsellSelection {
  productId: string;
  product: UpsellProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

interface MetafieldUpsellSectionProps {
  upsellProducts: UpsellProduct[] | null;
  onUpsellChange?: (selections: UpsellSelection[]) => void;
}

export const MetafieldUpsellSection = ({ 
  upsellProducts,
  onUpsellChange 
}: MetafieldUpsellSectionProps) => {
  const { t } = useTranslation();
  
  // Map: productId → selected variantId (only for checked products)
  const [selectedProducts, setSelectedProducts] = useState<Map<string, string>>(new Map());
  
  // Detail modal state
  const [detailProduct, setDetailProduct] = useState<UpsellProduct | null>(null);

  // Block body scroll when modal is open (mobile-friendly approach)
  useEffect(() => {
    if (detailProduct) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Fix body at current position to prevent jumping
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore body styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [detailProduct]);

  // Get available variants for a product
  const getAvailableVariants = useCallback((product: UpsellProduct) => 
    product.variants.edges.filter(v => v.node.availableForSale), []);

  // Get selected variant for a product
  const getSelectedVariant = useCallback((product: UpsellProduct) => {
    const variantId = selectedProducts.get(product.id);
    if (variantId) {
      return product.variants.edges.find(v => v.node.id === variantId)?.node;
    }
    return getAvailableVariants(product)[0]?.node;
  }, [selectedProducts, getAvailableVariants]);

  // Get image for a variant
  const getVariantImage = useCallback((product: UpsellProduct, variant: typeof product.variants.edges[0]['node']) => {
    return variant.image || product.images.edges[0]?.node;
  }, []);

  // Notify parent of selection changes - MUST be before early return
  useEffect(() => {
    if (!onUpsellChange || !upsellProducts) return;
    
    const selections: UpsellSelection[] = [];
    selectedProducts.forEach((variantId, productId) => {
      const product = upsellProducts.find(p => p.id === productId);
      if (product) {
        const variant = product.variants.edges.find(v => v.node.id === variantId)?.node;
        if (variant) {
          selections.push({
            productId,
            product,
            variantId,
            variantTitle: variant.title,
            price: variant.price,
            selectedOptions: variant.selectedOptions,
          });
        }
      }
    });
    
    onUpsellChange(selections);
  }, [selectedProducts, upsellProducts, onUpsellChange]);

  // Don't render if no upsell products configured
  if (!upsellProducts || upsellProducts.length === 0) return null;

  // Toggle product selection
  const toggleProduct = (productId: string, defaultVariantId: string) => {
    setSelectedProducts(prev => {
      const next = new Map(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.set(productId, defaultVariantId);
      }
      return next;
    });
  };

  // Select variant for a product
  const selectVariant = (productId: string, variantId: string) => {
    setSelectedProducts(prev => {
      const next = new Map(prev);
      next.set(productId, variantId);
      return next;
    });
  };

  return (
    <>
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
        <div className="space-y-3">
          {upsellProducts.map((product) => {
            const variants = getAvailableVariants(product);
            const isSelected = selectedProducts.has(product.id);
            const selectedVariant = getSelectedVariant(product);
            const selectedVariantId = selectedProducts.get(product.id) || variants[0]?.node.id;
            const price = selectedVariant?.price || product.priceRange.minVariantPrice;

            if (variants.length === 0) return null;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`relative p-3 rounded-xl border transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-secondary/30 border-border/50 hover:border-border'
                }`}
              >
                {/* Header Row: Checkbox + Title + Price */}
                <div className="flex items-center gap-3 mb-2">
                  <Checkbox
                    id={`upsell-${product.id}`}
                    checked={isSelected}
                    onCheckedChange={() => toggleProduct(product.id, variants[0]?.node.id)}
                    className="flex-shrink-0"
                  />
                  
                  <button 
                    onClick={() => setDetailProduct(product)}
                    className="flex-1 text-left min-w-0"
                  >
                    <span className="font-medium text-sm text-foreground underline underline-offset-2 decoration-muted-foreground/50 hover:decoration-foreground transition-colors truncate block">
                      {product.title}
                    </span>
                  </button>
                  
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    +{price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                  </span>
                </div>

                {/* Variant Images Row - always show if multiple variants */}
                {variants.length > 1 && (
                  <div className="flex gap-2 pl-7">
                    {variants.map((variant) => {
                      const image = getVariantImage(product, variant.node);
                      const isVariantSelected = selectedVariantId === variant.node.id;
                      
                      return (
                        <button
                          key={variant.node.id}
                          onClick={() => {
                            // If not selected, also select the product
                            if (!isSelected) {
                              toggleProduct(product.id, variant.node.id);
                            } else {
                              selectVariant(product.id, variant.node.id);
                            }
                          }}
                          className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-150 bg-secondary flex-shrink-0 ${
                            isVariantSelected && isSelected
                              ? 'border-primary ring-2 ring-primary/30' 
                              : 'border-transparent hover:border-border'
                          }`}
                        >
                          {image ? (
                            <img 
                              src={image.url} 
                              alt={image.altText || variant.node.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                              {variant.node.title}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6"
            onClick={() => setDetailProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative bg-background rounded-2xl max-w-md w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setDetailProduct(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Product Image */}
              {(() => {
                const selectedVariant = getSelectedVariant(detailProduct);
                const image = selectedVariant 
                  ? getVariantImage(detailProduct, selectedVariant) 
                  : detailProduct.images.edges[0]?.node;
                
                return image ? (
                  <div className="w-full aspect-square bg-secondary">
                    <img 
                      src={image.url} 
                      alt={image.altText || detailProduct.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : null;
              })()}

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-lg font-medium text-foreground mb-1">
                  {detailProduct.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  +{getSelectedVariant(detailProduct)?.price.currencyCode || detailProduct.priceRange.minVariantPrice.currencyCode}{' '}
                  {parseFloat(getSelectedVariant(detailProduct)?.price.amount || detailProduct.priceRange.minVariantPrice.amount).toFixed(2)}
                </p>

                {detailProduct.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {detailProduct.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
