import { defineNuxtModule, addServerHandler, createResolver, logger, addServerImports } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
type SignupGateRiskLevel = 'low' | 'medium' | 'high' | 'none'

export interface ModuleOptions {
  /**
   * Configure at which risk level the signup gate should be triggered.
   *
   * @default high
   */
  riskLevel: SignupGateRiskLevel
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-signupgate',
    configKey: 'signupGate',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    riskLevel: 'high',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    if (!process.env.NUXT_PRIVATE_SIGNUP_GATE_API_KEY) {
      logger.error('[nuxt-signupgate]: NUXT_PRIVATE_SIGNUP_GATE_API_KEY is missing in environment variables.')
    }

    _nuxt.options.runtimeConfig.public.signupGate = defu(
      _nuxt.options.runtimeConfig.public.signupGate as ModuleOptions,
      _options,
    )

    // add config to runtime, only usable in server
    const runtimeConfig = _nuxt.options.runtimeConfig
    runtimeConfig._signupGateConfig = { ..._options } as ModuleOptions

    addServerImports([
      {
        name: 'checkRiskLevel',
        from: resolver.resolve('runtime/server/utils/checkRiskLevel'),
      },
      {
        name: 'checkRiskLevelSchema',
        from: resolver.resolve('runtime/server/utils/checkRiskLevel.schema'),
      },
    ])

    addServerHandler({
      route: '/api/signupgate/check',
      handler: resolver.resolve('./runtime/server/api/signupgate/check.get'),
    })
  },
})
