import { useState } from 'react'

export default function Step1Profile({ data, updateData, onNext }) {
  const [errors, setErrors] = useState({})

  const industries = [
    'Marketing/Advertising',
    'IT/Technology Services',
    'Consulting',
    'Healthcare Services',
    'Professional Services',
    'Financial Services',
    'Real Estate Services',
    'Creative/Design',
    'Education/Training',
    'Other'
  ]

  const validate = () => {
    const newErrors = {}

    if (!data.name?.trim()) newErrors.name = 'Name is required'
    if (!data.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!data.phone?.trim()) newErrors.phone = 'Phone number is required'
    if (!data.industry) newErrors.industry = 'Please select an industry'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Let's Start With Your Profile</h2>
        <p className="text-gray-600">
          We'll use this information to personalize your report and send you the results.
        </p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="John Smith"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
          <input
            type="text"
            className="input-field"
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            placeholder="Acme Consulting LLC"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry/Niche <span className="text-red-500">*</span>
          </label>
          <select
            className={`input-field ${errors.industry ? 'border-red-500' : ''}`}
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
          >
            <option value="">Select an industry</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry}</p>}
        </div>

        {/* Years in Business */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years in Business: <span className="text-primary-600 font-semibold">{data.yearsInBusiness}</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            className="w-full"
            value={data.yearsInBusiness}
            onChange={(e) => updateData({ yearsInBusiness: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>New</span>
            <span>25 years</span>
            <span>50+ years</span>
          </div>
        </div>

        {/* Number of Employees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Employees: <span className="text-primary-600 font-semibold">{data.employeeCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max="500"
            step="1"
            className="w-full"
            value={data.employeeCount}
            onChange={(e) => updateData({ employeeCount: parseInt(e.target.value) })}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>250</span>
            <span>500+</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        <button onClick={handleNext} className="btn-primary">
          Continue to Financial Metrics
          <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
