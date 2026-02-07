import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Terms = () => {
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
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> November 3, 2025 | <strong>Store:</strong> Doggo Spot | <strong>Contact Email:</strong> support@doggospotusa.com
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              <strong>Business Address:</strong> ul. Mlynarska 30a, Warszawa 01-171, Poland
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
                This website is operated by <strong>Doggo Spot</strong>. Throughout the site, the terms "we", "us" and "our" refer to Doggo Spot. By visiting our site{" "}
                <a href="https://eluro.lovable.app" className="text-foreground underline underline-offset-4">
                  https://eluro.lovable.app
                </a>{" "}
                and/or purchasing something from us, you agree to be bound by the following Terms of Service ("Terms", "Agreement"). These Terms apply to all users of the site, including browsers, customers, merchants, and contributors of content.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                2. Online Store Terms
              </h2>
              <p>
                By using this website, you represent that you are at least the age of majority in your state or province of residence. You may not use our products for any illegal or unauthorized purpose, nor may you violate any laws in your jurisdiction. A breach of any of these Terms will result in immediate termination of your access to our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                3. General Conditions
              </h2>
              <p>
                We reserve the right to refuse service to anyone for any reason at any time. Your content (excluding payment information) may be transferred unencrypted and involve transmissions over various networks. Payment information is always encrypted during transfer via secure payment gateways such as Stripe or PayPal.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                4. Accuracy, Completeness, and Timeliness of Information
              </h2>
              <p>
                We are not responsible if information made available on this site is not accurate, complete, or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                5. Modifications to the Service and Prices
              </h2>
              <p>
                Prices for our products are subject to change without notice. We reserve the right to modify or discontinue any product or service at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                6. Products or Services
              </h2>
              <p>
                Certain products or services may be available exclusively online through the website. We have made every effort to display the colors and images of our products as accurately as possible, but we cannot guarantee that your computer monitor will display colors precisely. We reserve the right to limit the sales of our products to any person, region, or jurisdiction, and to discontinue any product at any time.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                7. Accuracy of Billing and Account Information
              </h2>
              <p>
                You agree to provide current, complete, and accurate purchase and account information for all transactions made on our store. You agree to promptly update your account and other information, including your email address and payment details, so we can complete your transactions and contact you when needed.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                8. Third-Party Links
              </h2>
              <p>
                Certain content, products, and services available via our site may include materials from third parties. We are not responsible for examining or evaluating the content or accuracy of any third-party websites.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                9. Personal Information
              </h2>
              <p>
                Your submission of personal information through the store is governed by our Privacy Policy. You can review it{" "}
                <a href="/privacy" className="text-foreground underline underline-offset-4">
                  here
                </a>.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                10. Errors, Inaccuracies, and Omissions
              </h2>
              <p>
                Occasionally there may be information on our site that contains typographical errors, inaccuracies, or omissions related to product descriptions, pricing, promotions, or availability. We reserve the right to correct any errors or update information at any time without prior notice.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                11. Disclaimer of Warranties and Limitation of Liability
              </h2>
              <p>
                We do not guarantee that your use of our service will be uninterrupted, timely, or error-free. You agree that your use of our service is at your sole risk. All products and services are provided "as is" and "as available" without any warranties. In no case shall <strong>Doggo Spot</strong> or its affiliates be liable for any injury, loss, or damages of any kind arising from the use of our site or products.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                12. Indemnification
              </h2>
              <p>
                You agree to indemnify and hold harmless <strong>Doggo Spot</strong> and its affiliates from any claim or demand arising out of your breach of these Terms or violation of any law.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                13. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                14. Contact Information
              </h2>
              <p>Questions about the Terms of Service should be sent to us at:</p>
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

export default Terms;
