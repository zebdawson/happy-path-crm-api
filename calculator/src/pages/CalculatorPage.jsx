import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Step1Profile from '../components/Step1Profile'
import Step2Financial from '../components/Step2Financial'
import Step3Systems from '../components/Step3Systems'
import Step4Market from '../components/Step4Market'
import ProgressBar from '../components/ProgressBar'

const TOTAL_STEPS = 4

export default function CalculatorPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Profile
    name: '',
    email: '',
    phone: '',
    businessName: '',
    industry: '',
    yearsInBusiness: 5,
    employeeCount: 5,

    // Step 2: Financial
    annualRevenue: 1000000,
    ebitdaMargin: 15,
    growthRate: 10,
    customerConcentration: 25,
    recurringRevenue: 30,

    // Step 3: Systems
    processDocumentation: 5,
    ownerDependency: 7,
    managementTeam: 5,
    customerAcquisition: 5,
    brandStrength: 5,
    techAssets: 5,

    // Step 4: Market
    competitiveAdvantage: 'Moderate',
    marketConditions: 'Stable',
    customerRetention: 75,
    contractTerms: 'Month-to-month'
  })

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Navigate to results page with data
      navigate('/results', { state: { formData } })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Profile data={formData} updateData={updateFormData} onNext={nextStep} />
      case 2:
        return <Step2Financial data={formData} updateData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <Step3Systems data={formData} updateData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      case 4:
        return <Step4Market data={formData} updateData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {TOTAL_STEPS}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Form Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust Indicators */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Your data is 100% confidential
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-success-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure & encrypted
          </div>
        </div>
      </div>
    </div>
  )
}
