import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteIcon = "https://kia.prz.edu.pl/wp-content/uploads/2025/11/cropped-cropped-kia-150x144.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kia",
    short_name: "kia",
    description: "System dydaktyczny Katedry Informatyki i Automatyki",
    display: "standalone",
    icons: [
      {
        src: siteIcon,
        sizes: "150x144",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
}
