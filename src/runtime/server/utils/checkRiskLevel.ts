import { useRuntimeConfig } from 'nitropack/runtime'
import { consola } from 'consola'
import { createError, type H3Event } from 'h3'
import { checkRiskLevelSchema } from './checkRiskLevel.schema'

interface SignupGateCheckResponse {
  data: {
    risk_level: 'high' | 'low' | 'medium' | 'none'
    subject: string
    subject_type: string
  }
  success: boolean
}

const LOGGER_PREFIX = '[signupgate/check]:'

export const checkRiskLevel = async (event: H3Event, q: string) => {
  const { private: { signupGateApiKey }, _signupGateConfig: { riskLevel } } = useRuntimeConfig(event)

  checkRiskLevelSchema.parse({ q })

  const signupGateCheckResponse = await $fetch<SignupGateCheckResponse>('https://api.signupgate.com/v1/check', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${signupGateApiKey}`,
    },
    query: {
      q,
    },
  })

  if (!signupGateCheckResponse.success) {
    consola.error(`${LOGGER_PREFIX} SignupGate API request failed for query: ${q}`)
    throw createError({
      statusCode: 500,
      statusMessage: 'SignupGate API request failed.',
    })
  }

  if (signupGateCheckResponse.data.risk_level === 'high' && riskLevel === 'high') {
    consola.error(`${LOGGER_PREFIX} Blocked ${q} due to high risk level`)
    throw createError({
      statusCode: 403,
      statusMessage: 'Blocked due to high risk level.',
    })
  }

  if (signupGateCheckResponse.data.risk_level === 'medium' && riskLevel === 'medium') {
    consola.error(`${LOGGER_PREFIX} Blocked ${q} due to medium risk level`)
    throw createError({
      statusCode: 403,
      statusMessage: 'Blocked due to medium risk level.',
    })
  }

  return {
    subject: signupGateCheckResponse.data.subject,
    subjectType: signupGateCheckResponse.data.subject_type,
    riskLevel: signupGateCheckResponse.data.risk_level,
  }
}
