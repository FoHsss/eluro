import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/Layout";
import ShopifyProductCard from "@/components/ShopifyProductCard";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

const Shop = () => {
  const { products, isLoading, error } = useShopifyProducts(20);
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
              {t('shop.collection')}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">
              {t('shop.title')}
            </h1>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">{t('shop.noProducts')}</p>
              <p className="text-sm text-muted-foreground">
                {t('shop.noProductsHint')}
              </p>
            </div>
          )}

          {/* Product Grid */}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid gap-8 max-w-lg mx-auto">
              {products
                .filter(product => {
                  const tags = product.node.tags;
                  if (!tags) return true;
                  
                  // Handle both array and comma-separated string formats
                  const tagList = Array.isArray(tags) 
                    ? tags 
                    : typeof tags === 'string' 
                      ? (tags as string).split(',').map(t => t.trim()) 
                      : [];
                  
                  return !tagList.some(tag => 
                    tag.toLowerCase() === 'upsell-only'
                  );
                })
                .map((product, index) => (
                  <ShopifyProductCard key={product.node.id} product={product} index={index} />
                ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
