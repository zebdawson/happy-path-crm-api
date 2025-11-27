'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader, SectionTitle, SectionDescription } from '@/components/ui/Section'
import { FiSearch, FiTool, FiSend, FiBarChart } from 'react-icons/fi'

const steps = [
  {
    number: '01',
    title: 'Discovery & Analysis',
    description: 'We dive deep into your business, analyzing current processes, pain points, and opportunities for automation.',
    icon: FiSearch,
    items: ['Business audit', 'Competitor analysis', 'Goal setting', 'ROI projections'],
  },
  {
    number: '02',
    title: 'Strategy & Design',
    description: 'Custom strategy tailored to your goals, with detailed implementation roadmap and timeline.',
    icon: FiTool,
    items: ['Custom strategy', 'Technology selection', 'Workflow design', 'Content planning'],
  },
  {
    number: '03',
    title: 'Implementation',
    description: 'Seamless execution with minimal disruption to your operations. We handle everything.',
    icon: FiSend,
    items: ['System setup', 'Integration', 'Content creation', 'Team training'],
  },
  {
    number: '04',
    title: 'Optimization & Growth',
    description: 'Continuous monitoring, testing, and optimization to maximize your results.',
    icon: FiBarChart,
    items: ['Performance tracking', 'A/B testing', 'Ongoing optimization', 'Monthly reporting'],
  },
]

export function ProcessSection() {
  return (
    <Section variant="gradient" spacing="xl">
      <SectionHeader>
        <SectionTitle>
          Our Proven <span className="gradient-text">Process</span>
        </SectionTitle>
        <SectionDescription>
          A systematic approach that delivers results every time
        </SectionDescription>
      </SectionHeader>

      <div className="relative">
        {/* Timeline Line */}
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-accent-cyan via-accent-blue to-accent-purple opacity-30" />

        <div className="space-y-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isEven = index % 2 === 0

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  isEven ? '' : 'lg:grid-flow-dense'
                }`}
              >
                {/* Content */}
                <div className={isEven ? 'lg:text-right' : 'lg:col-start-2'}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="inline-block px-4 py-2 rounded-full glass mb-4"
                  >
                    <span className="text-sm font-mono gradient-text">
                      Step {step.number}
                    </span>
                  </motion.div>

                  <h3 className="text-3xl font-bold font-display mb-4">
                    {step.title}
                  </h3>

                  <p className="text-dark-300 mb-6 max-w-md">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.items.map((item) => (
                      <li
                        key={item}
                        className={`flex items-center gap-2 ${
                          isEven ? 'lg:justify-end' : ''
                        }`}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                        <span className="text-dark-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Icon */}
                <div
                  className={`flex justify-center ${
                    isEven ? 'lg:col-start-2' : 'lg:col-start-1'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple opacity-30 blur-2xl" />
                    <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-purple p-[2px]">
                      <div className="w-full h-full bg-dark-950 rounded-3xl flex items-center justify-center">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
