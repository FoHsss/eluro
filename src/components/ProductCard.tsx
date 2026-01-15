import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block product-card bg-secondary rounded-xl overflow-hidden"
      >
        <div className="aspect-square bg-secondary p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={`${product.name} - ${product.tagline}`}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="p-6">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
            {product.tagline}
          </p>
          <h3 className="font-display text-lg font-medium text-foreground mb-2">
            {product.name}
          </h3>
          <p className="text-muted-foreground">${product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
