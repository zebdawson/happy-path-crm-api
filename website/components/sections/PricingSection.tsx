'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FiCheck, FiStar, FiZap } from 'react-icons/fi'
import Link from 'next/link'

const plans = [
  {
    name: 'Foundation',
    description: 'Perfect for small businesses getting started with automation',
    price: '$2,500',
    period: '/month',
    features: [
      'GoHighLevel setup & management',
      'Basic automation workflows',
      'Email marketing campaigns',
      '5 AI-generated blog posts/month',
      'Monthly performance reports',
      'Email support',
    ],
    cta: 'Get Started',
    popular: false,
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    name: 'Growth',
    description: 'For businesses ready to scale with advanced AI automation',
    price: '$5,000',
    period: '/month',
    features: [
      'Everything in Foundation',
      'AI voice assistant (Sage) integration',
      'Advanced automation workflows',
      '15 AI-generated blog posts/month',
      'SEO optimization & strategy',
      'Social media management',
      'Paid ads management (Google/Meta)',
      'Weekly strategy calls',
      'Priority support',
    ],
    cta: 'Most Popular',
    popular: true,
    gradient: 'from-accent-blue to-accent-purple',
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for high-growth companies',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Growth',
      'Custom software development',
      'Unlimited AI content generation',
      'Multi-location support',
      'Dedicated account manager',
      'Custom integrations',
      'White-label solutions',
      'SLA guarantees',
      '24/7 premium support',
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-accent-purple to-accent-pink',
  },
]

export function PricingSection() {
  return (
    <Section id="pricing" variant="dark" spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Transparent <span className="gradient-text">Pricing</span>
        </SectionTitle>
        <SectionDescription>
          Choose the perfect plan to transform your marketing. All plans include free onboarding.
        </SectionDescription>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <div className="px-4 py-1 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple text-sm font-semibold flex items-center gap-1">
                  <FiStar className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}

            <Card
              variant="glass"
              className={`h-full ${
                plan.popular
                  ? 'border-2 border-accent-blue shadow-glow-lg scale-105'
                  : ''
              }`}
            >
              <CardContent className="p-8">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold font-display mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-dark-400">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold gradient-text">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-dark-400">{plan.period}</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant={plan.popular ? 'gradient' : 'outline'}
                  size="lg"
                  className="w-full mb-8"
                  asChild
                >
                  <Link href="/contact">{plan.cta}</Link>
                </Button>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} p-[2px] flex-shrink-0 mt-0.5`}>
                        <div className="w-full h-full bg-dark-950 rounded-full flex items-center justify-center">
                          <FiCheck className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <span className="text-sm text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ROI Calculator CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card variant="gradient" className="max-w-3xl mx-auto">
          <CardContent className="p-8 text-center">
            <FiZap className="w-12 h-12 mx-auto mb-4 text-accent-cyan" />
            <h3 className="text-2xl font-bold font-display mb-2">
              Calculate Your Potential ROI
            </h3>
            <p className="text-dark-300 mb-6">
              Most clients save $8K+ annually while growing revenue by 40%+
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Section>
  )
}
