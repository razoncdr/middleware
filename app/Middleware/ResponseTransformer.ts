import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Response Transformer Middleware
 * 
 * This middleware demonstrates advanced BEFORE/AFTER processing:
 * - BEFORE: Request validation and preprocessing
 * - AFTER: Response transformation and enrichment
 * - Error handling
 * - Performance monitoring
 */
export default class ResponseTransformer {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    console.log('🔄 ResponseTransformer: Starting request transformation...')

    // 📋 BEFORE REQUEST - Validate and preprocess
    const requestId = this.generateRequestId()
    const startTime = process.hrtime.bigint()

    // Add request ID to context for tracking
    request.ctx = {
      ...request.ctx,
      requestId,
      startTime
    }

    // Add request ID header for client tracking
    response.header('X-Request-ID', requestId)

    // Validate request format if JSON
    if (request.header('content-type')?.includes('application/json')) {
      try {
        const body = request.body()
        if (body && typeof body === 'object') {
          console.log(`✅ ResponseTransformer: Valid JSON request with ${Object.keys(body).length} fields`)
        }
      } catch (error) {
        console.log('❌ ResponseTransformer: Invalid JSON in request body')
        return response.status(400).json({
          error: 'Invalid JSON',
          message: 'Request body contains malformed JSON',
          requestId
        })
      }
    }

    let error = null

    try {
      // ⏭️ Process the request
      await next()
    } catch (err) {
      error = err
      console.log('💥 ResponseTransformer: Error caught during request processing')
    }

    // 🔄 AFTER REQUEST - Transform and enrich response
    const endTime = process.hrtime.bigint()
    const processingTime = Number(endTime - startTime) / 1000000 // Convert to milliseconds

    // Add performance headers
    response.header('X-Processing-Time', `${processingTime.toFixed(2)}ms`)
    response.header('X-Server', 'AdonisJS-Middleware-Demo')

    if (error) {
      // Handle errors with enriched response
      console.log('❌ ResponseTransformer: Transforming error response')
      return response.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while processing your request',
        meta: {
          requestId,
          processingTime: `${processingTime.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        }
      })
    }

    // Transform successful responses
    const originalBody = response.getBody()

    if (originalBody && typeof originalBody === 'object') {
      // Enrich response with metadata
      const enrichedResponse = {
        ...originalBody,
        meta: {
          requestId,
          processingTime: `${processingTime.toFixed(2)}ms`,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      }

      response.json(enrichedResponse)
      console.log(`🔄 ResponseTransformer: Response enriched with metadata (${processingTime.toFixed(2)}ms)`)
    }
  }

  /**
   * Generate a unique request ID for tracking
   */
  private generateRequestId(): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 15)
    return `req_${timestamp}_${randomStr}`
  }
}
