/**
 * Business Exit Readiness & Valuation Calculator
 * Core calculation logic
 */

// Industry multipliers for service-based businesses
const INDUSTRY_MULTIPLIERS = {
  'Marketing/Advertising': { min: 2.5, max: 5.0 },
  'IT/Technology Services': { min: 3.0, max: 6.0 },
  'Consulting': { min: 2.0, max: 4.5 },
  'Healthcare Services': { min: 3.5, max: 6.0 },
  'Professional Services': { min: 2.5, max: 5.0 },
  'Financial Services': { min: 3.0, max: 5.5 },
  'Real Estate Services': { min: 2.0, max: 4.0 },
  'Creative/Design': { min: 2.0, max: 4.5 },
  'Education/Training': { min: 2.5, max: 5.0 },
  'Other': { min: 2.0, max: 4.0 }
}

/**
 * Calculate business valuation range
 */
export function calculateValuation(data) {
  const {
    annualRevenue,
    ebitdaMargin,
    growthRate,
    recurringRevenue,
    customerConcentration,
    industry,
    // Systems scores
    processDocumentation,
    ownerDependency,
    managementTeam,
    customerAcquisition,
    brandStrength,
    techAssets,
    // Market position
    competitiveAdvantage,
    marketConditions,
    customerRetention,
    contractTerms
  } = data

  // Get base multiplier for industry
  const industryMultiplier = INDUSTRY_MULTIPLIERS[industry] || INDUSTRY_MULTIPLIERS['Other']
  let minMultiplier = industryMultiplier.min
  let maxMultiplier = industryMultiplier.max

  // Adjustments based on financial health

  // EBITDA margin adjustment (higher margins = higher multiple)
  if (ebitdaMargin >= 30) {
    minMultiplier += 0.5
    maxMultiplier += 0.75
  } else if (ebitdaMargin >= 20) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  } else if (ebitdaMargin < 10) {
    minMultiplier -= 0.5
    maxMultiplier -= 0.25
  }

  // Growth rate adjustment
  if (growthRate >= 30) {
    minMultiplier += 1.0
    maxMultiplier += 1.5
  } else if (growthRate >= 20) {
    minMultiplier += 0.5
    maxMultiplier += 1.0
  } else if (growthRate >= 10) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  } else if (growthRate < 0) {
    minMultiplier -= 0.75
    maxMultiplier -= 0.5
  }

  // Recurring revenue adjustment
  if (recurringRevenue >= 70) {
    minMultiplier += 0.75
    maxMultiplier += 1.0
  } else if (recurringRevenue >= 50) {
    minMultiplier += 0.5
    maxMultiplier += 0.75
  } else if (recurringRevenue >= 30) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  }

  // Customer concentration risk
  if (customerConcentration >= 40) {
    minMultiplier -= 1.0
    maxMultiplier -= 0.5
  } else if (customerConcentration >= 30) {
    minMultiplier -= 0.5
    maxMultiplier -= 0.25
  } else if (customerConcentration < 15) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  }

  // Owner dependency (inverted - higher score means less dependent)
  const ownerIndependence = 10 - ownerDependency
  if (ownerIndependence >= 7) {
    minMultiplier += 0.5
    maxMultiplier += 0.75
  } else if (ownerIndependence >= 5) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  } else if (ownerIndependence < 3) {
    minMultiplier -= 1.0
    maxMultiplier -= 0.75
  }

  // Process documentation
  if (processDocumentation >= 8) {
    minMultiplier += 0.4
    maxMultiplier += 0.5
  } else if (processDocumentation >= 6) {
    minMultiplier += 0.2
    maxMultiplier += 0.3
  }

  // Management team strength
  if (managementTeam >= 8) {
    minMultiplier += 0.5
    maxMultiplier += 0.75
  } else if (managementTeam >= 6) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  }

  // Customer acquisition system
  if (customerAcquisition >= 8) {
    minMultiplier += 0.3
    maxMultiplier += 0.5
  }

  // Brand strength
  if (brandStrength >= 8) {
    minMultiplier += 0.3
    maxMultiplier += 0.5
  }

  // Technology/IP assets
  if (techAssets >= 8) {
    minMultiplier += 0.4
    maxMultiplier += 0.6
  }

  // Competitive advantage
  const competitiveMultipliers = {
    'Strong': { min: 0.75, max: 1.0 },
    'Moderate': { min: 0.25, max: 0.5 },
    'Weak': { min: 0, max: 0.25 },
    'None': { min: -0.5, max: 0 }
  }
  const compAdj = competitiveMultipliers[competitiveAdvantage] || { min: 0, max: 0 }
  minMultiplier += compAdj.min
  maxMultiplier += compAdj.max

  // Market conditions
  const marketMultipliers = {
    'Growing': { min: 0.5, max: 0.75 },
    'Stable': { min: 0, max: 0.25 },
    'Declining': { min: -0.75, max: -0.5 }
  }
  const marketAdj = marketMultipliers[marketConditions] || { min: 0, max: 0 }
  minMultiplier += marketAdj.min
  maxMultiplier += marketAdj.max

  // Customer retention
  if (customerRetention >= 90) {
    minMultiplier += 0.5
    maxMultiplier += 0.75
  } else if (customerRetention >= 80) {
    minMultiplier += 0.25
    maxMultiplier += 0.5
  } else if (customerRetention < 60) {
    minMultiplier -= 0.5
    maxMultiplier -= 0.25
  }

  // Contract terms
  const contractMultipliers = {
    'Multi-year contracts': { min: 0.5, max: 0.75 },
    'Annual contracts': { min: 0.25, max: 0.5 },
    'Quarterly': { min: 0, max: 0.25 },
    'Month-to-month': { min: -0.25, max: 0 }
  }
  const contractAdj = contractMultipliers[contractTerms] || { min: 0, max: 0 }
  minMultiplier += contractAdj.min
  maxMultiplier += contractAdj.max

  // Ensure multipliers stay within reasonable bounds
  minMultiplier = Math.max(1.0, Math.min(minMultiplier, 8.0))
  maxMultiplier = Math.max(minMultiplier + 0.5, Math.min(maxMultiplier, 10.0))

  // Calculate valuation range
  const minValuation = annualRevenue * minMultiplier
  const maxValuation = annualRevenue * maxMultiplier

  return {
    minValuation,
    maxValuation,
    minMultiplier,
    maxMultiplier
  }
}

