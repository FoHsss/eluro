import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const Shop = () => {
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
              Collection
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">
              Shop All
            </h1>
          </motion.div>

          {/* Product Grid - Mobile First: 1 column */}
          <div className="grid gap-8 max-w-lg mx-auto">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
