import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ProductAccordionProps {
  details: string;
  shipping: string;
  returns: string;
}

const ProductAccordion = ({ details, shipping, returns }: ProductAccordionProps) => {
  const items = [
    { value: "details", title: "Details", content: details },
    { value: "shipping", title: "Shipping", content: shipping },
    { value: "returns", title: "Returns", content: returns },
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.value}
          value={item.value}
          className="accordion-calm"
        >
          <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-5">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
            {item.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ProductAccordion;