/**
 * Calculate Exit Readiness Score (0-100)
 */
export function calculateReadinessScore(data) {
  const {
    annualRevenue,
    ebitdaMargin,
    growthRate,
    customerConcentration,
    recurringRevenue,
    processDocumentation,
    ownerDependency,
    managementTeam,
    customerAcquisition,
    brandStrength,
    techAssets,
    competitiveAdvantage,
    marketConditions,
    customerRetention,
    contractTerms,
    yearsInBusiness
  } = data

  // Financial Health (30 points)
  let financialScore = 0

  // Revenue size (10 points)
  if (annualRevenue >= 10000000) financialScore += 10
  else if (annualRevenue >= 5000000) financialScore += 8
  else if (annualRevenue >= 2000000) financialScore += 6
  else if (annualRevenue >= 1000000) financialScore += 4
  else financialScore += 2

  // Profitability (10 points)
  if (ebitdaMargin >= 30) financialScore += 10
  else if (ebitdaMargin >= 20) financialScore += 7
  else if (ebitdaMargin >= 15) financialScore += 5
  else if (ebitdaMargin >= 10) financialScore += 3
  else financialScore += 1

  // Growth (10 points)
  if (growthRate >= 30) financialScore += 10
  else if (growthRate >= 20) financialScore += 8
  else if (growthRate >= 10) financialScore += 6
  else if (growthRate >= 0) financialScore += 4
  else financialScore += 0

  // Transferability (30 points)
  let transferabilityScore = 0

  // Systems and documentation (10 points)
  transferabilityScore += processDocumentation

  // Owner independence (10 points) - inverted
  transferabilityScore += (10 - ownerDependency)

  // Management team (10 points)
  transferabilityScore += managementTeam

  // Market Position (20 points)
  let marketScore = 0

  // Competitive advantage (5 points)
  const compScores = { 'Strong': 5, 'Moderate': 3, 'Weak': 2, 'None': 0 }
  marketScore += compScores[competitiveAdvantage] || 0

  // Customer retention (5 points)
  if (customerRetention >= 90) marketScore += 5
  else if (customerRetention >= 80) marketScore += 4
  else if (customerRetention >= 70) marketScore += 3
  else if (customerRetention >= 60) marketScore += 2
  else marketScore += 1

  // Market conditions (5 points)
  const marketCondScores = { 'Growing': 5, 'Stable': 3, 'Declining': 1 }
  marketScore += marketCondScores[marketConditions] || 0

  // Brand and customer acquisition (5 points)
  marketScore += Math.min(5, Math.round((brandStrength + customerAcquisition) / 4))

  // Documentation & Risk Factors (20 points)
  let riskScore = 0

  // Customer concentration (5 points) - inverted
  if (customerConcentration < 15) riskScore += 5
  else if (customerConcentration < 25) riskScore += 4
  else if (customerConcentration < 35) riskScore += 3
  else if (customerConcentration < 45) riskScore += 2
  else riskScore += 1

  // Recurring revenue (5 points)
  if (recurringRevenue >= 70) riskScore += 5
  else if (recurringRevenue >= 50) riskScore += 4
  else if (recurringRevenue >= 30) riskScore += 3
  else if (recurringRevenue >= 15) riskScore += 2
  else riskScore += 1

  // Contract terms (5 points)
  const contractScores = {
    'Multi-year contracts': 5,
    'Annual contracts': 4,
    'Quarterly': 3,
    'Month-to-month': 2
  }
  riskScore += contractScores[contractTerms] || 2

  // Technology/IP (5 points)
  riskScore += Math.min(5, Math.round(techAssets / 2))

  // Total score
  const totalScore = financialScore + transferabilityScore + marketScore + riskScore

  // Calculate category percentages
  const categoryScores = {
    financial: Math.round((financialScore / 30) * 100),
    transferability: Math.round((transferabilityScore / 30) * 100),
    market: Math.round((marketScore / 20) * 100),
    risk: Math.round((riskScore / 20) * 100)
  }

  return {
    totalScore,
    categoryScores,
    breakdown: {
      financial: financialScore,
      transferability: transferabilityScore,
      market: marketScore,
      risk: riskScore
    }
  }
}

