import axios from 'axios'

// API base URL - use environment variable or default to local
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Submit lead to CRM
 */
export async function submitLead(leadData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/leads`, {
      ...leadData,
      source: 'Exit Readiness Calculator'
    })
    return response.data
  } catch (error) {
    console.error('Error submitting lead:', error)
    throw error
  }
}

/**
 * Submit calculator assessment
 */
export async function submitAssessment(assessmentData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/assessments`, assessmentData)
    return response.data
  } catch (error) {
    console.error('Error submitting assessment:', error)
    throw error
  }
}

/**
 * Send results email with PDF
 */
export async function sendResultsEmail(emailData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-results`, emailData)
    return response.data
  } catch (error) {
    console.error('Error sending results email:', error)
    throw error
  }
}

/**
 * Trigger CRM webhook with lead tagging
 */
export async function triggerCRMWebhook(data) {
  const webhookUrl = import.meta.env.VITE_GOHIGHLEVEL_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('GoHighLevel webhook URL not configured')
    return
  }

  try {
    const response = await axios.post(webhookUrl, data)
    return response.data
  } catch (error) {
    console.error('Error triggering CRM webhook:', error)
    // Don't throw - webhook failure shouldn't break the user experience
  }
}
