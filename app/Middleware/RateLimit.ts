import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Rate Limiting Middleware
 * 
 * This NAMED middleware demonstrates:
 * - Request rate limiting by IP
 * - Time-based windows
 * - Custom rate limit responses
 * - Different limits for different endpoints
 */
export default class RateLimit {
  // In-memory storage for demo (use Redis in production)
  private static requests: Map<string, { count: number; resetTime: number }> = new Map()

  // Rate limit configurations
  private limits = {
    default: { requests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
    strict: { requests: 10, windowMs: 60 * 1000 },        // 10 requests per minute
    generous: { requests: 1000, windowMs: 60 * 60 * 1000 } // 1000 requests per hour
  }

  /**
   * Handle rate limiting with configurable limits
   * @param ctx HTTP context
   * @param next Next function
   * @param limitType Type of rate limit to apply
   */
  public async handle(
    ctx: HttpContextContract, 
    next: () => Promise<void>,
    limitType: keyof typeof this.limits = 'default'
  ) {
    const { request, response } = ctx

    console.log(`🚦 RateLimit middleware: Checking ${limitType} rate limit...`)

    // 🔍 BEFORE REQUEST - Check rate limit
    const clientIP = request.ip()
    const key = `${clientIP}:${limitType}`
    const limit = this.limits[limitType]
    const now = Date.now()

    // Get or initialize request data for this IP
    let requestData = RateLimit.requests.get(key)

    if (!requestData || now > requestData.resetTime) {
      // Reset window
      requestData = {
        count: 0,
        resetTime: now + limit.windowMs
      }
    }

    // Increment request count
    requestData.count++
    RateLimit.requests.set(key, requestData)

    // Check if limit exceeded
    if (requestData.count > limit.requests) {
      const resetIn = Math.ceil((requestData.resetTime - now) / 1000)
      
      console.log(`❌ RateLimit: Limit exceeded for ${clientIP} (${requestData.count}/${limit.requests})`)
      
      // Add rate limit headers
      response.header('X-RateLimit-Limit', limit.requests.toString())
      response.header('X-RateLimit-Remaining', '0')
      response.header('X-RateLimit-Reset', requestData.resetTime.toString())
      response.header('Retry-After', resetIn.toString())

      return response.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests from ${clientIP}`,
        limit: {
          requests: limit.requests,
          windowMs: limit.windowMs,
          type: limitType
        },
        current: {
          count: requestData.count,
          resetIn: `${resetIn} seconds`
        }
      })
    }

    // Add rate limit info headers
    const remaining = limit.requests - requestData.count
    response.header('X-RateLimit-Limit', limit.requests.toString())
    response.header('X-RateLimit-Remaining', remaining.toString())
    response.header('X-RateLimit-Reset', requestData.resetTime.toString())

    console.log(`✅ RateLimit: Request allowed for ${clientIP} (${requestData.count}/${limit.requests})`)

    // ⏭️ Continue to next middleware/route
    await next()

    // 📊 AFTER REQUEST - Log rate limit usage
    console.log(`🚦 RateLimit: Request completed. Remaining: ${remaining}`)
  }
}
