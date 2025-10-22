import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, fetch, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('throws error if no query is passed', async () => {
    const response = await fetch('/api/signupgate/check')
    expect(response.status).toBe(400)
  })

  it('returns error if signup request was not successful', async () => {
    const response = await fetch('/api/signupgate/check?q=fail@example.com')
    expect(response.status).toBe(500)
    expect(response.statusText).toBe('SignupGate API request failed.')
  })

  it('blocks high risk level when configured', async () => {
    const response = await fetch('/api/signupgate/check?q=bad@example.com')

    expect(response.status).toBe(403)
    expect(response.statusText).toBe('Blocked due to high risk level.')
  })

  it('returns risk level for valid query with low risk', async () => {
    const response = await fetch('/api/signupgate/check?q=test@example.com')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({
      subject: 'test@example.com',
      subjectType: 'email',
      riskLevel: 'low',
    })
  })
})
