import { jsPDF } from 'jspdf'
import { formatCurrency, getScoreRating } from './calculations'

/**
 * Generate professional PDF report
 */
export function generatePDFReport(data, results) {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  let yPos = 20

  // Helper function to add new page if needed
  const checkPageBreak = (neededSpace = 20) => {
    if (yPos + neededSpace > pageHeight - 20) {
      pdf.addPage()
      yPos = 20
      return true
    }
    return false
  }

  // COVER PAGE
  // Header background
  pdf.setFillColor(37, 99, 235) // primary-600
  pdf.rect(0, 0, pageWidth, 60, 'F')

  // Title
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(28)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Business Exit Readiness Report', pageWidth / 2, 30, { align: 'center' })

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Confidential Assessment', pageWidth / 2, 45, { align: 'center' })

  // Business info
  yPos = 80
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text(data.businessName || 'Your Business', pageWidth / 2, yPos, { align: 'center' })

  yPos += 15
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Prepared for: ${data.name}`, pageWidth / 2, yPos, { align: 'center' })

  yPos += 10
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  pdf.text(`Report Date: ${reportDate}`, pageWidth / 2, yPos, { align: 'center' })

  // Score highlight
  yPos = 130
  const scoreRating = getScoreRating(results.readinessScore.totalScore)

  // Score circle
  pdf.setFillColor(240, 240, 240)
  pdf.circle(pageWidth / 2, yPos + 20, 30, 'F')

  pdf.setFillColor(37, 99, 235)
  pdf.circle(pageWidth / 2, yPos + 20, 28, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(32)
  pdf.setFont('helvetica', 'bold')
  pdf.text(String(results.readinessScore.totalScore), pageWidth / 2, yPos + 25, { align: 'center' })

  pdf.setFontSize(10)
  pdf.text('EXIT READINESS SCORE', pageWidth / 2, yPos + 35, { align: 'center' })

  yPos += 60
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.text(scoreRating.text, pageWidth / 2, yPos, { align: 'center' })

  // Valuation range
  yPos += 25
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Estimated Valuation Range', pageWidth / 2, yPos, { align: 'center' })

  yPos += 10
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(34, 197, 94) // green
  const valuationText = `${formatCurrency(results.valuation.minValuation)} - ${formatCurrency(results.valuation.maxValuation)}`
  pdf.text(valuationText, pageWidth / 2, yPos, { align: 'center' })

  // Footer
  pdf.setTextColor(100, 100, 100)
  pdf.setFontSize(8)
  pdf.text('This report is confidential and intended solely for the recipient.', pageWidth / 2, pageHeight - 15, {
    align: 'center'
  })

  // PAGE 2 - EXECUTIVE SUMMARY
  pdf.addPage()
  yPos = 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Executive Summary', 20, yPos)

  yPos += 15
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const summary = `This comprehensive assessment evaluated ${data.businessName || 'your business'} across four key dimensions: Financial Health, Transferability, Market Position, and Risk Management. Based on the analysis, your business received an Exit Readiness Score of ${results.readinessScore.totalScore} out of 100.`

  const summaryLines = pdf.splitTextToSize(summary, pageWidth - 40)
  summaryLines.forEach(line => {
    pdf.text(line, 20, yPos)
    yPos += 5
  })

  // Key Metrics
  yPos += 10
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Key Metrics', 20, yPos)

  yPos += 10
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  const metrics = [
    ['Annual Revenue', formatCurrency(data.annualRevenue)],
    ['EBITDA Margin', `${data.ebitdaMargin}%`],
    ['Year-over-Year Growth', `${data.growthRate}%`],
    ['Recurring Revenue', `${data.recurringRevenue}%`],
    ['Years in Business', String(data.yearsInBusiness)],
    ['Number of Employees', String(data.employeeCount)]
  ]

  metrics.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'normal')
    pdf.text(label + ':', 20, yPos)
    pdf.setFont('helvetica', 'bold')
    pdf.text(value, 100, yPos)
    yPos += 7
  })

  // Category Scores
  yPos += 10
  checkPageBreak(60)

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Score Breakdown by Category', 20, yPos)

  yPos += 10
  const categories = [
    { name: 'Financial Health', score: results.readinessScore.categoryScores.financial, weight: '30%' },
    { name: 'Transferability', score: results.readinessScore.categoryScores.transferability, weight: '30%' },
    { name: 'Market Position', score: results.readinessScore.categoryScores.market, weight: '20%' },
    { name: 'Risk Management', score: results.readinessScore.categoryScores.risk, weight: '20%' }
  ]

  categories.forEach(cat => {
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(cat.name, 20, yPos)
    pdf.text(`(${cat.weight})`, 80, yPos)

    // Score bar
    const barWidth = 80
    const scoreWidth = (cat.score / 100) * barWidth

    pdf.setFillColor(220, 220, 220)
    pdf.rect(105, yPos - 4, barWidth, 6, 'F')

    // Color based on score
    if (cat.score >= 75) pdf.setFillColor(34, 197, 94) // green
    else if (cat.score >= 50) pdf.setFillColor(59, 130, 246) // blue
    else if (cat.score >= 30) pdf.setFillColor(234, 179, 8) // yellow
    else pdf.setFillColor(239, 68, 68) // red

    pdf.rect(105, yPos - 4, scoreWidth, 6, 'F')

    pdf.setFont('helvetica', 'bold')
    pdf.text(`${cat.score}%`, 190, yPos)

    yPos += 12
  })

  // PAGE 3 - STRENGTHS
  checkPageBreak(100)
  yPos += 5

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Top Strengths', 20, yPos)

  yPos += 10
  if (results.strengths.length > 0) {
    results.strengths.forEach((strength, index) => {
      checkPageBreak(25)

      pdf.setFillColor(220, 252, 231) // green-100
      pdf.rect(20, yPos - 6, pageWidth - 40, 20, 'F')

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(22, 163, 74) // green-600
      pdf.text(`${index + 1}. ${strength.title}`, 25, yPos)

      yPos += 7
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const descLines = pdf.splitTextToSize(strength.description, pageWidth - 50)
      descLines.forEach(line => {
        pdf.text(line, 25, yPos)
        yPos += 5
      })

      yPos += 8
    })
  } else {
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text('No significant strengths identified at this time.', 20, yPos)
    yPos += 10
  }

  // VALUE GAPS
  yPos += 10
  checkPageBreak(100)

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Critical Value Gaps', 20, yPos)

  yPos += 10
  if (results.gaps.length > 0) {
    results.gaps.forEach((gap, index) => {
      checkPageBreak(30)

      pdf.setFillColor(254, 226, 226) // red-100
      pdf.rect(20, yPos - 6, pageWidth - 40, 25, 'F')

      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(220, 38, 38) // red-600
      pdf.text(`${index + 1}. ${gap.title}`, 25, yPos)

      yPos += 7
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const descLines = pdf.splitTextToSize(gap.description, pageWidth - 50)
      descLines.forEach(line => {
        pdf.text(line, 25, yPos)
        yPos += 5
      })

      yPos += 7
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(100, 100, 100)
      pdf.text('Potential Impact:', 25, yPos)
      yPos += 5
      pdf.setFont('helvetica', 'normal')
      const impactLines = pdf.splitTextToSize(gap.impact, pageWidth - 50)
      impactLines.forEach(line => {
        pdf.text(line, 25, yPos)
        yPos += 5
      })

      yPos += 8
    })
  }

  // PAGE 4 - RECOMMENDATIONS
  pdf.addPage()
  yPos = 20

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Recommended Actions', 20, yPos)

  yPos += 15
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const recIntro = 'Based on the gaps identified, here are the highest-priority actions to increase your business value and exit readiness:'
  const recIntroLines = pdf.splitTextToSize(recIntro, pageWidth - 40)
  recIntroLines.forEach(line => {
    pdf.text(line, 20, yPos)
    yPos += 5
  })

  yPos += 10

  if (results.recommendations && results.recommendations.length > 0) {
    results.recommendations.forEach((rec, index) => {
      checkPageBreak(50)

      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(37, 99, 235) // primary-600
      pdf.text(`${index + 1}. ${rec.area}`, 20, yPos)

      yPos += 8
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(0, 0, 0)

      rec.actions.forEach(action => {
        checkPageBreak(15)
        pdf.text('• ' + action, 25, yPos)
        const actionLines = pdf.splitTextToSize(action, pageWidth - 50)
        yPos += 5 * actionLines.length
      })

      yPos += 5
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Timeline: ${rec.timeline}`, 25, yPos)

      yPos += 10
    })
  }

  // VALUATION METHODOLOGY
  checkPageBreak(80)
  yPos += 10

  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Valuation Methodology', 20, yPos)

  yPos += 10
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')

  const methodology = [
    'The estimated valuation range is calculated using industry-standard revenue multiples for service-based businesses, adjusted for your specific business characteristics.',
    '',
    `Base Industry Multiple: ${results.valuation.minMultiplier.toFixed(1)}x - ${results.valuation.maxMultiplier.toFixed(1)}x`,
    '',
    'Key factors that influenced your multiple:',
    '• Profitability (EBITDA margin)',
    '• Revenue growth rate',
    '• Recurring revenue percentage',
    '• Customer concentration risk',
    '• Owner dependency level',
    '• Process documentation and systems',
    '• Management team strength',
    '• Competitive position and market conditions',
    '',
    'This is an estimated range for informational purposes only. Actual valuation may vary based on market conditions, buyer motivations, deal structure, and other factors. A formal business valuation should be conducted before entering any transaction.'
  ]

  methodology.forEach(line => {
    checkPageBreak(10)
    if (line === '') {
      yPos += 3
    } else {
      const lines = pdf.splitTextToSize(line, pageWidth - 40)
      lines.forEach(l => {
        pdf.text(l, 20, yPos)
        yPos += 5
      })
    }
  })

  // NEXT STEPS
  pdf.addPage()
  yPos = 20

  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Next Steps', 20, yPos)

  yPos += 15
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')

  const nextSteps = [
    '1. Review this report carefully and identify which gaps have the biggest impact on your business value.',
    '',
    '2. Prioritize 2-3 key areas to focus on in the next 6-12 months.',
    '',
    '3. Create an action plan with specific milestones and deadlines.',
    '',
    '4. Consider scheduling a consultation to discuss:',
    '   • Detailed strategies to increase your business value',
    '   • Creating a comprehensive exit roadmap',
    '   • Timeline and preparation for a successful exit',
    '   • Introduction to potential buyers or investors',
    '',
    '5. Re-assess your exit readiness every 6 months to track progress.'
  ]

  nextSteps.forEach(line => {
    const lines = pdf.splitTextToSize(line, pageWidth - 40)
    lines.forEach(l => {
      pdf.text(l, 20, yPos)
      yPos += 6
    })
  })

  // CTA Box
  yPos += 15
  pdf.setFillColor(239, 246, 255) // primary-50
  pdf.rect(20, yPos - 5, pageWidth - 40, 40, 'F')

  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(37, 99, 235)
  pdf.text('Ready to Maximize Your Exit Value?', pageWidth / 2, yPos + 5, { align: 'center' })

  yPos += 15
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(0, 0, 0)
  pdf.text('Schedule your free 30-minute exit strategy consultation', pageWidth / 2, yPos, { align: 'center' })

  yPos += 10
  pdf.setFontSize(10)
  pdf.setTextColor(37, 99, 235)
  pdf.text('Book at: www.yourcompany.com/consultation', pageWidth / 2, yPos + 5, { align: 'center' })

  // Footer with contact info
  yPos = pageHeight - 30
  pdf.setFillColor(37, 99, 235)
  pdf.rect(0, yPos, pageWidth, 30, 'F')

  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Business Exit Consulting', pageWidth / 2, yPos + 10, { align: 'center' })

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Email: info@yourcompany.com | Phone: (555) 123-4567', pageWidth / 2, yPos + 17, {
    align: 'center'
  })

  pdf.text('www.yourcompany.com', pageWidth / 2, yPos + 23, { align: 'center' })

  // Disclaimer
  pdf.setFontSize(7)
  pdf.setTextColor(200, 200, 200)
  pdf.text(
    'This report is provided for informational purposes only and does not constitute financial, legal, or tax advice.',
    pageWidth / 2,
    pageHeight - 5,
    { align: 'center' }
  )

  return pdf
}

/**
 * Download PDF report
 */
export function downloadPDF(pdf, filename = 'exit-readiness-report.pdf') {
  pdf.save(filename)
}

/**
 * Get PDF as blob for email attachment
 */
export function getPDFBlob(pdf) {
  return pdf.output('blob')
}