/**
 * Identify key strengths and gaps
 */
export function identifyStrengthsAndGaps(data, readinessScore) {
  const strengths = []
  const gaps = []

  // Check each factor and categorize
  if (data.ebitdaMargin >= 25) {
    strengths.push({
      title: 'Strong Profitability',
      description: `${data.ebitdaMargin}% EBITDA margin is excellent`,
      impact: 'high'
    })
  } else if (data.ebitdaMargin < 15) {
    gaps.push({
      title: 'Low Profit Margins',
      description: `${data.ebitdaMargin}% EBITDA margin below industry average`,
      impact: 'Improving margins to 20%+ could add $' + formatNumber(data.annualRevenue * 0.3) + ' to valuation',
      priority: 'high'
    })
  }

  if (data.growthRate >= 20) {
    strengths.push({
      title: 'Rapid Growth',
      description: `${data.growthRate}% year-over-year growth is impressive`,
      impact: 'high'
    })
  } else if (data.growthRate < 5) {
    gaps.push({
      title: 'Slow Growth',
      description: `${data.growthRate}% growth rate limits valuation potential`,
      impact: 'Achieving 15%+ growth could increase multiple by 0.5-1.0x',
      priority: 'medium'
    })
  }

  if (data.recurringRevenue >= 70) {
    strengths.push({
      title: 'Predictable Revenue',
      description: `${data.recurringRevenue}% recurring revenue reduces buyer risk`,
      impact: 'high'
    })
  } else if (data.recurringRevenue < 40) {
    gaps.push({
      title: 'Low Recurring Revenue',
      description: `Only ${data.recurringRevenue}% of revenue is predictable`,
      impact: 'Increasing recurring revenue to 60%+ could add $' + formatNumber(data.annualRevenue * 0.5) + ' to valuation',
      priority: 'high'
    })
  }

  const ownerIndependence = 10 - data.ownerDependency
  if (ownerIndependence >= 7) {
    strengths.push({
      title: 'Strong Systems',
      description: 'Business can operate without heavy owner involvement',
      impact: 'high'
    })
  } else if (ownerIndependence < 4) {
    gaps.push({
      title: 'High Owner Dependency',
      description: 'Business relies too heavily on owner',
      impact: 'Reducing owner dependency could increase multiple by 1.0-2.0x',
      priority: 'critical'
    })
  }

  if (data.processDocumentation >= 8) {
    strengths.push({
      title: 'Well-Documented Processes',
      description: 'Strong SOPs make transition easier',
      impact: 'medium'
    })
  } else if (data.processDocumentation < 5) {
    gaps.push({
      title: 'Weak Process Documentation',
      description: 'Lack of documented systems increases buyer risk',
      impact: 'Implementing comprehensive SOPs could add $' + formatNumber(data.annualRevenue * 0.25) + ' to valuation',
      priority: 'high'
    })
  }

  if (data.customerConcentration < 20) {
    strengths.push({
      title: 'Diversified Customer Base',
      description: `Top 3 clients represent only ${data.customerConcentration}%`,
      impact: 'medium'
    })
  } else if (data.customerConcentration >= 35) {
    gaps.push({
      title: 'Customer Concentration Risk',
      description: `${data.customerConcentration}% revenue from top 3 clients`,
      impact: 'Diversifying to <25% could add $' + formatNumber(data.annualRevenue * 0.4) + ' to valuation',
      priority: 'high'
    })
  }

  if (data.managementTeam >= 8) {
    strengths.push({
      title: 'Strong Management Team',
      description: 'Capable leadership in place',
      impact: 'high'
    })
  } else if (data.managementTeam < 5) {
    gaps.push({
      title: 'Weak Management Team',
      description: 'Leadership team needs strengthening',
      impact: 'Building strong management could add $' + formatNumber(data.annualRevenue * 0.3) + ' to valuation',
      priority: 'medium'
    })
  }

  if (data.competitiveAdvantage === 'Strong') {
    strengths.push({
      title: 'Strong Competitive Advantage',
      description: 'Clear differentiation in the market',
      impact: 'high'
    })
  } else if (data.competitiveAdvantage === 'None' || data.competitiveAdvantage === 'Weak') {
    gaps.push({
      title: 'Weak Competitive Position',
      description: 'No clear differentiation from competitors',
      impact: 'Developing strong competitive moats could increase multiple by 0.5-1.0x',
      priority: 'medium'
    })
  }

  if (data.customerRetention >= 85) {
    strengths.push({
      title: 'Excellent Customer Retention',
      description: `${data.customerRetention}% retention rate`,
      impact: 'medium'
    })
  } else if (data.customerRetention < 70) {
    gaps.push({
      title: 'Poor Customer Retention',
      description: `${data.customerRetention}% retention rate is concerning`,
      impact: 'Improving retention to 85%+ could add $' + formatNumber(data.annualRevenue * 0.3) + ' to valuation',
      priority: 'high'
    })
  }

  // Sort by impact
  strengths.sort((a, b) => b.impact === 'high' ? 1 : -1)
  gaps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return {
    strengths: strengths.slice(0, 3),
    gaps: gaps.slice(0, 3)
  }
}

