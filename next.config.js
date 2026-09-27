/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactivé car le Strict Mode de développement monte chaque composant
  // deux fois de suite, ce qui annule le chargement en cours de l'image
  // panoramique (voir components/PanoramaViewerInner.tsx) et la bloque sur
  // "Loading..." indéfiniment. Sans impact en production (le double
  // montage n'existe qu'en `npm run dev`).
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
