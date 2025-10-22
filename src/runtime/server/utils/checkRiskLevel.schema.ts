import z from 'zod'

export const checkRiskLevelSchema = z.object({
  /**
   * Email, domain, or IP-address to check
   */
  q: z.string().nonempty().transform(value => value.toLowerCase().trim()),
})
