import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'

describe('server middleware (default)', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/middleware', import.meta.url)),
  })

  it('throws high risk level error if IP is blocked', async () => {
    const response = await fetch('/api/test')
    expect(response.status).toBe(403)
    expect(response.statusText).toBe('Blocked due to high risk level.')
  })
})
