'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'
import { SiOpenai, SiAnthropic } from 'react-icons/si'
import { FiDatabase, FiCloud, FiBox } from 'react-icons/fi'

const technologies = [
  {
    name: 'Anthropic Claude',
    description: 'Advanced AI for content generation and intelligent automation',
    icon: SiAnthropic,
    gradient: 'from-accent-cyan to-accent-blue',
  },
  {
    name: 'GoHighLevel',
    description: 'All-in-one marketing automation and CRM platform',
    icon: FiBox,
    gradient: 'from-accent-blue to-accent-purple',
  },
  {
    name: 'OpenAI',
    description: 'Cutting-edge AI models for voice and text processing',
    icon: SiOpenai,
    gradient: 'from-accent-purple to-accent-pink',
  },
  {
    name: 'Custom Infrastructure',
    description: 'Scalable cloud solutions built for your specific needs',
    icon: FiCloud,
    gradient: 'from-accent-pink to-accent-cyan',
  },
]

export function TechStackSection() {
  return (
    <Section variant="dark" spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Powered by <span className="gradient-text">Cutting-Edge</span> Technology
        </SectionTitle>
        <SectionDescription>
          We leverage the latest AI and automation technologies to deliver exceptional results
        </SectionDescription>
      </SectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologies.map((tech, index) => {
          const Icon = tech.icon

          return (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glass" className="h-full text-center group">
                <motion.div
                  className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tech.gradient} p-[2px]`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <div className="w-full h-full bg-dark-950 rounded-2xl flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-lg font-bold font-display mb-2 group-hover:gradient-text transition-all">
                  {tech.name}
                </h3>
                <p className="text-sm text-dark-400">{tech.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Integration Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16 text-center"
      >
        <Card variant="gradient" className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl font-bold font-display mb-2">
                Seamless Integration
              </h3>
              <p className="text-dark-300">
                All tools work together perfectly to create a unified, powerful marketing ecosystem
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent-cyan rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse delay-100" />
              <div className="w-3 h-3 bg-accent-purple rounded-full animate-pulse delay-200" />
            </div>
          </div>
        </Card>
      </motion.div>
    </Section>
  )
}
