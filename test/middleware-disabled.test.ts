import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'

describe('server middleware disabled', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/middleware', import.meta.url)),
    nuxtConfig: {
      signupGate: {
        disableIpAddressServerMiddleware: true,
      },
    },
  })

  it('allows request', async () => {
    const response = await fetch('/api/test')
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('success')
  })
})
