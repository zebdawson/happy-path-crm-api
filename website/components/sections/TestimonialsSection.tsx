'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { FiStar } from 'react-icons/fi'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, SunPower Solutions',
    company: 'Solar Energy',
    image: '/images/testimonials/sarah.jpg',
    content:
      'Happy Path transformed our lead follow-up process. The AI voice assistant responds to inquiries within minutes, and our conversion rate jumped 45%. Best investment we\'ve made.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Marketing Director, AquaPure Systems',
    company: 'Water Filtration',
    content:
      'We were spending over $10K annually on various SaaS tools. Happy Path built us a custom solution that does everything we need for a fraction of the cost. The team is incredible.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Founder, Strategic Growth Partners',
    company: 'Business Consulting',
    content:
      'The AI content generation has been a game-changer. We went from publishing 2 blog posts a month to 15, and our organic traffic increased by 285%. ROI is off the charts.',
    rating: 5,
  },
  {
    name: 'David Thompson',
    role: 'VP of Operations, HomeService Pro',
    company: 'Field Services',
    content:
      'GoHighLevel integration and automation workflows have saved our team 20+ hours per week. The level of customization and support from Happy Path is unmatched.',
    rating: 5,
  },
  {
    name: 'Lisa Martinez',
    role: 'E-commerce Manager, ShopLocal',
    company: 'E-commerce',
    content:
      'Their paid ads management brought our cost per acquisition down by 60% while tripling our ROAS. The data-driven approach and transparency are refreshing.',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Owner, Wilson Consulting Group',
    company: 'Business Consulting',
    content:
      'From strategy to execution, Happy Path delivers. The custom CRM and automation have streamlined our entire sales process. Highly recommend!',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <Section spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Loved by <span className="gradient-text">Businesses</span> Worldwide
        </SectionTitle>
        <SectionDescription>
          See what our clients have to say about working with us
        </SectionDescription>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={`${testimonial.name}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="glass" className="h-full">
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-4 h-4 fill-accent-cyan text-accent-cyan"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-dark-300 mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple p-[2px]">
                    <div className="w-full h-full bg-dark-950 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-dark-400">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-accent-cyan">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <div className="glass rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">250+</div>
              <div className="text-sm text-dark-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-sm text-dark-400">Hours Automated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">$2M+</div>
              <div className="text-sm text-dark-400">Client Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text mb-2">98%</div>
              <div className="text-sm text-dark-400">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}
