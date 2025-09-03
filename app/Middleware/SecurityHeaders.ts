import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * SecurityHeaders Middleware
 * 
 * This GLOBAL middleware adds essential security headers to every response.
 * It demonstrates AFTER request processing - modifying the response
 * before it's sent to the client.
 */
export default class SecurityHeaders {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { response } = ctx

    // ⏭️ First, let the request be processed
    await next()

    // 🛡️ AFTER REQUEST - Add security headers to the response
    
    // Prevent clickjacking attacks
    response.header('X-Frame-Options', 'DENY')
    
    // Prevent MIME type sniffing
    response.header('X-Content-Type-Options', 'nosniff')
    
    // Enable XSS protection
    response.header('X-XSS-Protection', '1; mode=block')
    
    // Referrer policy
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    
    // Content Security Policy (basic)
    response.header('Content-Security-Policy', "default-src 'self'")
    
    // Strict Transport Security (HTTPS only)
    response.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    
    // Permissions Policy (formerly Feature Policy)
    response.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
    
    // Custom security header for demonstration
    response.header('X-Powered-By', 'AdonisJS-Middleware-Demo')
    
    console.log('🛡️ Security headers added to response')
  }
}
