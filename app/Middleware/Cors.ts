import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * CORS (Cross-Origin Resource Sharing) Middleware
 * 
 * This GLOBAL middleware handles CORS for all routes.
 * It demonstrates both BEFORE and AFTER request processing:
 * - BEFORE: Handle OPTIONS preflight requests
 * - AFTER: Add CORS headers to all responses
 */
export default class Cors {
  private allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://yourdomain.com'
  ]

  private allowedMethods = [
    'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'
  ]

  private allowedHeaders = [
    'Content-Type',
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    // 🔍 BEFORE REQUEST - Handle preflight OPTIONS requests
    if (request.method() === 'OPTIONS') {
      console.log('✈️ Handling CORS preflight request')
      
      // Set preflight response headers
      this.setCorsHeaders(ctx)
      response.header('Access-Control-Max-Age', '86400') // 24 hours
      
      // Return early for OPTIONS requests
      return response.status(204).send('')
    }

    // ⏭️ Process the actual request
    await next()

    // 🌍 AFTER REQUEST - Add CORS headers to all responses
    this.setCorsHeaders(ctx)
    console.log('🌍 CORS headers added to response')
  }

  /**
   * Set CORS headers based on the request origin
   */
  private setCorsHeaders(ctx: HttpContextContract) {
    const { request, response } = ctx
    const origin = request.header('origin')

    // Check if origin is allowed
    if (origin && this.allowedOrigins.includes(origin)) {
      response.header('Access-Control-Allow-Origin', origin)
    } else if (!origin) {
      // Allow requests without origin (like Postman, curl)
      response.header('Access-Control-Allow-Origin', '*')
    }

    response.header('Access-Control-Allow-Methods', this.allowedMethods.join(', '))
    response.header('Access-Control-Allow-Headers', this.allowedHeaders.join(', '))
    response.header('Access-Control-Allow-Credentials', 'true')
  }
}
