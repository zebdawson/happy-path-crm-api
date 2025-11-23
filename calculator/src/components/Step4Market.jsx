import { useState } from 'react'

export default function Step4Market({ data, updateData, onNext, onPrev }) {
  const [isCalculating, setIsCalculating] = useState(false)

  const handleSubmit = () => {
    setIsCalculating(true)
    // Simulate calculation delay for better UX
    setTimeout(() => {
      onNext()
    }, 1500)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Market Position</h2>
        <p className="text-gray-600">
          Final section! These questions help us understand your competitive position.
        </p>
      </div>

      <div className="space-y-8">
        {/* Competitive Advantage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Competitive Advantage
          </label>
          <p className="text-sm text-gray-600 mb-4">
            How differentiated is your business from competitors?
          </p>
          <div className="space-y-2">
            {[
              {
                value: 'Strong',
                label: 'Strong - Clear differentiation, unique value proposition',
                description: 'We have proprietary methods, strong brand, or unique positioning'
              },
              {
                value: 'Moderate',
                label: 'Moderate - Some differentiation',
                description: 'We stand out in some ways but face direct competition'
              },
              {
                value: 'Weak',
                label: 'Weak - Minimal differentiation',
                description: 'We compete mainly on price or relationships'
              },
              {
                value: 'None',
                label: 'None - Commodity service',
                description: 'We offer the same as everyone else'
              }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  data.competitiveAdvantage === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="competitiveAdvantage"
                  value={option.value}
                  checked={data.competitiveAdvantage === option.value}
                  onChange={(e) => updateData({ competitiveAdvantage: e.target.value })}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Market Conditions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Market Conditions
          </label>
          <p className="text-sm text-gray-600 mb-4">
            How is your overall market performing?
          </p>
          <div className="space-y-2">
            {[
              {
                value: 'Growing',
                label: 'Growing - Market is expanding',
                icon: '📈'
              },
              {
                value: 'Stable',
                label: 'Stable - Market is flat',
                icon: '➡️'
              },
              {
                value: 'Declining',
                label: 'Declining - Market is shrinking',
                icon: '📉'
              }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  data.marketConditions === option.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="marketConditions"
                  value={option.value}
                  checked={data.marketConditions === option.value}
                  onChange={(e) => updateData({ marketConditions: e.target.value })}
                  className="mr-3"
                />
                <span className="text-2xl mr-3">{option.icon}</span>
                <span className="font-medium text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Customer Retention */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Retention Rate:{' '}
            <span className={`text-xl font-bold ${data.customerRetention >= 80 ? 'text-success-600' : 'text-gray-700'}`}>
              {data.customerRetention}%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="w-full"
            value={data.customerRetention}
            onChange={(e) => updateData({ customerRetention: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            What percentage of customers stay with you year-over-year?
          </p>
          {data.customerRetention >= 85 && (
            <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-sm text-success-800">
                ✓ Excellent retention! This shows strong customer satisfaction and reduces acquisition costs.
              </p>
            </div>
          )}
        </div>

        {/* Contract Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Typical Contract Terms
          </label>
          <p className="text-sm text-gray-600 mb-4">
            What's the most common contract length with your clients?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'Multi-year contracts', label: 'Multi-year' },
              { value: 'Annual contracts', label: 'Annual' },
              { value: 'Quarterly', label: 'Quarterly' },
              { value: 'Month-to-month', label: 'Monthly' }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  data.contractTerms === option.value
                    ? 'border-primary-500 bg-primary-50 font-semibold'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <input
                  type="radio"
                  name="contractTerms"
                  value={option.value}
                  checked={data.contractTerms === option.value}
                  onChange={(e) => updateData({ contractTerms: e.target.value })}
                  className="sr-only"
                />
                <span className="text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Longer contract terms provide more predictable revenue and increase business value
          </p>
        </div>
      </div>

      {/* Ready to see results */}
      <div className="mt-8 p-6 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl text-white">
        <h3 className="text-xl font-bold mb-2">You're Almost Done!</h3>
        <p className="mb-4">
          Click below to calculate your Exit Readiness Score and estimated business valuation.
        </p>
        <div className="flex items-center text-sm opacity-90">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Your results will be ready instantly
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button onClick={onPrev} className="btn-secondary" disabled={isCalculating}>
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isCalculating}
          className="btn-primary text-lg px-8 py-4 shadow-xl"
        >
          {isCalculating ? (
            <>
              <div className="spinner inline-block mr-3" style={{ width: '20px', height: '20px' }}></div>
              Calculating...
            </>
          ) : (
            <>
              See My Results
              <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
