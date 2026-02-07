import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Shipping = () => {
  return (
    <Layout>
      <div className="py-20 md:py-32">
        <div className="container max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">
              Shipping Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> November 3, 2025 | <strong>Store:</strong> Doggo Spot | <strong>Contact Email:</strong> support@doggospotusa.com
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8 text-muted-foreground leading-relaxed"
          >
            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                1. Overview
              </h2>
              <p>
                Thank you for shopping at <strong>Doggo Spot</strong>. We strive to deliver your order as quickly and efficiently as possible. Below you will find details about our shipping times, costs, and procedures.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                2. Order Processing
              </h2>
              <p>
                All orders are processed within <strong>1–3 business days</strong> after receiving payment confirmation. Orders are not processed or shipped on weekends or public holidays. If we experience a high volume of orders, shipments may be delayed by a few days. You will receive a confirmation email with tracking once your order has been shipped.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                3. Shipping Times
              </h2>
              <p className="mb-3">We proudly ship to the <strong>United States</strong>. Typical delivery times (after processing) are:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Standard Shipping:</strong> 7–15 business days</li>
                <li><strong>Expedited Shipping (if available):</strong> 4–7 business days</li>
              </ul>
              <p className="mt-3">Please note that delivery times may vary depending on destination address and local customs procedures.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                4. Shipping Confirmation & Tracking
              </h2>
              <p>
                Once your order has shipped, you will receive an email with a tracking number. Tracking information may take up to 48 hours to update in the system. If you have not received tracking details within 5 business days of ordering, please contact us.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                5. Shipping Costs
              </h2>
              <p>
                Shipping costs are calculated at checkout based on weight and destination. We frequently offer <strong>Free Shipping</strong> promotions, which will be clearly indicated on our website header or at checkout.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                6. Wrong Address
              </h2>
              <p>
                Please double-check your shipping address before completing checkout. We are not responsible for packages delivered to an incorrect address provided by the customer. If a package is returned to us due to an incorrect address, reshipping fees may apply.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                7. Lost or Damaged Packages
              </h2>
              <p>
                If your package arrives damaged or is lost in transit, please <strong>contact us immediately</strong> at{" "}
                <a href="mailto:support@doggospotusa.com" className="text-foreground underline underline-offset-4">
                  support@doggospotusa.com
                </a>. We will work with the shipping carrier to locate your package or issue a replacement. Please save all packaging materials if your item arrived damaged.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                8. International Shipping
              </h2>
              <p>
                Currently, our primary market is the United States. If you are located outside the US, please contact us before purchasing to check availability.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                9. Contact Information
              </h2>
              <p>If you have any questions about shipping or delivery, please contact our support team:</p>
              <p className="mt-2">
                📧 <strong>Email:</strong>{" "}
                <a href="mailto:support@doggospotusa.com" className="text-foreground underline underline-offset-4">
                  support@doggospotusa.com
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
