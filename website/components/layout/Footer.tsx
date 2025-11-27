'use client'

import Link from 'next/link'
import { FiMail, FiPhone, FiMapPin, FiLinkedin, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'

const services = [
  { name: 'AI Marketing Automation', href: '/services#ai-automation' },
  { name: 'GoHighLevel Integration', href: '/services#gohighlevel' },
  { name: 'Custom Software Development', href: '/services#custom-software' },
  { name: 'AI Voice Assistants', href: '/services#ai-voice' },
  { name: 'SEO & Content Marketing', href: '/services#seo' },
  { name: 'Paid Advertising', href: '/services#paid-ads' },
]

const company = [
  { name: 'About Us', href: '/about' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
]

const industries = [
  { name: 'Solar Energy', href: '/industries/solar' },
  { name: 'Water Filtration', href: '/industries/water-filtration' },
  { name: 'Business Consulting', href: '/industries/consulting' },
  { name: 'E-commerce', href: '/industries/ecommerce' },
  { name: 'Field Services', href: '/industries/field-services' },
]

const socialLinks = [
  { name: 'LinkedIn', href: '#', icon: FiLinkedin },
  { name: 'Twitter', href: '#', icon: FiTwitter },
  { name: 'Instagram', href: '#', icon: FiInstagram },
  { name: 'Facebook', href: '#', icon: FiFacebook },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 bg-dark-950/80 backdrop-blur-xl">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple p-[2px]">
                  <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold gradient-text">H</span>
                  </div>
                </div>
                <span className="font-display font-bold text-2xl">Happy Path Marketing</span>
              </div>
            </Link>
            <p className="text-dark-400 mb-6 max-w-md">
              Transforming businesses with AI-powered marketing automation and cutting-edge digital solutions.
              Save thousands while scaling your growth.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:hello@happypathmarketing.com"
                className="flex items-center gap-2 text-dark-400 hover:text-accent-cyan transition-colors"
              >
                <FiMail className="w-5 h-5" />
                <span>hello@happypathmarketing.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-dark-400 hover:text-accent-cyan transition-colors"
              >
                <FiPhone className="w-5 h-5" />
                <span>(123) 456-7890</span>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Industries</h3>
            <ul className="space-y-3">
              {industries.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-dark-400 text-sm">
            © {currentYear} Happy Path Marketing. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-lg glass-hover flex items-center justify-center text-dark-400 hover:text-accent-cyan transition-colors"
                  aria-label={item.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </Container>

      {/* Gradient Overlay */}
      <div className="absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-dark-950 to-transparent pointer-events-none" />
    </footer>
  )
}
