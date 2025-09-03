import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Feature Flag Middleware
 * 
 * This NAMED middleware demonstrates:
 * - Conditional middleware execution
 * - Feature flag checking
 * - A/B testing capabilities
 * - Route-level feature control
 */
export default class FeatureFlag {
  // Feature flag configuration (in production, load from database/config service)
  private features = {
    'new-api': { enabled: true, rollout: 100 },      // 100% rollout
    'beta-features': { enabled: true, rollout: 50 },  // 50% rollout
    'experimental': { enabled: false, rollout: 0 },   // Disabled
    'premium-features': { enabled: true, rollout: 100, requiresAuth: true }
  }

  /**
   * Handle feature flag checking
   * @param ctx HTTP context
   * @param next Next function
   * @param featureName Name of the feature to check
   */
  public async handle(
    ctx: HttpContextContract, 
    next: () => Promise<void>,
    featureName: keyof typeof this.features
  ) {
    const { request, response } = ctx

    console.log(`🚩 FeatureFlag middleware: Checking feature '${featureName}'...`)

    // 🔍 BEFORE REQUEST - Check feature availability
    const feature = this.features[featureName]

    if (!feature) {
      console.log(`❌ FeatureFlag: Unknown feature '${featureName}'`)
      return response.status(404).json({
        error: 'Feature not found',
        message: `Feature '${featureName}' is not configured`,
        availableFeatures: Object.keys(this.features)
      })
    }

    // Check if feature is enabled
    if (!feature.enabled) {
      console.log(`❌ FeatureFlag: Feature '${featureName}' is disabled`)
      return response.status(403).json({
        error: 'Feature disabled',
        message: `Feature '${featureName}' is currently disabled`,
        feature: {
          name: featureName,
          enabled: false
        }
      })
    }

    // Check rollout percentage (A/B testing)
    const userRolloutId = this.getUserRolloutId(request)
    const userRolloutPercentage = userRolloutId % 100
    
    if (userRolloutPercentage >= feature.rollout) {
      console.log(`❌ FeatureFlag: User not in rollout for '${featureName}' (${userRolloutPercentage}% vs ${feature.rollout}%)`)
      return response.status(403).json({
        error: 'Feature not available',
        message: `Feature '${featureName}' is not available for your account`,
        feature: {
          name: featureName,
          enabled: true,
          inRollout: false,
          rolloutPercentage: feature.rollout
        }
      })
    }

    // Check authentication requirement
    if (feature.requiresAuth) {
      const user = request.ctx?.user
      if (!user) {
        console.log(`❌ FeatureFlag: Feature '${featureName}' requires authentication`)
        return response.status(401).json({
          error: 'Authentication required',
          message: `Feature '${featureName}' requires user authentication`,
          feature: {
            name: featureName,
            requiresAuth: true
          }
        })
      }
    }

    console.log(`✅ FeatureFlag: Feature '${featureName}' is available for user`)

    // Add feature context
    request.ctx = {
      ...request.ctx,
      feature: {
        name: featureName,
        enabled: true,
        rolloutId: userRolloutId,
        rolloutPercentage: feature.rollout
      }
    }

    // ⏭️ Continue to next middleware/route
    await next()

    // 📊 AFTER REQUEST - Log feature usage
    console.log(`🚩 FeatureFlag: Feature '${featureName}' used successfully`)
    
    // Add feature flag headers for debugging
    response.header('X-Feature-Flag', featureName)
    response.header('X-Feature-Enabled', 'true')
    response.header('X-Feature-Rollout', feature.rollout.toString())
  }

  /**
   * Generate consistent user rollout ID based on request
   * In production, use user ID or session ID
   */
  private getUserRolloutId(request: any): number {
    const ip = request.ip()
    const userAgent = request.header('user-agent') || ''
    const seed = ip + userAgent
    
    // Simple hash function for consistent rollout
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    
    return Math.abs(hash)
  }
}
