import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import {
  calculateValuation,
  calculateReadinessScore,
  identifyStrengthsAndGaps,
  generateRecommendations,
  formatCurrency,
  getScoreRating
} from '../utils/calculations'
import { generatePDFReport, downloadPDF } from '../utils/pdfGenerator'
import { submitLead, submitAssessment, sendResultsEmail, triggerCRMWebhook } from '../utils/api'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    if (!location.state?.formData) {
      navigate('/')
      return
    }

    const data = location.state.formData
    setFormData(data)

    // Calculate results
    setTimeout(() => {
      const valuation = calculateValuation(data)
      const readinessScore = calculateReadinessScore(data)
      const { strengths, gaps } = identifyStrengthsAndGaps(data, readinessScore)
      const recommendations = generateRecommendations(gaps, data)

      setResults({
        valuation,
        readinessScore,
        strengths,
        gaps,
        recommendations
      })

      setIsLoading(false)

      // Submit to backend
      submitLeadData(data, readinessScore)
    }, 1000)
  }, [location, navigate])

  const submitLeadData = async (data, readinessScore) => {
    try {
      // Submit lead to CRM
      await submitLead({
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        industry: data.industry
      })

      // Submit assessment data
      await submitAssessment({
        ...data,
        score: readinessScore.totalScore
      })

      // Trigger CRM webhook with tagging
      const scoreRating = getScoreRating(readinessScore.totalScore)
      await triggerCRMWebhook({
        name: data.name,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName,
        score: readinessScore.totalScore,
        tag: scoreRating.tag,
        source: 'Exit Readiness Calculator'
      })
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }

  const handleDownloadPDF = () => {
    if (!results || !formData) return

    const pdf = generatePDFReport(formData, results)
    downloadPDF(pdf, `exit-readiness-report-${formData.businessName || 'business'}.pdf`)

    // Track download event
    console.log('PDF downloaded')
  }

  const handleBookConsultation = () => {
    // This would link to a calendar booking system
    window.open('https://calendly.com/your-calendar', '_blank')
  }

  if (isLoading || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4" style={{ width: '60px', height: '60px' }}></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Calculating Your Results...</h2>
          <p className="text-gray-600">Analyzing your business across 20+ factors</p>
        </div>
      </div>
    )
  }

  const scoreRating = getScoreRating(results.readinessScore.totalScore)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Exit Readiness Report
          </h1>
          <p className="text-xl text-gray-600">
            {formData.businessName && <span className="font-semibold">{formData.businessName}</span>}
            {formData.businessName && ' • '}
            Prepared for {formData.name}
          </p>
        </motion.div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card mb-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Exit Readiness Score</h2>
              <div className="flex items-end gap-4 mb-4">
                <div className="text-7xl font-bold">{results.readinessScore.totalScore}</div>
                <div className="text-3xl pb-2 opacity-75">/ 100</div>
              </div>
              <div className="text-xl mb-6">{scoreRating.text}</div>
              <div className="flex gap-3">
                <button onClick={handleDownloadPDF} className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Full Report
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Estimated Valuation Range</h3>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">
                  {formatCurrency(results.valuation.minValuation)} -{' '}
                  {formatCurrency(results.valuation.maxValuation)}
                </div>
                <div className="text-sm opacity-90">
                  Based on {results.valuation.minMultiplier.toFixed(1)}x -{' '}
                  {results.valuation.maxMultiplier.toFixed(1)}x revenue multiple
                </div>
              </div>
              <p className="text-xs mt-3 opacity-75">
                *This is an estimated range for informational purposes only. Actual valuation may vary.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          <div className="card">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Score Breakdown</h3>
            <div className="space-y-4">
              {[
                {
                  category: 'Financial Health',
                  score: results.readinessScore.categoryScores.financial,
                  weight: '30%'
                },
                {
                  category: 'Transferability',
                  score: results.readinessScore.categoryScores.transferability,
                  weight: '30%'
                },
                {
                  category: 'Market Position',
                  score: results.readinessScore.categoryScores.market,
                  weight: '20%'
                },
                {
                  category: 'Risk Management',
                  score: results.readinessScore.categoryScores.risk,
                  weight: '20%'
                }
              ].map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      {item.category} <span className="text-gray-500 text-sm">({item.weight})</span>
                    </span>
                    <span className="font-bold text-primary-600">{item.score}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        item.score >= 75
                          ? 'bg-success-500'
                          : item.score >= 50
                          ? 'bg-primary-500'
                          : item.score >= 30
                          ? 'bg-warning-500'
                          : 'bg-danger-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Financial',
                      value: results.readinessScore.categoryScores.financial
                    },
                    {
                      name: 'Transferability',
                      value: results.readinessScore.categoryScores.transferability
                    },
                    {
                      name: 'Market',
                      value: results.readinessScore.categoryScores.market
                    },
                    {
                      name: 'Risk',
                      value: results.readinessScore.categoryScores.risk
                    }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#8b5cf6" />
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-7 h-7 text-success-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Your Top Strengths
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {results.strengths.map((strength, index) => (
              <div key={index} className="p-4 bg-success-50 border-2 border-success-200 rounded-lg">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">✓</span>
                  <div>
                    <h4 className="font-bold text-success-800 mb-1">{strength.title}</h4>
                    <p className="text-sm text-success-700">{strength.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {results.strengths.length === 0 && (
            <p className="text-gray-600">
              Continue building your business to develop clear competitive strengths.
            </p>
          )}
        </motion.div>

        {/* Value Gaps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mb-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-7 h-7 text-danger-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Critical Value Gaps
          </h3>
          <div className="space-y-4">
            {results.gaps.map((gap, index) => (
              <div key={index} className="p-5 bg-danger-50 border-2 border-danger-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-danger-800 text-lg flex items-center">
                    <span className="bg-danger-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    {gap.title}
                  </h4>
                  <span className={`badge-red text-xs`}>{gap.priority?.toUpperCase()}</span>
                </div>
                <p className="text-danger-700 mb-3 ml-9">{gap.description}</p>
                <div className="ml-9 p-3 bg-white rounded border border-danger-200">
                  <p className="text-sm font-semibold text-gray-800">💰 Potential Value Impact:</p>
                  <p className="text-sm text-gray-700 mt-1">{gap.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        {results.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended Action Plan</h3>
            <div className="space-y-6">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-primary-500 pl-6 py-2">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">{rec.area}</h4>
                  <ul className="space-y-2 mb-3">
                    {rec.actions.map((action, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <svg
                          className="w-5 h-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {action}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">
                      <strong>Timeline:</strong> {rec.timeline}
                    </span>
                    <span className="text-primary-600 font-medium">{rec.valueImpact}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Maximize Your Exit Value?</h2>
          <p className="text-xl mb-6 opacity-90">
            Schedule a free 30-minute consultation to discuss your personalized exit strategy
          </p>
          <button
            onClick={handleBookConsultation}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all shadow-xl inline-flex items-center"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book Your Free Consultation
          </button>
          <p className="text-sm mt-4 opacity-75">No obligation • Expert guidance • Proven strategies</p>
        </motion.div>

        {/* Share / Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={handleDownloadPDF} className="btn-primary">
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF Report
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  )
}
