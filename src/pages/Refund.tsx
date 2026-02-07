import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Refund = () => {
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
              Refund Policy
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
                1. Return Policy Overview
              </h2>
              <p>
                We have a <strong>30-day return policy</strong>, which means you have 30 days after receiving your item to request a return.
              </p>
              <p className="mt-3">
                To be eligible for a return, your item must be in the same condition that you received it: <strong>unworn or unused, with tags, and in its original packaging</strong>. You'll also need the receipt or proof of purchase.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                2. How to Start a Return
              </h2>
              <p>
                To start a return, you can contact us at{" "}
                <a href="mailto:support@doggospotusa.com" className="text-foreground underline underline-offset-4">
                  support@doggospotusa.com
                </a>.
              </p>
              <p className="mt-3">Please note:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li><strong>Do not send items back to the address on the package.</strong> We will provide you with the correct return address instructions via email.</li>
                <li>Items sent back to us without first requesting a return will not be accepted.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                3. Return Shipping Costs
              </h2>
              <p>
                Unless the item is defective or we made an error (e.g., wrong item sent), <strong>the customer is responsible for paying the shipping costs for returning the item</strong>. Shipping costs are non-refundable.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                4. Damages and Issues
              </h2>
              <p>
                Please inspect your order upon reception and contact us immediately if the item is defective, damaged, or if you receive the wrong item, so that we can evaluate the issue and make it right. For defective or damaged products, we will offer a free replacement or a full refund.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                5. Exceptions / Non-returnable items
              </h2>
              <p>
                Certain types of items cannot be returned, like custom products (such as special orders or personalized items) or hazardous materials. Unfortunately, we cannot accept returns on <strong>sale items</strong> or gift cards.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                6. Exchanges
              </h2>
              <p>
                The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                7. Refunds
              </h2>
              <p>
                We will notify you once we've received and inspected your return, and let you know if the refund was approved or not. If approved, you'll be automatically refunded on your original payment method within <strong>10 business days</strong>. Please remember it can take some time for your bank or credit card company to process and post the refund too.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                8. European Union 14 day cooling off period
              </h2>
              <p>
                Notwithstanding the above, if the merchandise is being shipped into the European Union, you have the right to cancel or return your order within 14 days, for any reason and without a justification. As above, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-medium text-foreground mb-3">
                9. Contact Information
              </h2>
              <p>If you have any questions about our Refund Policy, please contact us:</p>
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

export default Refund;
