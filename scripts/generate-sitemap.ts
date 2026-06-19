// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://eiuro.com";

const SHOPIFY_STOREFRONT_URL =
  "https://xgn97e-x0.myshopify.com/api/2025-07/graphql.json";
const SHOPIFY_STOREFRONT_TOKEN = "7b079bc595938244568b08a3286fe24b";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/shop", changefreq: "weekly", priority: "0.9" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/shipping", changefreq: "monthly", priority: "0.5" },
  { path: "/refund", changefreq: "monthly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

async function fetchProductHandles(): Promise<string[]> {
  const handles: string[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < 10; i++) {
    const query = `query($cursor: String) {
      products(first: 100, after: $cursor) {
        pageInfo { hasNextPage endCursor }
        edges { node { handle } }
      }
    }`;
    const res: Response = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables: { cursor } }),
    });
    if (!res.ok) {
      console.warn(`sitemap: Shopify request failed ${res.status}; skipping product entries`);
      return handles;
    }
    const json: any = await res.json();
    const edges = json?.data?.products?.edges ?? [];
    for (const e of edges) if (e?.node?.handle) handles.push(e.node.handle);
    if (!json?.data?.products?.pageInfo?.hasNextPage) break;
    cursor = json.data.products.pageInfo.endCursor;
  }
  return handles;
}

function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    "",
  ].join("\n");
}

async function main() {
  let productEntries: SitemapEntry[] = [];
  try {
    const handles = await fetchProductHandles();
    productEntries = handles.map((h) => ({
      path: `/product/${h}`,
      changefreq: "weekly" as const,
      priority: "0.8",
    }));
  } catch (err) {
    console.warn("sitemap: failed to fetch products", err);
  }

  const entries = [...staticEntries, ...productEntries];
  writeFileSync(resolve("public/sitemap.xml"), renderSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries, ${productEntries.length} products)`);
}

main();
