'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  FiCpu,
  FiZap,
  FiCode,
  FiMic,
  FiTrendingUp,
  FiTarget,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
} from 'react-icons/fi'
import Link from 'next/link'

const services = [
  {
    icon: FiCpu,
    title: 'AI-Powered Content Generation',
    description: 'Automate content creation with advanced AI that understands your brand voice.',
    features: [
      'Blog posts and articles',
      'Social media content',
      'Email campaigns',
      'Product descriptions',
      'SEO-optimized copy',
    ],
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    icon: FiZap,
    title: 'GoHighLevel Integration',
    description: 'Complete platform setup, management, and optimization for maximum ROI.',
    features: [
      'CRM configuration',
      'Automation workflows',
      'Sales funnels',
      'Email & SMS campaigns',
      'Pipeline management',
    ],
    gradient: 'from-accent-blue to-accent-purple',
  },
  {
    icon: FiCode,
    title: 'Custom Software Development',
    description: 'Replace expensive SaaS subscriptions with tailored solutions built for your needs.',
    features: [
      'Custom web applications',
      'API integrations',
      'Automation tools',
      'Database solutions',
      'Save $8K+ annually',
    ],
    gradient: 'from-accent-purple to-accent-pink',
  },
  {
    icon: FiMic,
    title: '24/7 AI Voice Assistants',
    description: 'Never miss a lead with Sage, our intelligent AI voice assistant.',
    features: [
      'Lead qualification',
      'Appointment scheduling',
      'Customer support',
      'Follow-up calls',
      'Natural conversations',
    ],
    gradient: 'from-accent-pink to-accent-cyan',
  },
  {
    icon: FiTrendingUp,
    title: 'SEO & Content Marketing',
    description: 'Dominate search results with data-driven SEO and content strategies.',
    features: [
      'Technical SEO audits',
      'Keyword research',
      'Content strategy',
      'Link building',
      'Performance tracking',
    ],
    gradient: 'from-accent-cyan to-accent-purple',
  },
  {
    icon: FiTarget,
    title: 'Paid Advertising',
    description: 'Maximize ROI with expertly managed Google Ads, Facebook, and LinkedIn campaigns.',
    features: [
      'Campaign strategy',
      'Ad creative design',
      'A/B testing',
      'Conversion optimization',
      'Real-time reporting',
    ],
    gradient: 'from-accent-blue to-accent-pink',
  },
]

export function ServicesSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <Section id="services" spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Comprehensive <span className="gradient-text">AI-Powered</span> Services
        </SectionTitle>
        <SectionDescription>
          From automation to custom development, we provide everything you need to scale your marketing and save thousands.
        </SectionDescription>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon
          const isExpanded = expandedIndex === index

          return (
            <Card
              key={service.title}
              variant="glass"
              className="relative overflow-hidden group cursor-pointer"
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              {/* Gradient overlay on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} p-[2px] mb-4`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold font-display mb-2 group-hover:gradient-text transition-all duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-dark-400 mb-4">{service.description}</p>

                {/* Expandable Features */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature) => (
                          <motion.li
                            key={feature}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2 text-sm text-dark-300"
                          >
                            <FiCheck className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand/Collapse Button */}
                <button
                  className="flex items-center gap-2 text-accent-cyan hover:text-accent-blue transition-colors text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedIndex(isExpanded ? null : index)
                  }}
                >
                  {isExpanded ? (
                    <>
                      Show Less <FiChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View Features <FiChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="text-center mt-12"
      >
        <Button variant="gradient" size="lg" asChild>
          <Link href="/services">Explore All Services</Link>
        </Button>
      </motion.div>
    </Section>
  )
}
