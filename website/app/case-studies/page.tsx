import { Metadata } from 'next'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FiTrendingUp, FiDollarSign, FiClock, FiUsers, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Case Studies | Happy Path Marketing',
  description:
    "Real results from real clients. See how we've helped businesses save thousands and grow faster with AI-powered marketing automation.",
}

const caseStudies = [
  {
    id: 'sunpower-solutions',
    industry: 'Solar Energy',
    company: 'SunPower Solutions',
    logo: '/images/clients/sunpower.png',
    challenge:
      "SunPower was losing 40% of leads due to slow manual follow-up. Their sales team was overwhelmed with incoming calls and couldn\'t respond fast enough to capitalize on hot leads.",
    solution:
      'We implemented our AI voice assistant (Sage) to handle all incoming calls 24/7, integrated with GoHighLevel for seamless lead management and automated follow-up workflows.',
    implementation: [
      'AI voice assistant deployment',
      'GoHighLevel CRM setup',
      'Automated lead qualification',
      'SMS and email nurture sequences',
      'Sales team training',
    ],
    results: [
      { label: 'Lead Response Time', value: '< 5 minutes', icon: FiClock, change: '85% reduction' },
      { label: 'Conversion Rate', value: '62%', icon: FiTrendingUp, change: '+45% increase' },
      { label: 'Annual Savings', value: '$12,000', icon: FiDollarSign, change: 'saved on staff costs' },
      { label: 'Qualified Leads', value: '+180%', icon: FiUsers, change: 'more leads qualified' },
    ],
    testimonial: {
      quote:
        "Happy Path transformed our lead follow-up process. The AI voice assistant responds to inquiries within minutes, and our conversion rate jumped 45%. Best investment we\'ve made.",
      author: 'Sarah Johnson',
      role: 'CEO, SunPower Solutions',
    },
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    id: 'aquapure-systems',
    industry: 'Water Filtration',
    company: 'AquaPure Systems',
    logo: '/images/clients/aquapure.png',
    challenge:
      "AquaPure was spending over $10K annually on various SaaS tools (CRM, email marketing, automation) that didn\'t integrate well together, causing data silos and inefficiencies.",
    solution:
      "We built a custom all-in-one platform that replaced 5 separate SaaS subscriptions, with custom features tailored to their water filtration business.",
    implementation: [
      'Custom CRM development',
      'Email automation system',
      'Sales pipeline management',
      'Customer portal',
      'Reporting dashboard',
    ],
    results: [
      { label: 'Annual Software Savings', value: '$8,500', icon: FiDollarSign, change: '85% cost reduction' },
      { label: 'Pipeline Velocity', value: '3x faster', icon: FiTrendingUp, change: 'deal closure speed' },
      { label: 'Time Saved', value: '20 hrs/week', icon: FiClock, change: 'on manual tasks' },
      { label: 'Data Accuracy', value: '99%', icon: FiUsers, change: 'improved data quality' },
    ],
    testimonial: {
      quote:
        "We were spending over $10K annually on various SaaS tools. Happy Path built us a custom solution that does everything we need for a fraction of the cost. The team is incredible.",
      author: 'Michael Chen',
      role: 'Marketing Director',
    },
    gradient: 'from-accent-blue to-accent-purple',
  },
  {
    id: 'strategic-growth',
    industry: 'Business Consulting',
    company: 'Strategic Growth Partners',
    logo: '/images/clients/strategic.png',
    challenge:
      "Inconsistent content publishing and low organic reach. The consulting firm struggled to maintain a regular blog schedule and their website traffic had plateaued.",
    solution:
      "AI-powered content generation system paired with comprehensive SEO strategy to dominate search results in their niche.",
    implementation: [
      'Content strategy development',
      'AI content generation setup',
      'Technical SEO optimization',
      'Link building campaign',
      'Content calendar automation',
    ],
    results: [
      { label: 'Organic Traffic', value: '+285%', icon: FiTrendingUp, change: 'in 6 months' },
      { label: 'Content Output', value: '4x more', icon: FiClock, change: 'blog posts published' },
      { label: 'Cost per Lead', value: '-60%', icon: FiDollarSign, change: 'reduction' },
      { label: 'Domain Authority', value: '+23 points', icon: FiUsers, change: 'improvement' },
    ],
    testimonial: {
      quote:
        "The AI content generation has been a game-changer. We went from publishing 2 blog posts a month to 15, and our organic traffic increased by 285%. ROI is off the charts.",
      author: 'Emily Rodriguez',
      role: 'Founder',
    },
    gradient: 'from-accent-purple to-accent-pink',
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <Section spacing="lg">
        <SectionHeader>
          <SectionTitle>
            Real Results, <span className="gradient-text">Real Impact</span>
          </SectionTitle>
          <SectionDescription>
            See how we've helped businesses across industries transform their
            marketing, save thousands, and grow faster with AI automation.
          </SectionDescription>
        </SectionHeader>
      </Section>

      {/* Case Studies */}
      <Section spacing="xl">
        <div className="space-y-20">
          {caseStudies.map((study, index) => (
            <div key={study.id}>
              <Card variant="glass" className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${study.gradient}`} />

                <CardContent className="p-8 md:p-12">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="inline-block px-4 py-2 rounded-full glass text-sm mb-4">
                      {study.industry}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
                      {study.company}
                    </h2>
                  </div>

                  {/* Challenge */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-accent-cyan">
                      The Challenge
                    </h3>
                    <p className="text-lg text-dark-300">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-4 text-accent-blue">
                      Our Solution
                    </h3>
                    <p className="text-lg text-dark-300 mb-6">{study.solution}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {study.implementation.map((item) => (
                        <div
                          key={item}
                          className="glass rounded-lg p-3 text-sm text-center"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-6 text-accent-purple">
                      The Results
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {study.results.map((result) => {
                        const Icon = result.icon
                        return (
                          <div
                            key={result.label}
                            className="glass rounded-xl p-6 text-center hover-lift"
                          >
                            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br ${study.gradient} p-[2px]`}>
                              <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                                <Icon className="w-6 h-6" />
                              </div>
                            </div>
                            <div className="text-3xl font-bold gradient-text mb-2">
                              {result.value}
                            </div>
                            <div className="text-sm text-dark-400 mb-1">
                              {result.label}
                            </div>
                            <div className="text-xs text-dark-500">
                              {result.change}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="glass rounded-xl p-8">
                    <p className="text-lg text-dark-300 italic mb-6">
                      "{study.testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple p-[2px]">
                        <div className="w-full h-full bg-dark-950 rounded-full flex items-center justify-center">
                          <span className="text-2xl font-bold">
                            {study.testimonial.author.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          {study.testimonial.author}
                        </div>
                        <div className="text-dark-400">
                          {study.testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="gradient" spacing="lg">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Let's discuss how we can transform your marketing and drive real,
            measurable results for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg">
              <Link href="/contact">Book Strategy Call</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="/services">View Our Services</Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
