import { useParams, Navigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Layout from "@/components/Layout";
import ProductAccordion from "@/components/ProductAccordion";
import { getProductBySlug } from "@/lib/products";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  if (!product) {
    return <Navigate to="/shop" replace />;
  }

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
            <motion.img
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              src={product.image}
              alt={`${product.name} - ${product.tagline}`}
              className="max-w-full max-h-full object-contain"
            />
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
              {product.name}
            </h1>
            <p className="text-muted-foreground mb-4">{product.tagline}</p>

            {/* Price */}
            <p className="text-lg text-muted-foreground mb-8">${product.price}</p>

            {/* CTA Button */}
            <button className="btn-cta btn-cta-pulse mb-4">Add to Cart</button>

            {/* Micro-copy */}
            <p className="text-xs text-center text-muted-foreground mb-12">
              Thoughtfully chosen for everyday use
            </p>

            {/* Description */}
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

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-3"
                  >
                    <span className="w-1 h-1 bg-foreground rounded-full mt-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Accordion Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
            >
              <ProductAccordion
                details={product.details}
                shipping={product.shipping}
                returns={product.returns}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
