import { defineEventHandler, getValidatedQuery } from 'h3'
import { checkRiskLevel, checkRiskLevelSchema } from '#imports'

export default defineEventHandler(async (event) => {
  const { q } = await getValidatedQuery(event, checkRiskLevelSchema.parse)

  return checkRiskLevel(event, q)
})
