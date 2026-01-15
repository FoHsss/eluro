import { useParams, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useShopifyProduct(slug);
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  const imageRef = useRef<HTMLDivElement>(null);
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Get selected variant based on options
  const getSelectedVariant = () => {
    if (!product?.variants?.edges) return null;
    
    const variants = product.variants.edges;
    
    // If no options selected yet, return first available variant
    if (Object.keys(selectedOptions).length === 0) {
      return variants.find(v => v.node.availableForSale)?.node || variants[0]?.node;
    }

    // Find variant matching selected options
    return variants.find(v => {
      return v.node.selectedOptions.every(opt => 
        selectedOptions[opt.name] === opt.value
      );
    })?.node;
  };

  const selectedVariant = getSelectedVariant();

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success("Added to cart", {
      description: product.title,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return <Navigate to="/shop" replace />;
  }

  const image = product.images.edges[0]?.node;
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;

  return (
    <Layout>
      <div className="pb-20">
        {/* Hero Image with Parallax */}
        <div
          ref={imageRef}
          className="relative h-[75vh] md:h-[85vh] bg-secondary overflow-hidden"
        >
          <motion.div
            style={{ y }}
            className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
          >
            {image ? (
              <motion.img
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src={image.url}
                alt={image.altText || product.title}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-muted-foreground">No image available</div>
            )}
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="container max-w-lg mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-10 md:pt-14"
          >
            {/* Brand Line */}
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Thoughtfully chosen
            </p>

            {/* Product Title */}
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-2">
              {product.title}
            </h1>

            {/* Price */}
            <p className="text-lg text-muted-foreground mb-6">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </p>

            {/* Variant Options */}
            {product.options && product.options.length > 0 && product.options[0].values.length > 1 && (
              <div className="mb-8 space-y-4">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const isSelected = selectedOptions[option.name] === value || 
                          (!selectedOptions[option.name] && selectedVariant?.selectedOptions.find(o => o.name === option.name)?.value === value);
                        
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                            className={`px-4 py-2 text-sm border rounded-lg transition-all duration-200 ${
                              isSelected 
                                ? 'border-foreground bg-foreground text-background' 
                                : 'border-border hover:border-foreground'
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            <button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant?.availableForSale}
              className="btn-cta btn-cta-pulse mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : selectedVariant?.availableForSale ? (
                'Add to Cart'
              ) : (
                'Sold Out'
              )}
            </button>

            {/* Micro-copy */}
            <p className="text-xs text-center text-muted-foreground mb-12">
              Thoughtfully chosen for everyday use
            </p>

            {/* Description */}
            {product.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
                className="mb-10"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
