/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.elo7.com.br', 'static.ricmais.com.br'],
    formats: ['image/avif', 'image/webp'],
  }
}

module.exports = nextConfig 

