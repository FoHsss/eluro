import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShopifyProduct } from "@/lib/shopify";

interface ShopifyProductCardProps {
  product: ShopifyProduct;
  index: number;
}

const ShopifyProductCard = ({ product, index }: ShopifyProductCardProps) => {
  const { node } = product;
  const image = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${node.handle}`}
        className="block product-card bg-secondary rounded-xl overflow-hidden"
      >
        <div className="aspect-square bg-secondary p-8 flex items-center justify-center">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
            {node.options?.[0]?.values?.[0] || 'Premium'}
          </p>
          <h3 className="font-display text-lg font-medium text-foreground mb-2">
            {node.title}
          </h3>
          <p className="text-muted-foreground">
            {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ShopifyProductCard;
