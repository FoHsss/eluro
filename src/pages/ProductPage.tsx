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

    // Find variant matching ALL selected options (partial match for when only some options are selected)
    const selectedKeys = Object.keys(selectedOptions);
    
    // First try exact match
    const exactMatch = variants.find(v => {
      return v.node.selectedOptions.every(opt => 
        selectedOptions[opt.name] === opt.value
      );
    })?.node;
    
    if (exactMatch) return exactMatch;
    
    // If no exact match, find best partial match (prioritize matching selected options)
    const partialMatch = variants.find(v => {
      return selectedKeys.every(key => 
        v.node.selectedOptions.find(opt => opt.name === key)?.value === selectedOptions[key]
      ) && v.node.availableForSale;
    })?.node;
    
    return partialMatch || variants.find(v => {
      return selectedKeys.every(key => 
        v.node.selectedOptions.find(opt => opt.name === key)?.value === selectedOptions[key]
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

  const image = selectedVariant?.image || product.images.edges[0]?.node;
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;

  // Sort options: Color first, then Size
  const sortedOptions = product.options ? [...product.options].sort((a, b) => {
    if (a.name.toLowerCase() === 'color') return -1;
    if (b.name.toLowerCase() === 'color') return 1;
    return 0;
  }) : [];

  return (
    <Layout>
      <div className="pb-20">
        {/* Hero Image with Parallax + Title Overlay */}
        <div
          ref={imageRef}
          className="relative h-[65vh] md:h-[75vh] bg-secondary"
        >
          <motion.div
            style={{ y, perspective: 1000 }}
            className="absolute inset-0 flex items-center justify-center p-8 pb-24 md:pb-32"
          >
            {image ? (
              <motion.img
                key={image.url}
                initial={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                src={image.url}
                alt={image.altText || product.title}
                className="max-w-full max-h-full object-contain"
                style={{ transformStyle: "preserve-3d" }}
              />
            ) : (
              <div className="text-muted-foreground">No image available</div>
            )}
          </motion.div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent z-[5]" />

          {/* Title Overlay — positioned at bottom with gradient behind */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 translate-y-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="container max-w-lg mx-auto"
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Thoughtfully chosen
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-1">
                {product.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Product Options & Actions */}
        <div className="container max-w-lg mx-auto px-6 pt-16 mt-8">
          {/* Variant Options */}
          {sortedOptions.length > 0 && sortedOptions[0].values.length > 1 && (
            <div className="mb-4 space-y-4">
              {sortedOptions.map((option) => (
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
          <p className="text-xs text-center text-muted-foreground mb-8">
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
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
