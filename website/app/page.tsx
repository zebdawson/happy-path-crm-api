import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TechStackSection } from '@/components/sections/TechStackSection'
import { CaseStudiesSection } from '@/components/sections/CaseStudiesSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ContactSection } from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TechStackSection />
      <CaseStudiesSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
