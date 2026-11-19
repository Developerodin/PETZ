import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PETZ",
    short_name: "PETZ",
    description: "Know your pet's health before the symptoms.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdfb",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/assets/images/golden-retriever.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
