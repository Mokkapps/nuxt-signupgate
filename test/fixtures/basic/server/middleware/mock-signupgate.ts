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

// Mock responses for different test scenarios
const mockResponses: Record<string, SignupGateCheckResponse> = {
  'test@example.com': {
    success: true,
    data: {
      risk_level: 'low',
      subject: 'test@example.com',
      subject_type: 'email',
    },
  },
  'bad@example.com': {
    success: true,
    data: {
      risk_level: 'high',
      subject: 'bad@example.com',
      subject_type: 'email',
    },
  },
  'fail@example.com': {
    success: false,
    data: {
      risk_level: 'none',
      subject: 'fail@example.com',
      subject_type: 'email',
    },
  },
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.private?.signupGateApiKey

  // Only intercept if using test API key
  if (apiKey === 'test-api-key') {
    const originalFetch = globalThis.$fetch

    // @ts-expect-error - Overriding global $fetch for testing
    globalThis.$fetch = async (url: string, options?: any) => {
      // Intercept SignupGate API calls
      if (url === 'https://api.signupgate.com/v1/check') {
        const query = options?.query?.q as string

        // Return mock response based on the query parameter
        if (query && mockResponses[query]) {
          return mockResponses[query]
        }

        // Default low risk response for any other query
        return {
          success: true,
          data: {
            risk_level: 'low',
            subject: query,
            subject_type: 'email',
          },
        } as SignupGateCheckResponse
      }

      // For non-SignupGate calls, use original fetch
      return originalFetch(url, options)
    }
  }
})
