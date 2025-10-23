import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from 'nitropack/runtime'

interface SignupGateCheckResponse {
  data: {
    risk_level: 'high' | 'low' | 'medium' | 'none'
    subject: string
    subject_type: string
  }
  success: boolean
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.private?.signupGateApiKey

  // Only intercept if using test API key
  if (apiKey === 'test-api-key') {
    const originalFetch = globalThis.$fetch

    // @ts-expect-error - Overriding global $fetch for testing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalThis.$fetch = async (url: string, options?: any) => {
      // Intercept SignupGate API calls
      if (url === 'https://api.signupgate.com/v1/check') {
        return {
          success: true,
          data: {
            risk_level: 'high',
            subject: '127.0.0.1',
            subject_type: 'ip',
          },
        } as SignupGateCheckResponse
      }

      // For non-SignupGate calls, use original fetch
      return originalFetch(url, options)
    }
  }
})