/**
 * Generate recommendations based on gaps
 */
export function generateRecommendations(gaps, data) {
  const recommendations = []

  gaps.forEach(gap => {
    if (gap.title.includes('Owner Dependency')) {
      recommendations.push({
        area: 'Reduce Owner Dependency',
        actions: [
          'Document all key processes and decision-making frameworks',
          'Hire and train a strong operations manager or COO',
          'Create a "business playbook" for running the company',
          'Implement systems that reduce need for owner involvement',
          'Build a capable management team that can run day-to-day operations'
        ],
        timeline: '6-12 months',
        valueImpact: gap.impact
      })
    }

    if (gap.title.includes('Process Documentation')) {
      recommendations.push({
        area: 'Document Business Processes',
        actions: [
          'Create SOPs for all critical business functions',
          'Document sales processes and customer onboarding',
          'Build operations manual with step-by-step procedures',
          'Record training videos for key processes',
          'Implement project management system to standardize workflows'
        ],
        timeline: '3-6 months',
        valueImpact: gap.impact
      })
    }

    if (gap.title.includes('Recurring Revenue')) {
      recommendations.push({
        area: 'Increase Recurring Revenue',
        actions: [
          'Convert project-based work to retainer agreements',
          'Introduce subscription or membership models',
          'Offer long-term contracts with discounts',
          'Create productized services with monthly billing',
          'Build automated renewal processes'
        ],
        timeline: '6-12 months',
        valueImpact: gap.impact
      })
    }

    if (gap.title.includes('Customer Concentration')) {
      recommendations.push({
        area: 'Diversify Customer Base',
        actions: [
          'Implement systematic new customer acquisition process',
          'Set policy limiting revenue from any single client to 15%',
          'Expand into new market segments or verticals',
          'Invest in marketing to attract smaller, diversified clients',
          'Build strategic partnerships for customer referrals'
        ],
        timeline: '9-18 months',
        valueImpact: gap.impact
      })
    }

    if (gap.title.includes('Profit Margins')) {
      recommendations.push({
        area: 'Improve Profitability',
        actions: [
          'Conduct comprehensive pricing analysis and increase rates',
          'Eliminate unprofitable services or clients',
          'Automate manual processes to reduce labor costs',
          'Renegotiate vendor contracts and reduce overhead',
          'Improve project scoping to prevent scope creep'
        ],
        timeline: '3-6 months',
        valueImpact: gap.impact
      })
    }

    if (gap.title.includes('Management Team')) {
      recommendations.push({
        area: 'Strengthen Management Team',
        actions: [
          'Hire experienced department heads (Sales, Operations, Finance)',
          'Implement leadership development program',
          'Create clear org chart with defined roles and responsibilities',
          'Establish regular leadership team meetings and accountability',
          'Offer equity incentives to retain key managers'
        ],
        timeline: '6-12 months',
        valueImpact: gap.impact
      })
    }

    if (gap.title.includes('Customer Retention')) {
      recommendations.push({
        area: 'Improve Customer Retention',
        actions: [
          'Implement customer success program with regular check-ins',
          'Create customer feedback loop and act on insights',
          'Build customer community or exclusive benefits program',
          'Develop upsell and cross-sell strategies for existing clients',
          'Track and address early warning signs of churn'
        ],
        timeline: '3-6 months',
        valueImpact: gap.impact
      })
    }
  })

  return recommendations.slice(0, 5)
}

/**
 * Helper function to format numbers
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k'
  }
  return num.toFixed(0)
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Get score rating text
 */
export function getScoreRating(score) {
  if (score >= 80) return { text: 'Excellent - Exit Ready', color: 'success', tag: 'Exit Ready' }
  if (score >= 65) return { text: 'Good - Strong Foundation', color: 'primary', tag: 'Good Foundation' }
  if (score >= 45) return { text: 'Fair - Needs Improvement', color: 'warning', tag: 'Needs Work' }
  return { text: 'Poor - Significant Work Needed', color: 'danger', tag: 'Needs Significant Work' }
}
