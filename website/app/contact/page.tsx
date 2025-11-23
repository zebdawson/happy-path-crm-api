import { Metadata } from 'next'
import { ContactSection } from '@/components/sections/ContactSection'
import { Section } from '@/components/ui/Section'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Contact Us | Happy Path Marketing',
  description:
    'Get in touch with Happy Path Marketing. Book a strategy call, send us a message, or chat with our AI assistant.',
}

export default function ContactPage() {
  return (
    <div className="pt-20">
      <Section spacing="lg">
        <Container size="md" className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display mb-6">
            Let's <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-xl md:text-2xl text-dark-300">
            Ready to transform your marketing with AI? We'd love to hear from you.
          </p>
        </Container>
      </Section>

      <ContactSection />
    </div>
  )
}
