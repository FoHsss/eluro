import { useParams, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { ReviewsSection } from "@/components/ReviewsSection";
import sizeChartImage from "@/assets/size-chart.jpg";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useShopifyProduct(slug);
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  const imageRef = useRef<HTMLDivElement>(null);
  
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

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

  // Hero image is driven by variant, not gallery selection
  const getHeroImage = () => {
    // Priority 1: Variant image
    if (selectedVariant?.image) return selectedVariant.image;
    
    // Priority 2: Find image by selected color (match altText or URL)
    const selectedColor = selectedOptions['Color'] || 
      selectedVariant?.selectedOptions.find(o => o.name === 'Color')?.value;
    
    if (selectedColor) {
      const colorMatch = product.images.edges.find(img => {
        const alt = img.node.altText?.toLowerCase() || '';
        const url = img.node.url.toLowerCase();
        const color = selectedColor.toLowerCase();
        return alt.includes(color) || url.includes(color);
      });
      if (colorMatch) return colorMatch.node;
    }
    
    // Priority 3: First image
    return product.images.edges[0]?.node;
  };
  
  const heroImage = getHeroImage();
  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  
  // Filtered gallery images (only those with 'gallery' in altText)
  const galleryImages = product.images.edges.filter(
    img => img.node.altText?.toLowerCase().includes('gallery')
  );

  // Sort options: Color first, then Size
  const sortedOptions = product.options ? [...product.options].sort((a, b) => {
    if (a.name.toLowerCase() === 'color') return -1;
    if (b.name.toLowerCase() === 'color') return 1;
    return 0;
  }) : [];

  return (
    <Layout>
      <div className="pb-20">
        {/* Hero Image with Parallax + Overlay */}
        <div
          ref={imageRef}
          className="relative min-h-screen bg-secondary"
        >
          {/* Product Image - takes most of the screen */}
          <motion.div
            style={{ y, perspective: 1000 }}
            className="absolute inset-0 flex items-center justify-center p-6 pb-[45vh] md:pb-[40vh]"
          >
            {heroImage ? (
              <motion.img
                key={heroImage.url}
                initial={{ opacity: 0, rotateY: 15, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                src={heroImage.url}
                alt={heroImage.altText || product.title}
                className="max-w-full max-h-full object-contain cursor-pointer"
                style={{ transformStyle: "preserve-3d" }}
                onClick={() => {
                  const heroIdx = product.images.edges.findIndex(img => img.node.url === heroImage.url);
                  setLightboxIndex(heroIdx >= 0 ? heroIdx : 0);
                  setLightboxOpen(true);
                }}
              />
            ) : (
              <div className="text-muted-foreground">No image available</div>
            )}
          </motion.div>

          {/* Bottom overlay with gradient background - все на одном экране */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            {/* Gradient fade into overlay */}
            <div className="h-16 bg-gradient-to-t from-background/95 to-transparent" />
            
            {/* Content panel */}
            <div className="bg-gradient-to-t from-background via-background/95 to-background/90 backdrop-blur-sm px-4 pb-6 pt-2">
              <div className="container max-w-lg mx-auto">
                {/* Title + Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-3"
                >
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    Thoughtfully chosen
                  </p>
                  <div className="flex items-baseline justify-between gap-4">
                    <h1 className="font-display text-lg md:text-xl font-medium text-foreground leading-tight">
                      {product.title}
                    </h1>
                    <p className="text-base font-medium text-foreground whitespace-nowrap">
                      {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                    </p>
                  </div>
                </motion.div>

                {/* Variant Options - compact horizontal layout */}
                {sortedOptions.length > 0 && sortedOptions[0].values.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mb-3 space-y-2"
                  >
                    {sortedOptions.map((option) => (
                      <div key={option.name} className="flex items-center gap-2">
                        <label className="text-xs font-medium text-muted-foreground min-w-[40px]">
                          {option.name}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {option.values.map((value) => {
                            const isSelected = selectedOptions[option.name] === value || 
                              (!selectedOptions[option.name] && selectedVariant?.selectedOptions.find(o => o.name === option.name)?.value === value);
                            
                            return (
                              <button
                                key={value}
                                onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                                  isSelected 
                                    ? 'bg-foreground text-background' 
                                    : 'bg-background/80 border border-border/50 hover:border-border'
                                }`}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* CTA Button */}
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !selectedVariant?.availableForSale}
                  className="btn-cta btn-cta-pulse mb-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAddingToCart ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : selectedVariant?.availableForSale ? (
                    'Add to Cart'
                  ) : (
                    'Sold Out'
                  )}
                </motion.button>

                {/* Size Chart Link */}
                <button 
                  onClick={() => setSizeChartOpen(true)}
                  className="text-xs text-center text-primary/70 hover:text-primary underline underline-offset-2 w-full transition-colors"
                >
                  Measure your pet's neck before purchasing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content below hero */}
        <div className="container max-w-lg mx-auto px-4 pt-8">
          {/* Description */}
          {product.description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </motion.div>
          )}

          {/* Thumbnail Gallery - Horizontal Carousel with Glassmorphism */}
          {galleryImages.length > 0 && (
            <div className="mb-10 py-8 px-4 bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 rounded-3xl">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 text-center">
                Gallery
              </h3>
              <div 
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-6 px-4 scrollbar-hide"
                style={{ perspective: '1000px' }}
              >
                {galleryImages.map((img, index) => (
                  <motion.button
                    key={img.node.url}
                    onClick={() => {
                      setLightboxIndex(index);
                      setLightboxOpen(true);
                    }}
                    initial={{ rotateY: 25, opacity: 0.5, scale: 0.9 }}
                    whileInView={{ rotateY: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.7 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="w-[250px] h-[250px] rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:border-white/40 transition-all duration-300 flex-shrink-0 snap-center"
                  >
                    <img 
                      src={img.node.url} 
                      alt={img.node.altText || `${product.title} - ${index + 1}`}
                      className="w-full h-full object-contain" 
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <ReviewsSection productHandle={product.handle} />
        </div>
      </div>
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button 
              className="absolute top-6 right-6 text-white/80 hover:text-white z-10 p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            
            {/* Navigation arrows */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  className="absolute left-4 text-white/60 hover:text-white p-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(prev => 
                      prev === 0 ? galleryImages.length - 1 : prev - 1
                    );
                  }}
                >
                  <ChevronLeft className="w-10 h-10" />
                </button>
                <button 
                  className="absolute right-4 text-white/60 hover:text-white p-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(prev => 
                      prev === galleryImages.length - 1 ? 0 : prev + 1
                    );
                  }}
                >
                  <ChevronRight className="w-10 h-10" />
                </button>
              </>
            )}
            
            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={galleryImages[lightboxIndex]?.node.url}
              alt={galleryImages[lightboxIndex]?.node.altText || product.title}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Dot indicators */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-6 flex gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === lightboxIndex 
                        ? 'bg-white w-6' 
                        : 'bg-white/40 w-2 hover:bg-white/60'
                    }`}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setLightboxIndex(index); 
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size Chart Lightbox */}
      <AnimatePresence>
        {sizeChartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSizeChartOpen(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white/80 hover:text-white z-10 p-2"
              onClick={() => setSizeChartOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={sizeChartImage}
              alt="Size Chart"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProductPage;
