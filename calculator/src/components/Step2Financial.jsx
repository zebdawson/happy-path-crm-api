export default function Step2Financial({ data, updateData, onNext, onPrev }) {
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial Metrics</h2>
        <p className="text-gray-600">
          These numbers help us calculate your business valuation. Be as accurate as possible.
        </p>
      </div>

      <div className="space-y-8">
        {/* Annual Revenue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Revenue: <span className="text-2xl text-primary-600 font-bold">{formatCurrency(data.annualRevenue)}</span>
          </label>
          <input
            type="range"
            min="500000"
            max="50000000"
            step="100000"
            className="w-full"
            value={data.annualRevenue}
            onChange={(e) => updateData({ annualRevenue: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$500K</span>
            <span>$10M</span>
            <span>$25M</span>
            <span>$50M+</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Gross revenue for the last 12 months</p>
        </div>

        {/* EBITDA Margin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EBITDA / Profit Margin: <span className="text-xl text-primary-600 font-bold">{data.ebitdaMargin}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            className="w-full"
            value={data.ebitdaMargin}
            onChange={(e) => updateData({ ebitdaMargin: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
            <span>60%+</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Profit as a percentage of revenue (before owner's compensation)
          </p>
        </div>

        {/* Growth Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year-over-Year Growth Rate:{' '}
            <span className={`text-xl font-bold ${data.growthRate >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {data.growthRate > 0 ? '+' : ''}{data.growthRate}%
            </span>
          </label>
          <input
            type="range"
            min="-20"
            max="100"
            step="1"
            className="w-full"
            value={data.growthRate}
            onChange={(e) => updateData({ growthRate: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-20%</span>
            <span>0%</span>
            <span>50%</span>
            <span>100%+</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Revenue growth compared to last year</p>
        </div>

        {/* Customer Concentration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Concentration:{' '}
            <span className={`text-xl font-bold ${data.customerConcentration < 25 ? 'text-success-600' : 'text-warning-600'}`}>
              {data.customerConcentration}%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            className="w-full"
            value={data.customerConcentration}
            onChange={(e) => updateData({ customerConcentration: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            What percentage of revenue comes from your top 3 clients?
          </p>
          {data.customerConcentration >= 30 && (
            <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
              <p className="text-sm text-warning-800">
                ⚠️ High customer concentration increases risk and can reduce your valuation
              </p>
            </div>
          )}
        </div>

        {/* Recurring Revenue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recurring Revenue:{' '}
            <span className={`text-xl font-bold ${data.recurringRevenue >= 50 ? 'text-success-600' : 'text-gray-700'}`}>
              {data.recurringRevenue}%
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            className="w-full"
            value={data.recurringRevenue}
            onChange={(e) => updateData({ recurringRevenue: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Percentage of revenue that's predictable (retainers, subscriptions, contracts)
          </p>
          {data.recurringRevenue >= 70 && (
            <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-sm text-success-800">
                ✓ Strong recurring revenue significantly increases business value!
              </p>
            </div>
          )}
        </div>
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
          Continue to Systems
          <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
