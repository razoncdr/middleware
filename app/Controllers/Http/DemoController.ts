import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Demo Controller
 * 
 * This controller provides endpoints to test different middleware patterns
 */
export default class DemoController {
  /**
   * Public endpoint (no middleware required)
   */
  public async public({ request, response }: HttpContextContract) {
    return response.json({
      message: '🌍 This is a public endpoint',
      description: 'Only global middleware runs here',
      data: {
        method: request.method(),
        url: request.url(),
        timestamp: new Date().toISOString()
      }
    })
  }

  /**
   * Protected endpoint (requires authentication)
   */
  public async protected({ request, response }: HttpContextContract) {
    const user = request.ctx?.user

    return response.json({
      message: '🔐 This is a protected endpoint',
      description: 'Authentication required to access this',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      data: {
        method: request.method(),
        url: request.url(),
        authenticated_at: new Date().toISOString()
      }
    })
  }

  /**
   * Admin-only endpoint
   */
  public async admin({ request, response }: HttpContextContract) {
    const user = request.ctx?.user
    const permissions = request.ctx?.adminPermissions || []

    return response.json({
      message: '👑 This is an admin-only endpoint',
      description: 'Requires admin role to access',
      admin: {
        name: user.name,
        role: user.role,
        permissions: permissions
      },
      system_info: {
        server_time: new Date().toISOString(),
        total_users: 42, // Mock data
        active_sessions: 15
      }
    })
  }

  /**
   * Rate-limited endpoint
   */
  public async rateLimited({ request, response }: HttpContextContract) {
    return response.json({
      message: '🚦 This endpoint has strict rate limiting',
      description: 'Only 10 requests per minute allowed',
      request_info: {
        ip: request.ip(),
        method: request.method(),
        url: request.url()
      },
      hint: 'Try making multiple requests quickly to see rate limiting in action'
    })
  }

  /**
   * Feature-flagged endpoint
   */
  public async betaFeature({ request, response }: HttpContextContract) {
    const feature = request.ctx?.feature

    return response.json({
      message: '🚩 This is a beta feature',
      description: 'Protected by feature flags with 50% rollout',
      feature_info: {
        name: feature?.name,
        enabled: feature?.enabled,
        rolloutPercentage: feature?.rolloutPercentage
      },
      beta_data: {
        new_algorithm: 'active',
        performance_boost: '25%',
        additional_features: ['real-time-sync', 'advanced-analytics']
      }
    })
  }

  /**
   * Device-aware endpoint
   */
  public async deviceAware({ request, response }: HttpContextContract) {
    const device = request.ctx?.device

    return response.json({
      message: '📱 This endpoint adapts to your device',
      description: 'Response changes based on device type',
      device_detection: device,
      optimized_content: device?.isMobile 
        ? { layout: 'mobile', images: 'compressed', js: 'minimal' }
        : { layout: 'desktop', images: 'full-res', js: 'complete' }
    })
  }

  /**
   * Multiple middleware endpoint
   */
  public async multipleMiddleware({ request, response }: HttpContextContract) {
    const user = request.ctx?.user
    const device = request.ctx?.device
    const feature = request.ctx?.feature

    return response.json({
      message: '🎯 This endpoint uses multiple middleware',
      description: 'Demonstrates middleware chaining and interaction',
      middleware_data: {
        user: user ? { name: user.name, role: user.role } : null,
        device: device ? { type: device.type, browser: device.browser } : null,
        feature: feature ? { name: feature.name, enabled: feature.enabled } : null
      },
      combined_result: {
        access_level: user?.role || 'guest',
        device_optimization: device?.type || 'unknown',
        feature_access: feature?.enabled || false
      }
    })
  }

  /**
   * Data creation endpoint (POST)
   */
  public async create({ request, response }: HttpContextContract) {
    const body = request.body()
    const user = request.ctx?.user

    return response.status(201).json({
      message: '✅ Data created successfully',
      created_data: body,
      created_by: user ? user.name : 'anonymous',
      created_at: new Date().toISOString()
    })
  }

  /**
   * Error demonstration endpoint
   */
  public async error({ response }: HttpContextContract) {
    // This will trigger the error handling in ResponseTransformer
    throw new Error('Intentional error for middleware testing')
  }
}
