import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Privacy = () => {
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
              Privacy Policy
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
                1. Introduction
              </h2>
              <p>
                Welcome to <strong>Doggo Spot</strong> ("we", "our", or "us"). This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website{" "}
                <a href="https://eluro.lovable.app" className="text-foreground underline underline-offset-4">
                  https://eluro.lovable.app
                </a>{" "}
                (the "Site") and use our services. By using our Site or making a purchase, you agree to the terms of this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                2. Information We Collect
              </h2>
              <p className="mb-3">We collect personal information that you provide directly to us, such as:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Name, shipping, and billing address</li>
                <li>Email address</li>
                <li>Payment information (processed securely by third-party payment providers such as Stripe or PayPal)</li>
                <li>Order details and purchase history</li>
              </ul>
              <p className="mt-3">
                We may also automatically collect non-identifiable data, such as browser type, device information, IP address, and website activity to improve your shopping experience.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process and deliver your orders</li>
                <li>Communicate with you about your orders, returns, or customer service inquiries</li>
                <li>Improve our products, services, and website experience</li>
                <li>Comply with legal and tax requirements</li>
                <li>Prevent fraud and unauthorized transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                4. Sharing Your Information
              </h2>
              <p className="mb-3">We may share your information only with trusted third-party providers necessary to operate our business, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Shopify</strong>, which hosts our online store</li>
                <li><strong>Stripe, PayPal</strong>, or other payment processors to handle secure transactions</li>
                <li><strong>Shipping partners</strong> to deliver your orders</li>
                <li><strong>Analytics tools</strong> (e.g., Google Analytics, TikTok Pixel) to understand customer behavior</li>
              </ul>
              <p className="mt-3">We never sell, rent, or trade your personal data to third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                5. Data Retention
              </h2>
              <p>
                We retain your information as long as needed to fulfill orders, meet legal obligations, and resolve disputes. When no longer needed, data is securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                6. Your Rights
              </h2>
              <p className="mb-3">If you are located in the United States or Europe, you have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Request access to your personal data</li>
                <li>Request correction or deletion of your data</li>
                <li>Opt out of marketing emails at any time (via the "Unsubscribe" link in our emails)</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:support@doggospotusa.com" className="text-foreground underline underline-offset-4">
                  support@doggospotusa.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                7. Data Security
              </h2>
              <p>
                We use SSL encryption and secure payment gateways (Shopify Payments, Stripe) to protect your information. Your payment details are never stored on our servers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                8. Cookies
              </h2>
              <p>
                We use cookies to improve your browsing experience, remember your preferences, and analyze traffic. You can disable cookies in your browser settings, but please note that some site features (like the Shopping Cart) may not work properly without them.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Updates will be posted on this page with a revised "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                10. Contact Information
              </h2>
              <p>If you have any questions about this Privacy Policy, please contact our support team:</p>
              <p className="mt-2">
                📧 <strong>Email:</strong>{" "}
                <a href="mailto:support@doggospotusa.com" className="text-foreground underline underline-offset-4">
                  support@doggospotusa.com
                </a>
              </p>
              <p className="mt-1">
                🏠 <strong>Business Address:</strong> ul. Mlynarska 30a, Warszawa 01-171, Poland
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
