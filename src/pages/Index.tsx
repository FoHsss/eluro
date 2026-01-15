import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { products } from "@/lib/products";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-widest text-muted-foreground mb-6"
          >
            Thoughtfully Chosen
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 text-balance leading-tight"
          >
            Crafted with care,
            <br />
            made to last
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Premium leather goods designed for the moments that matter. 
            Simple, beautiful, enduring.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/shop"
              className="inline-block btn-cta px-10 py-4 text-center"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">
              Featured
            </h2>
          </motion.div>

          <div className="grid gap-8 max-w-lg mx-auto">
            {products.slice(0, 2).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="block product-card bg-secondary rounded-2xl overflow-hidden group"
                >
                  <div className="aspect-square bg-secondary p-12 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={`${product.name} - ${product.tagline}`}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 text-center">
                    <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                      {product.tagline}
                    </p>
                    <h3 className="font-display text-xl font-medium text-foreground mb-2">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground">${product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16"
          >
            <Link
              to="/shop"
              className="link-subtle text-sm font-medium text-foreground"
            >
              View All Products
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-20 md:py-32 bg-secondary">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed text-balance"
          >
            "We believe the best things are chosen carefully and kept for a lifetime."
          </motion.p>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
