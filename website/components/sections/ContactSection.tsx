'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FiMail, FiPhone, FiCalendar, FiMessageCircle, FiSend } from 'react-icons/fi'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Handle form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    // Reset form or show success message
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <Section id="contact" variant="gradient" spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Let's <span className="gradient-text">Transform</span> Your Marketing
        </SectionTitle>
        <SectionDescription>
          Choose your preferred way to connect with us
        </SectionDescription>
      </SectionHeader>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Methods */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card variant="glass" className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue p-[2px]">
                    <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                      <FiCalendar className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      Book a Strategy Call
                    </h3>
                    <p className="text-sm text-dark-400">
                      30-minute consultation to discuss your goals
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass" className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple p-[2px]">
                    <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                      <FiMail className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">Email Us</h3>
                    <a
                      href="mailto:hello@happypathmarketing.com"
                      className="text-sm text-accent-cyan hover:text-accent-blue transition-colors"
                    >
                      hello@happypathmarketing.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="glass" className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink p-[2px]">
                    <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                      <FiPhone className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">Call Us</h3>
                    <a
                      href="tel:+1234567890"
                      className="text-sm text-accent-cyan hover:text-accent-blue transition-colors"
                    >
                      (123) 456-7890
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-pink to-accent-cyan p-[2px]">
                    <div className="w-full h-full bg-dark-950 rounded-xl flex items-center justify-center">
                      <FiMessageCircle className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">
                      Chat with Sage
                    </h3>
                    <p className="text-sm text-dark-400">
                      Try our AI assistant for instant answers
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Card variant="glass">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold font-display mb-6">
                Send us a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-dark-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-dark-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 focus:outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium mb-2"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-dark-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-dark-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 focus:outline-none transition-colors"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-dark-900/50 border border-dark-800 focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/50 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  rightIcon={<FiSend />}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  )
}
