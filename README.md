# Nuxt SignupGate

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt module for [SignupGate](https://signupgate.com).

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

## Quick Setup

Install the module to your Nuxt application with one command:

```bash
npx nuxi module add nuxt-signupgate
```

That's it! You can now use Nuxt SignupGate in your Nuxt app ✨

## Configuration

### Environment Variables

The module requires the following environment variable to be set:

- `NUXT_PRIVATE_SIGNUP_GATE_API_KEY` - Your SignupGate API key (required)

You can set this in your `.env` file:

```bash
NUXT_PRIVATE_SIGNUP_GATE_API_KEY=your_api_key_here
```

### Module Options

Configure the module in your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-signupgate'],
  signupGate: {
    // Configure at which risk level the signup gate should be triggered
    // Options: 'low' | 'medium' | 'high' | 'none'
    // Default: 'high'
    riskLevel: 'high'
  }
})
```

#### Options

- `riskLevel` (default: `'high'`) - Configure at which risk level the signup gate should block requests:
  - `'high'` - Only block high-risk subjects
  - `'medium'` - Block medium and high-risk subjects
  - `'low'` - Block low, medium, and high-risk subjects
  - `'none'` - Don't block any subjects (monitoring only)



## Server auto-import: checkRiskLevel

The module exposes a server-side helper `checkRiskLevel` which is auto-imported and available in your server routes (no import required). Use this when you want to call SignupGate from server middleware or API routes directly.

Signature (approx):

```ts
// available automatically in server context
// async function checkRiskLevel(event: H3Event, q: string)
```

What it does:

- Validates the input (`q`) — must be a non-empty string (email, domain or IP).
- Calls the SignupGate API using the private API key from runtime config.
- Throws a 500 error when the upstream API request fails.
- Throws a 403 when the subject should be blocked according to your configured `riskLevel`.
- Returns an object with `subject`, `subjectType`, and `riskLevel` when successful.

Example server route using the auto-imported helper:

```ts
export default defineEventHandler(async (event) => {
  // no import required — `checkRiskLevel` is auto-imported by the module
  const q = 'example@domain.com'
  const result = await checkRiskLevel(event, q)

  // result -> { subject: string, subjectType: string, riskLevel: 'none'|'low'|'medium'|'high' }
  return result
})
```

Client usage

For client-side calls (from components or composables), continue to use the provided API endpoint `GET /api/signupgate/check` which performs the same check server-side for you. Example:

```ts
const { data, error } = await useFetch('/api/signupgate/check', {
  query: { q: 'example@domain.com' }
})
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  npm install
  
  # Generate type stubs
  npm run dev:prepare
  
  # Develop with the playground
  npm run dev
  
  # Build the playground
  npm run dev:build
  
  # Run ESLint
  npm run lint
  
  # Run Vitest
  npm run test
  npm run test:watch
  
  # Release new version
  npm run release
  ```

</details>


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-signupgate/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-signupgate

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-signupgate.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/nuxt-signupgate

[license-src]: https://img.shields.io/npm/l/nuxt-signupgate.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-signupgate

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
