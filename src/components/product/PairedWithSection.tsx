import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShopifyProduct } from "@/lib/shopify";

interface PairedWithSectionProps {
  products: ShopifyProduct[];
  currentHandle: string;
}

export const PairedWithSection = ({ products, currentHandle }: PairedWithSectionProps) => {
  // Find a different product to suggest
  const otherProduct = products.find(p => p.node.handle !== currentHandle);
  
  // Don't render if no other products exist
  if (!otherProduct) return null;

  const { node } = otherProduct;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="py-10 border-t border-border"
    >
      <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6 text-center">
        Often paired with
      </h3>

      <Link
        to={`/product/${node.handle}`}
        className="block max-w-xs mx-auto bg-secondary rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
      >
        <div className="aspect-square bg-secondary p-6 flex items-center justify-center">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="p-4 text-center">
          <h4 className="font-display text-base font-medium text-foreground mb-1">
            {node.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.section>
  );
};
