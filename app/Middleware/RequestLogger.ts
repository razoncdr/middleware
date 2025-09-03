import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * RequestLogger Middleware
 * 
 * This is a GLOBAL middleware that demonstrates:
 * - Before request processing (logging incoming requests)
 * - After request processing (logging response details)
 * - Request timing
 * - Request/Response data collection
 */
export default class RequestLogger {
  /**
   * Handle method is called for every HTTP request
   * @param ctx - The HTTP context containing request, response, etc.
   * @param next - Function to call the next middleware or route handler
   */
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    // 🕐 BEFORE REQUEST - Capture start time
    const startTime = Date.now()
    
    // 📥 Log incoming request details
    console.log('\n🔵 === INCOMING REQUEST ===')
    console.log(`📅 Timestamp: ${new Date().toISOString()}`)
    console.log(`🌐 Method: ${request.method()}`)
    console.log(`🔗 URL: ${request.url()}`)
    console.log(`🏠 IP: ${request.ip()}`)
    console.log(`🖥️  User-Agent: ${request.header('user-agent')}`)
    console.log(`📋 Headers:`, request.headers())
    
    // Log request body if it exists (for POST, PUT, PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(request.method())) {
      console.log(`📦 Body:`, request.body())
    }

    // ⏭️ CALL NEXT MIDDLEWARE/ROUTE
    // This is where the magic happens - control passes to the next middleware or route handler
    await next()

    // 🕑 AFTER REQUEST - This runs after the route handler completes
    const endTime = Date.now()
    const duration = endTime - startTime

    // 📤 Log outgoing response details
    console.log('\n🟢 === OUTGOING RESPONSE ===')
    console.log(`⚡ Duration: ${duration}ms`)
    console.log(`📊 Status: ${response.getStatus()}`)
    console.log(`📏 Response Headers:`, response.getHeaders())
    console.log(`🎯 Success: ${response.getStatus() < 400 ? '✅' : '❌'}`)
    console.log('═══════════════════════════════════\n')
  }
}
