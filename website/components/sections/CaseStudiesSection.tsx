'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FiArrowRight, FiTrendingUp, FiDollarSign, FiClock } from 'react-icons/fi'
import Link from 'next/link'

const caseStudies = [
  {
    industry: 'Solar Energy',
    company: 'SunPower Solutions',
    challenge: 'Manual lead follow-up causing 40% lead loss',
    solution: 'AI voice assistant + automated workflows',
    results: [
      { label: 'Lead Response Time', value: '< 5 min', icon: FiClock, change: '-85%' },
      { label: 'Conversion Rate', value: '62%', icon: FiTrendingUp, change: '+45%' },
      { label: 'Annual Savings', value: '$12K', icon: FiDollarSign, change: 'saved' },
    ],
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    industry: 'Water Filtration',
    company: 'AquaPure Systems',
    challenge: 'High SaaS costs eating into margins',
    solution: 'Custom CRM + automation platform',
    results: [
      { label: 'Software Costs', value: '$8.5K', icon: FiDollarSign, change: 'saved' },
      { label: 'Pipeline Velocity', value: '3x', icon: FiTrendingUp, change: 'faster' },
      { label: 'Time Saved', value: '20 hrs/wk', icon: FiClock, change: 'recovered' },
    ],
    gradient: 'from-accent-blue to-accent-purple',
  },
  {
    industry: 'Business Consulting',
    company: 'Strategic Growth Partners',
    challenge: 'Inconsistent content and low organic reach',
    solution: 'AI content generation + SEO strategy',
    results: [
      { label: 'Organic Traffic', value: '+285%', icon: FiTrendingUp, change: 'increase' },
      { label: 'Content Output', value: '4x', icon: FiClock, change: 'more' },
      { label: 'Cost per Lead', value: '-60%', icon: FiDollarSign, change: 'reduction' },
    ],
    gradient: 'from-accent-purple to-accent-pink',
  },
]

export function CaseStudiesSection() {
  return (
    <Section id="case-studies" spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Real Results, <span className="gradient-text">Real Impact</span>
        </SectionTitle>
        <SectionDescription>
          See how we've helped businesses transform their marketing and save thousands
        </SectionDescription>
      </SectionHeader>

      <div className="space-y-8">
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.company}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="glass" className="overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${study.gradient}`} />

              <CardContent className="p-6 md:p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Company Info */}
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full glass text-sm mb-4">
                      {study.industry}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold font-display mb-4">
                      {study.company}
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold text-accent-cyan mb-2">
                          Challenge
                        </h4>
                        <p className="text-dark-300">{study.challenge}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-accent-blue mb-2">
                          Solution
                        </h4>
                        <p className="text-dark-300">{study.solution}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Results */}
                  <div>
                    <h4 className="text-lg font-bold mb-6">Key Results</h4>
                    <div className="space-y-4">
                      {study.results.map((result) => {
                        const Icon = result.icon
                        return (
                          <div
                            key={result.label}
                            className="flex items-center justify-between p-4 rounded-xl glass-hover"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${study.gradient} p-[2px]`}>
                                <div className="w-full h-full bg-dark-950 rounded-lg flex items-center justify-center">
                                  <Icon className="w-5 h-5" />
                                </div>
                              </div>
                              <span className="text-sm text-dark-300">
                                {result.label}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold gradient-text">
                                {result.value}
                              </div>
                              <div className="text-xs text-dark-400">
                                {result.change}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Button
          variant="gradient"
          size="lg"
          rightIcon={<FiArrowRight />}
          asChild
        >
          <Link href="/case-studies">View All Case Studies</Link>
        </Button>
      </motion.div>
    </Section>
  )
}
