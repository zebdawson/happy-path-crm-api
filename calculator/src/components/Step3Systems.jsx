export default function Step3Systems({ data, updateData, onNext, onPrev }) {
  const getRatingColor = (value) => {
    if (value >= 8) return 'text-success-600'
    if (value >= 5) return 'text-primary-600'
    return 'text-warning-600'
  }

  const getRatingLabel = (value) => {
    if (value >= 9) return 'Excellent'
    if (value >= 7) return 'Good'
    if (value >= 5) return 'Fair'
    if (value >= 3) return 'Poor'
    return 'Very Poor'
  }

  const systemsQuestions = [
    {
      key: 'processDocumentation',
      label: 'Process Documentation & SOPs',
      description: 'How well-documented are your business processes?',
      lowLabel: 'Nothing documented',
      highLabel: 'Everything documented'
    },
    {
      key: 'ownerDependency',
      label: 'Owner Dependency',
      description: 'How much does the business depend on you personally?',
      lowLabel: 'Runs without me',
      highLabel: 'Cannot run without me',
      inverted: true
    },
    {
      key: 'managementTeam',
      label: 'Management Team Strength',
      description: 'How strong and capable is your leadership team?',
      lowLabel: 'No management',
      highLabel: 'Excellent team'
    },
    {
      key: 'customerAcquisition',
      label: 'Customer Acquisition System',
      description: 'How systematic and predictable is your sales/marketing?',
      lowLabel: 'Ad-hoc/reactive',
      highLabel: 'Fully systematic'
    },
    {
      key: 'brandStrength',
      label: 'Brand Strength & Reputation',
      description: 'How strong is your brand in the market?',
      lowLabel: 'Unknown',
      highLabel: 'Market leader'
    },
    {
      key: 'techAssets',
      label: 'Technology & IP Assets',
      description: 'Do you have proprietary systems, software, or IP?',
      lowLabel: 'None',
      highLabel: 'Significant assets'
    }
  ]

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Systems & Transferability</h2>
        <p className="text-gray-600">
          Rate each area on a scale of 1-10. Be honest - this helps identify opportunities to increase value.
        </p>
      </div>

      <div className="space-y-8">
        {systemsQuestions.map((question) => (
          <div key={question.key} className="pb-6 border-b border-gray-200 last:border-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  {question.label}
                </label>
                <p className="text-sm text-gray-600">{question.description}</p>
              </div>
              <div className="ml-4 text-right">
                <div className={`text-3xl font-bold ${getRatingColor(data[question.key])}`}>
                  {data[question.key]}
                </div>
                <div className="text-sm text-gray-500">{getRatingLabel(data[question.key])}</div>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              step="1"
              className="w-full"
              value={data[question.key]}
              onChange={(e) => updateData({ [question.key]: parseInt(e.target.value) })}
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1 - {question.lowLabel}</span>
              <span>5 - Average</span>
              <span>10 - {question.highLabel}</span>
            </div>

            {/* Contextual tips */}
            {question.key === 'ownerDependency' && data.ownerDependency >= 7 && (
              <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-sm text-danger-800">
                  ⚠️ High owner dependency can reduce valuation by 1-2x. Consider delegating and documenting
                  processes.
                </p>
              </div>
            )}

            {question.key === 'processDocumentation' && data.processDocumentation >= 8 && (
              <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                <p className="text-sm text-success-800">
                  ✓ Strong documentation makes your business much more attractive to buyers!
                </p>
              </div>
            )}

            {question.key === 'managementTeam' && data.managementTeam >= 8 && (
              <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                <p className="text-sm text-success-800">
                  ✓ A capable management team significantly increases transferability!
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
        <h3 className="font-semibold text-primary-900 mb-2">💡 Why This Matters</h3>
        <p className="text-sm text-primary-800">
          Buyers pay premium prices for businesses that can run without the owner and have strong systems in
          place. These factors often matter more than financials when determining final valuation.
        </p>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button onClick={onPrev} className="btn-secondary">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Continue to Market Position
          <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
