import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/konto", "/dashboard", "/nachrichten", "/kasse", "/warenkorb", "/admin", "/anmelden", "/registrieren", "/auth", "/abmelden", "/melden"],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
