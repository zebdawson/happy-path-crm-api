import { Metadata } from 'next'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FiTarget, FiHeart, FiAward, FiZap } from 'react-icons/fi'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us | Happy Path Marketing',
  description:
    'Learn about Happy Path Marketing - your partner in AI-powered marketing automation and business growth.',
}

const values = [
  {
    icon: FiZap,
    title: 'Innovation First',
    description:
      'We stay at the cutting edge of AI and automation technology to deliver solutions that give you a competitive advantage.',
  },
  {
    icon: FiHeart,
    title: 'Client Success',
    description:
      "Your growth is our growth. We're not satisfied until you're seeing real, measurable results that transform your business.",
  },
  {
    icon: FiAward,
    title: 'Excellence Always',
    description:
      'From strategy to execution, we maintain the highest standards in everything we do. No shortcuts, no compromises.',
  },
  {
    icon: FiTarget,
    title: 'Results Driven',
    description:
      'We focus on metrics that matter - ROI, conversions, and growth. Pretty dashboards mean nothing without real business impact.',
  },
]

const stats = [
  { value: '250+', label: 'Clients Served' },
  { value: '$2M+', label: 'Client Savings' },
  { value: '10K+', label: 'Hours Automated' },
  { value: '98%', label: 'Satisfaction Rate' },
]

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <Section spacing="lg">
        <Container size="md" className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
            Transforming Businesses with{' '}
            <span className="gradient-text">AI-Powered Marketing</span>
          </h1>
          <p className="text-xl md:text-2xl text-dark-300">
            We&apos;re not just another marketing agency. We&apos;re your technology partner,
            helping you leverage AI and automation to grow faster and smarter.
          </p>
        </Container>
      </Section>

      {/* Mission */}
      <Section variant="dark" spacing="xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-dark-300 mb-6">
              We exist to democratize access to cutting-edge AI and automation
              technology, making enterprise-level marketing capabilities available
              to businesses of all sizes.
            </p>
            <p className="text-lg text-dark-300 mb-6">
              Too many businesses are trapped paying thousands for SaaS
              subscriptions that don&apos;t talk to each other, drowning in manual
              tasks, and missing opportunities because they can&apos;t respond fast
              enough.
            </p>
            <p className="text-lg text-dark-300">
              We change that. Through custom-built solutions, AI automation, and
              strategic expertise, we help you do more with less - saving money
              while growing faster.
            </p>
          </div>

          <div className="space-y-6">
            <Card variant="glass" className="glow-effect">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Why We&apos;re Different</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-cyan flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-dark-300">
                      We build custom solutions instead of forcing you into
                      cookie-cutter templates
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-blue flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-dark-300">
                      We focus on ROI and real business metrics, not vanity numbers
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-purple flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-dark-300">
                      We leverage the latest AI technology to give you a
                      competitive edge
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent-pink flex-shrink-0 flex items-center justify-center mt-0.5">
                      <span className="text-xs">✓</span>
                    </div>
                    <span className="text-dark-300">
                      We&apos;re transparent about pricing, timelines, and results
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section spacing="xl">
        <SectionHeader>
          <SectionTitle>
            Our <span className="gradient-text">Values</span>
          </SectionTitle>
          <SectionDescription>
            The principles that guide everything we do
          </SectionDescription>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <Card key={value.title} variant="glass" className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple p-[2px]">
                    <div className="w-full h-full bg-dark-950 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">
                    {value.title}
                  </h3>
                  <p className="text-dark-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Section>

      {/* Stats */}
      <Section variant="gradient" spacing="lg">
        <SectionHeader>
          <SectionTitle>Our Impact in Numbers</SectionTitle>
        </SectionHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-dark-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Industries */}
      <Section spacing="xl">
        <SectionHeader>
          <SectionTitle>
            Industries We <span className="gradient-text">Serve</span>
          </SectionTitle>
          <SectionDescription>
            Deep expertise across multiple sectors
          </SectionDescription>
        </SectionHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            'Solar Energy',
            'Water Filtration',
            'Business Consulting',
            'E-commerce',
            'Field Services',
            'SaaS',
            'Healthcare',
            'Real Estate',
            'Professional Services',
            'Manufacturing',
          ].map((industry) => (
            <Card key={industry} variant="glass" className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="font-semibold">{industry}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="dark" spacing="lg">
        <Container size="md" className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Start Your Transformation?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Let&apos;s discuss how we can help you leverage AI and automation to grow
            your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg">
              <Link href="/contact">Book Strategy Call</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  )
}
