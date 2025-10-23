import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  runtimeConfig: {
    private: {
      signupGateApiKey: 'test-api-key',
    },
  },
  signupGate: {
    riskLevel: 'high',
  },
})
