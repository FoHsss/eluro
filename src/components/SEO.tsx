import { Helmet } from "react-helmet-async";

export interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  image?: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}

const SITE = "https://eiuro.com";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/L11b05qER4YOb6PScDYS8anNEfv2/social-images/social-1768493233593-Eluro Logo 2.0 witf tagline.jpg";

export default function SEO({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_IMAGE,
  jsonLd,
  noindex,
}: SEOProps) {
  const url = `${SITE}${path}`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
