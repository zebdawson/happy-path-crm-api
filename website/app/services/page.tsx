import { Metadata } from 'next'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import {
  FiCpu,
  FiZap,
  FiCode,
  FiMic,
  FiTrendingUp,
  FiTarget,
  FiCheck,
  FiArrowRight,
} from 'react-icons/fi'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services | Happy Path Marketing',
  description:
    'Comprehensive AI-powered marketing services including automation, custom software, AI voice assistants, SEO, and paid advertising.',
}

const services = [
  {
    icon: FiCpu,
    title: 'AI-Powered Content Generation',
    description:
      'Transform your content strategy with AI that understands your brand voice and creates engaging, SEO-optimized content at scale.',
    features: [
      'Blog posts and long-form articles',
      'Social media content calendars',
      'Email marketing campaigns',
      'Product descriptions and landing pages',
      'SEO-optimized copy',
      'Brand-consistent messaging',
    ],
    benefits: [
      'Save 20+ hours per week on content creation',
      'Increase content output by 400%',
      'Maintain consistent brand voice',
      'Improve SEO rankings',
    ],
    pricing: 'Starting at $1,500/month',
  },
  {
    icon: FiZap,
    title: 'GoHighLevel Integration & Management',
    description:
      'Complete setup, customization, and ongoing management of your GoHighLevel platform for maximum ROI.',
    features: [
      'CRM configuration and customization',
      'Advanced automation workflows',
      'Sales funnel design and optimization',
      'Email & SMS campaign management',
      'Pipeline and deal stage optimization',
      'Reporting and analytics setup',
    ],
    benefits: [
      'Streamline your entire sales process',
      'Automate repetitive tasks',
      'Never miss a follow-up',
      'Track performance in real-time',
    ],
    pricing: 'Starting at $2,000/month',
  },
  {
    icon: FiCode,
    title: 'Custom Software Development',
    description:
      'Replace expensive SaaS subscriptions with custom-built solutions tailored exactly to your business needs.',
    features: [
      'Custom web applications',
      'API integrations',
      'Automation tools and scripts',
      'Database solutions',
      'Custom reporting dashboards',
      'Legacy system modernization',
    ],
    benefits: [
      'Save $8K+ annually on SaaS costs',
      'Get exactly what you need',
      'Own your technology',
      'Scale without limits',
    ],
    pricing: 'Custom pricing based on scope',
  },
  {
    icon: FiMic,
    title: '24/7 AI Voice Assistants (Sage)',
    description:
      'Never miss a lead with our intelligent AI voice assistant that handles calls, qualifies leads, and schedules appointments.',
    features: [
      'Intelligent lead qualification',
      'Automated appointment scheduling',
      'Customer support and FAQs',
      'Follow-up call campaigns',
      'Natural conversation flow',
      'CRM integration',
    ],
    benefits: [
      'Respond to leads in under 5 minutes',
      'Increase conversion rates by 45%+',
      'Handle unlimited concurrent calls',
      'Work 24/7 without breaks',
    ],
    pricing: 'Starting at $3,000/month',
  },
  {
    icon: FiTrendingUp,
    title: 'SEO & Content Marketing',
    description:
      'Dominate search results with our data-driven SEO strategies and high-quality content marketing.',
    features: [
      'Technical SEO audits and fixes',
      'Keyword research and strategy',
      'Content strategy and planning',
      'Link building campaigns',
      'On-page optimization',
      'Performance tracking and reporting',
    ],
    benefits: [
      'Increase organic traffic by 200%+',
      'Rank for high-intent keywords',
      'Build domain authority',
      'Generate qualified leads',
    ],
    pricing: 'Starting at $2,500/month',
  },
  {
    icon: FiTarget,
    title: 'Paid Advertising Management',
    description:
      'Maximize your advertising ROI with expertly managed campaigns across Google, Facebook, LinkedIn, and more.',
    features: [
      'Campaign strategy and planning',
      'Ad creative design and testing',
      'Audience targeting and segmentation',
      'A/B testing and optimization',
      'Conversion tracking setup',
      'Real-time performance reporting',
    ],
    benefits: [
      'Reduce cost per acquisition by 60%',
      'Triple your ROAS',
      'Scale winning campaigns',
      'Full transparency and control',
    ],
    pricing: 'Starting at $2,000/month + ad spend',
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <Section spacing="lg">
        <Container size="md" className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
            Comprehensive <span className="gradient-text">AI-Powered</span>{' '}
            Marketing Services
          </h1>
          <p className="text-xl md:text-2xl text-dark-300 mb-8">
            Everything you need to scale your marketing, automate operations, and
            grow your business faster.
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link href="/contact">Get Started Today</Link>
          </Button>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section spacing="xl">
        <div className="space-y-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card key={service.title} variant="glass" id={service.title.toLowerCase().replace(/\s+/g, '-')}>
                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Left Column */}
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-purple p-[2px]">
                          <div className="w-full h-full bg-dark-950 rounded-2xl flex items-center justify-center">
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold font-display">
                            {service.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-dark-300 mb-6 text-lg">
                        {service.description}
                      </p>

                      <div className="mb-6">
                        <h3 className="text-xl font-bold mb-4">Features:</h3>
                        <ul className="space-y-3">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-3"
                            >
                              <FiCheck className="w-5 h-5 text-accent-cyan flex-shrink-0 mt-0.5" />
                              <span className="text-dark-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="glass rounded-xl p-4 inline-block">
                        <div className="text-sm text-dark-400 mb-1">
                          Pricing
                        </div>
                        <div className="text-xl font-bold gradient-text">
                          {service.pricing}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Key Benefits:</h3>
                      <div className="space-y-4 mb-8">
                        {service.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="glass rounded-xl p-4 hover-lift"
                          >
                            <p className="text-dark-300">{benefit}</p>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="gradient"
                        size="lg"
                        className="w-full"
                        rightIcon={<FiArrowRight />}
                        asChild
                      >
                        <Link href="/contact">Get Started</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="gradient" spacing="lg">
        <Container size="md" className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Let's discuss how our services can help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/contact">Book Strategy Call</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </div>
  )
}
