# Happy Path Marketing - Premium Website

A cutting-edge, AI-powered marketing website built with Next.js 14, React, TypeScript, Tailwind CSS, and Framer Motion. This website showcases Happy Path Marketing's services with modern design, smooth animations, and premium user experience.

## 🚀 Features

### Design & UX
- **Modern Premium Aesthetic**: Sophisticated glassmorphism effects with depth and dimension
- **Dynamic Animations**: Smooth page transitions, scroll-triggered animations, and parallax effects
- **Dark Theme**: Deep navy/purple color scheme with electric blue/cyan accents
- **Responsive Design**: Mobile-first approach, fully responsive across all devices
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion for smooth, performant animations
- **Icons**: React Icons
- **Font**: Inter & Plus Jakarta Sans (Google Fonts)

### Key Sections
1. **Hero**: Bold statement with animated background and interactive elements
2. **Services**: Expandable cards with hover effects showcasing all offerings
3. **Technology Stack**: Display of cutting-edge tools and integrations
4. **Case Studies**: Real results with impressive metrics and testimonials
5. **Process**: Interactive timeline showing methodology
6. **Pricing**: Three-tiered pricing with clear value propositions
7. **Testimonials**: Client reviews with star ratings and company info
8. **Contact**: Multi-channel contact options with form

### Pages
- **Home** (`/`): Main landing page with all sections
- **Services** (`/services`): Detailed breakdown of each service offering
- **Case Studies** (`/case-studies`): Portfolio with real client results
- **About** (`/about`): Company mission, values, and impact
- **Blog** (`/blog`): Marketing insights and AI strategies
- **Contact** (`/contact`): Dedicated contact page with form

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Setup Instructions

1. **Navigate to the website directory**:
   ```bash
   cd website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
website/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── blog/                # Blog page
│   ├── case-studies/        # Case studies page
│   ├── contact/             # Contact page
│   ├── services/            # Services page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── sitemap.ts           # Dynamic sitemap
│   └── manifest.ts          # PWA manifest
├── components/
│   ├── layout/              # Header, Footer
│   ├── sections/            # Page sections (Hero, Services, etc.)
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions
├── public/                  # Static assets
│   ├── images/             # Images
│   └── robots.txt          # SEO robots file
├── styles/                  # Additional styles
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

### Key Components

#### UI Components (`components/ui/`)
- **Button**: Multi-variant button with animations and loading states
- **Card**: Glassmorphic cards with hover effects
- **Container**: Responsive container wrapper
- **Section**: Page section wrapper with animations
- **AnimatedBackground**: Mesh gradient background with floating orbs

#### Section Components (`components/sections/`)
- **HeroSection**: Main hero with stats and CTAs
- **ServicesSection**: Expandable service cards
- **TechStackSection**: Technology showcase
- **CaseStudiesSection**: Client success stories
- **ProcessSection**: Interactive timeline
- **PricingSection**: Three-tiered pricing
- **TestimonialsSection**: Client reviews
- **ContactSection**: Multi-channel contact options

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: { /* ... */ },
  accent: {
    cyan: '#06b6d4',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    pink: '#ec4899',
  },
  dark: { /* ... */ },
}
```

### Fonts
Fonts are loaded in `app/layout.tsx`. To change fonts, update the imports:

```typescript
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
```

### Content
- **Services**: Edit `components/sections/ServicesSection.tsx`
- **Case Studies**: Edit `components/sections/CaseStudiesSection.tsx`
- **Testimonials**: Edit `components/sections/TestimonialsSection.tsx`
- **Pricing**: Edit `components/sections/PricingSection.tsx`

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the root directory to `website`
4. Deploy

### Other Platforms

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env.local` file in the `website` directory:

```env
# Site URL
NEXT_PUBLIC_SITE_URL=https://happypathmarketing.com

# Contact Form (if using a service like Formspree or SendGrid)
NEXT_PUBLIC_FORM_ENDPOINT=your-form-endpoint

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📈 SEO Optimization

The website includes:
- **Meta tags**: Comprehensive meta tags in each page
- **Open Graph**: Social media sharing optimization
- **Structured Data**: JSON-LD for rich snippets
- **Sitemap**: Dynamic sitemap at `/sitemap.xml`
- **Robots.txt**: Search engine crawling instructions
- **Fast Loading**: Optimized images, lazy loading, code splitting

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Color contrast compliance (WCAG AA)
- Alt text for images

## 🚀 Performance

- **Next.js 14**: Latest features including App Router
- **Image Optimization**: Next.js Image component with AVIF/WebP
- **Code Splitting**: Automatic code splitting by route
- **Lazy Loading**: Components and images load on demand
- **Font Optimization**: Self-hosted fonts with `next/font`
- **CSS Optimization**: Tailwind CSS purges unused styles

## 📝 License

Copyright © 2024 Happy Path Marketing. All rights reserved.

## 🤝 Support

For questions or support, please contact:
- **Email**: hello@happypathmarketing.com
- **Phone**: (123) 456-7890
- **Website**: https://happypathmarketing.com

---

**Built with ❤️ by Happy Path Marketing**
