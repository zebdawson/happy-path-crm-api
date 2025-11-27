import { Metadata } from 'next'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi'

export const metadata: Metadata = {
  title: 'Blog | Happy Path Marketing',
  description:
    'Insights on AI-powered marketing, automation strategies, and business growth tactics.',
}

const blogPosts = [
  {
    title: 'How AI-Powered Content Generation Can Save Your Business 20+ Hours Per Week',
    slug: 'ai-content-generation-saves-time',
    excerpt:
      'Discover how businesses are using AI to create high-quality, SEO-optimized content at scale while maintaining their unique brand voice.',
    category: 'AI Marketing',
    date: '2024-01-15',
    readTime: '8 min read',
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    title: 'The Complete Guide to GoHighLevel Automation Workflows',
    slug: 'gohighlevel-automation-guide',
    excerpt:
      'Learn how to set up advanced automation workflows in GoHighLevel that nurture leads, close deals, and save hours of manual work.',
    category: 'Automation',
    date: '2024-01-10',
    readTime: '12 min read',
    gradient: 'from-accent-blue to-accent-purple',
  },
  {
    title: 'Replace Expensive SaaS: Build Custom Software That Actually Fits Your Business',
    slug: 'custom-software-vs-saas',
    excerpt:
      'Why more businesses are ditching expensive SaaS subscriptions for custom-built solutions. Real cost comparisons and ROI analysis.',
    category: 'Custom Development',
    date: '2024-01-05',
    readTime: '10 min read',
    gradient: 'from-accent-purple to-accent-pink',
  },
  {
    title: 'AI Voice Assistants: The Secret Weapon for Lead Conversion',
    slug: 'ai-voice-assistants-lead-conversion',
    excerpt:
      'How 24/7 AI voice assistants are helping businesses respond to leads in under 5 minutes and increase conversion rates by 45%.',
    category: 'AI Technology',
    date: '2023-12-28',
    readTime: '7 min read',
    gradient: 'from-accent-pink to-accent-cyan',
  },
  {
    title: '7 SEO Mistakes That Are Killing Your Organic Traffic',
    slug: 'seo-mistakes-killing-traffic',
    excerpt:
      'Common SEO pitfalls we see in every audit, and how to fix them to start ranking higher and driving more qualified organic traffic.',
    category: 'SEO',
    date: '2023-12-20',
    readTime: '9 min read',
    gradient: 'from-accent-cyan to-accent-purple',
  },
  {
    title: 'Paid Ads ROI: How to Reduce CPA by 60% Without Cutting Budget',
    slug: 'reduce-paid-ads-cpa',
    excerpt:
      'Data-driven strategies for optimizing your paid advertising campaigns across Google, Facebook, and LinkedIn to maximize ROI.',
    category: 'Paid Advertising',
    date: '2023-12-15',
    readTime: '11 min read',
    gradient: 'from-accent-blue to-accent-pink',
  },
]

export default function BlogPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <Section spacing="lg">
        <SectionHeader>
          <SectionTitle>
            Marketing Insights & <span className="gradient-text">AI Strategies</span>
          </SectionTitle>
          <SectionDescription>
            Expert advice on leveraging AI, automation, and modern marketing tactics to grow your business
          </SectionDescription>
        </SectionHeader>
      </Section>

      {/* Blog Posts Grid */}
      <Section spacing="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card
              key={post.slug}
              variant="glass"
              className="h-full flex flex-col hover-lift cursor-pointer"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Category Badge */}
                <div className="mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${post.gradient} bg-clip-text text-transparent`}
                  >
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold font-display mb-3 line-clamp-2 hover:gradient-text transition-all">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-dark-400 mb-4 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-dark-500 mb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Read More */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-2 text-accent-cyan hover:text-accent-blue transition-colors font-medium"
                >
                  Read More
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section variant="gradient" spacing="lg">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-display mb-4">
            Get Marketing Insights Delivered
          </h2>
          <p className="text-dark-300 mb-8">
            Subscribe to our newsletter for weekly tips on AI marketing, automation, and growth strategies.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl bg-dark-900/50 border border-dark-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 focus:outline-none transition-colors"
              required
            />
            <Button variant="gradient" size="lg" type="submit">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-dark-500 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </Section>
    </div>
  )
}
