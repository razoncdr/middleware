import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Device Detection Middleware
 * 
 * This NAMED middleware demonstrates:
 * - User-Agent parsing
 * - Device/browser detection
 * - Context enrichment
 * - Conditional response formatting
 */
export default class DeviceDetector {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    console.log('📱 DeviceDetector middleware: Analyzing client device...')

    // 🔍 BEFORE REQUEST - Parse user agent
    const userAgent = request.header('user-agent') || ''
    const deviceInfo = this.parseUserAgent(userAgent)

    // Add device info to request context
    request.ctx = {
      ...request.ctx,
      device: deviceInfo
    }

    console.log(`✅ DeviceDetector: Detected ${deviceInfo.type} - ${deviceInfo.browser} on ${deviceInfo.os}`)

    // 📊 Add device-specific headers
    response.header('X-Device-Type', deviceInfo.type)
    response.header('X-Browser', deviceInfo.browser)
    response.header('X-OS', deviceInfo.os)

    // ⏭️ Continue to next middleware/route
    await next()

    // 🎨 AFTER REQUEST - Modify response based on device type
    const responseBody = response.getBody()
    
    if (deviceInfo.type === 'mobile' && responseBody && typeof responseBody === 'object') {
      // Add mobile-optimized flags
      response.json({
        ...responseBody,
        mobile_optimized: true,
        device_info: deviceInfo
      })
    }

    console.log('📱 DeviceDetector: Response optimized for device type')
  }

  /**
   * Parse user agent string to detect device, browser, and OS
   * This is a simplified parser - use a proper library like 'ua-parser-js' in production
   */
  private parseUserAgent(userAgent: string) {
    const ua = userAgent.toLowerCase()

    // Device Type Detection
    let type = 'desktop'
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      type = 'mobile'
    } else if (/tablet|ipad|android(?!.*mobile)/i.test(ua)) {
      type = 'tablet'
    } else if (/smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv/i.test(ua)) {
      type = 'tv'
    }

    // Browser Detection
    let browser = 'unknown'
    if (ua.includes('chrome') && !ua.includes('edge')) browser = 'chrome'
    else if (ua.includes('firefox')) browser = 'firefox'
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'safari'
    else if (ua.includes('edge')) browser = 'edge'
    else if (ua.includes('opera')) browser = 'opera'
    else if (ua.includes('msie') || ua.includes('trident')) browser = 'internet_explorer'

    // OS Detection
    let os = 'unknown'
    if (ua.includes('windows')) os = 'windows'
    else if (ua.includes('mac os')) os = 'macos'
    else if (ua.includes('linux')) os = 'linux'
    else if (ua.includes('android')) os = 'android'
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'ios'

    // Additional flags
    const isBot = /bot|crawler|spider|scraper/i.test(userAgent)
    const isMobile = type === 'mobile'
    const isTablet = type === 'tablet'

    return {
      type,
      browser,
      os,
      isBot,
      isMobile,
      isTablet,
      userAgent: userAgent.substring(0, 100), // Truncate for logging
      parsed_at: new Date().toISOString()
    }
  }
}
