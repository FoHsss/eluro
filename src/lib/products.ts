import collarBlack from "@/assets/collar-black.png";
import collarBrown from "@/assets/collar-brown.png";

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  description: string;
  benefits: string[];
  details: string;
  shipping: string;
  returns: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "heritage-collar-black",
    name: "Heritage Collar",
    tagline: "Classic Black",
    price: 89,
    image: collarBlack,
    description: "Crafted from premium full-grain leather, the Heritage Collar combines timeless design with modern functionality. Features an integrated AirTag holder for peace of mind on every walk.",
    benefits: [
      "Full-grain leather that ages beautifully",
      "Integrated AirTag holder for GPS tracking",
      "Solid brass hardware, built to last",
      "Soft suede lining for comfort"
    ],
    details: "Materials: Full-grain leather, solid brass hardware, suede lining. Sizes available: S (10-14\"), M (14-18\"), L (18-22\"), XL (22-26\"). AirTag not included.",
    shipping: "Free shipping on all orders. Handcrafted in our studio within 2-3 business days. Delivered within 5-7 business days.",
    returns: "We offer a 30-day return policy. If you're not completely satisfied, return your unworn collar for a full refund."
  },
  {
    id: "2",
    slug: "heritage-collar-tan",
    name: "Heritage Collar",
    tagline: "Warm Tan",
    price: 89,
    image: collarBrown,
    description: "The same exceptional craftsmanship in a warm, inviting tan. This Heritage Collar develops a beautiful patina over time, becoming uniquely yours with every adventure shared.",
    benefits: [
      "Develops unique patina over time",
      "Integrated AirTag holder for GPS tracking",
      "Solid brass hardware, built to last",
      "Soft suede lining for comfort"
    ],
    details: "Materials: Full-grain leather, solid brass hardware, suede lining. Sizes available: S (10-14\"), M (14-18\"), L (18-22\"), XL (22-26\"). AirTag not included.",
    shipping: "Free shipping on all orders. Handcrafted in our studio within 2-3 business days. Delivered within 5-7 business days.",
    returns: "We offer a 30-day return policy. If you're not completely satisfied, return your unworn collar for a full refund."
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};
