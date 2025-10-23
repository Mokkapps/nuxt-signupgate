import { defineEventHandler, getRequestIP } from 'h3'
import { checkRiskLevel } from '../utils/checkRiskLevel'
import { useRuntimeConfig } from 'nitropack/runtime'

export default defineEventHandler(async (event) => {
  const { _signupGateConfig: { disableIpAddressServerMiddleware } } = useRuntimeConfig(event)

  if (disableIpAddressServerMiddleware === true) {
    return
  }

  const ip = getRequestIP(event)
  if (ip) {
    await checkRiskLevel(event, ip)
  }
})
