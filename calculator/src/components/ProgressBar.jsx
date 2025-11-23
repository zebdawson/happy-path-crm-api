export default function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100

  const steps = [
    { number: 1, label: 'Profile' },
    { number: 2, label: 'Financial' },
    { number: 3, label: 'Systems' },
    { number: 4, label: 'Market' }
  ]

  return (
    <div>
      {/* Desktop progress bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step.number
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div
                  className={`mt-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-4 mt-[-20px]">
                  <div className="h-full bg-gray-200 rounded">
                    <div
                      className="h-full bg-primary-600 rounded transition-all duration-500 progress-bar-fill"
                      style={{ width: currentStep > step.number ? '100%' : '0%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2 text-sm font-medium text-gray-600">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 rounded-full transition-all duration-500 progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
