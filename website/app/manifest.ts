import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Happy Path Marketing',
    short_name: 'Happy Path',
    description: 'AI-Powered Marketing Automation and Business Growth Solutions',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
