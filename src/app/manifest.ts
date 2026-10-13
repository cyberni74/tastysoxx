import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TastySoxx",
    short_name: "TastySoxx",
    start_url: "/",
    display: "standalone",
    background_color: "#08080c",
    theme_color: "#08080c",
    icons: [
      { src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
