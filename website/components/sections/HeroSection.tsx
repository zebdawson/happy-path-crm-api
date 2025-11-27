'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FiArrowRight, FiPlay, FiZap, FiTrendingUp, FiCpu } from 'react-icons/fi'
import Link from 'next/link'

const stats = [
  { label: 'Clients Served', value: '250+' },
  { label: 'Annual Savings', value: '$8K+' },
  { label: 'Avg. Conversion Increase', value: '45%' },
  { label: 'Hours Automated', value: '10K+' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/20 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full filter blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-cyan/30 mb-8"
          >
            <FiZap className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm font-medium">
              AI-Powered Marketing Automation
            </span>
            <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display mb-6 leading-tight"
          >
            Transform Your Marketing{' '}
            <span className="gradient-text">with AI</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-dark-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Scale your business with intelligent automation, custom software solutions,
            and cutting-edge AI technology. Save $8K+ annually while growing faster.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              variant="gradient"
              size="xl"
              rightIcon={<FiArrowRight className="w-5 h-5" />}
              asChild
            >
              <Link href="/contact">Book Strategy Call</Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              leftIcon={<FiPlay className="w-5 h-5" />}
              asChild
            >
              <Link href="#demo">Watch Demo</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-6 hover-lift"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-dark-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Floating Icons */}
        <motion.div
          className="absolute top-20 left-10 hidden lg:block"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="glass rounded-2xl p-4">
            <FiCpu className="w-8 h-8 text-accent-cyan" />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 hidden lg:block"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="glass rounded-2xl p-4">
            <FiTrendingUp className="w-8 h-8 text-accent-purple" />
          </div>
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
