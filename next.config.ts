import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Ficheiros carregados pelo painel (UploadThing)
      { protocol: "https", hostname: "*.ufs.sh", pathname: "/**" },
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      // Imagens dos eventos antigos
      { protocol: "https", hostname: "ik.imagekit.io", pathname: "/**" },
      // Links colados no painel podem vir de qualquer domínio HTTPS.
      { protocol: "https", hostname: "**", pathname: "/**" },
    ],
  },
  reactStrictMode: true,
  // TypeORM usa require dinâmico de drivers; não deve ser empacotado.
  serverExternalPackages: ["typeorm", "pg"],
};

export default nextConfig;
