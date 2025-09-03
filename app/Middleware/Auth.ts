import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Authentication Middleware
 * 
 * This is a NAMED middleware that demonstrates:
 * - BEFORE request processing (checking authentication)
 * - Early termination (blocking unauthorized requests)
 * - Token validation
 * - User context injection
 */
export default class Auth {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    console.log('🔐 Auth middleware: Checking authentication...')

    // 🔍 BEFORE REQUEST - Check for authentication token
    const token = request.header('authorization') || request.input('token')

    if (!token) {
      console.log('❌ Auth middleware: No token provided')
      return response.status(401).json({
        error: 'Authentication required',
        message: 'Please provide an authentication token',
        hint: 'Add Authorization header or token parameter'
      })
    }

    // Extract token from Bearer format
    const cleanToken = token.replace('Bearer ', '')

    // 🧪 Simple token validation (In real apps, verify JWT or check database)
    const validTokens = [
      'user-token-123',
      'admin-token-456',
      'demo-token-789'
    ]

    if (!validTokens.includes(cleanToken)) {
      console.log('❌ Auth middleware: Invalid token')
      return response.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is not valid'
      })
    }

    // 👤 Inject user data into context (simulate user lookup)
    const userData = this.getUserFromToken(cleanToken)
    
    // Add user to request context so routes can access it
    request.ctx = { 
      ...request.ctx, 
      user: userData
    }

    console.log(`✅ Auth middleware: User authenticated - ${userData.name} (${userData.role})`)

    // ⏭️ Continue to next middleware/route
    await next()

    // 📝 AFTER REQUEST - Log authentication success
    console.log('🔐 Auth middleware: Request completed for authenticated user')
  }

  /**
   * Simulate user lookup from token
   * In real apps, this would query your database or verify JWT payload
   */
  private getUserFromToken(token: string) {
    const users = {
      'user-token-123': { id: 1, name: 'John Doe', role: 'user', email: 'john@example.com' },
      'admin-token-456': { id: 2, name: 'Jane Admin', role: 'admin', email: 'jane@example.com' },
      'demo-token-789': { id: 3, name: 'Demo User', role: 'demo', email: 'demo@example.com' }
    }

    return users[token] || { id: 0, name: 'Unknown', role: 'guest', email: '' }
  }
}
