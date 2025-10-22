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

## API Endpoint

The module automatically adds a server endpoint to check emails, domains, or IP addresses:

### `GET /api/signupgate/check`

Check if a subject (email, domain, or IP address) should be blocked based on risk level.

#### Query Parameters

- `q` (required) - The subject to check (email, domain, or IP address)

#### Example Request

```typescript
// In your component or composable
const { data, error } = await useFetch('/api/signupgate/check', {
  query: { q: 'example@domain.com' }
})
```

#### Response

**Success (200):**
```json
{
  "subject": "example@domain.com",
  "subjectType": "email",
  "riskLevel": "low"
}
```

**Blocked (403):**
```json
{
  "statusCode": 403,
  "statusMessage": "Blocked due to high risk level."
}
```

**Error (500):**
```json
{
  "statusCode": 500,
  "statusMessage": "SignupGate API request failed."
}
```

#### Risk Levels

- `none` - No risk detected
- `low` - Low risk detected
- `medium` - Medium risk detected
- `high` - High risk detected

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
