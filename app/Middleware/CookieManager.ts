/*
|--------------------------------------------------------------------------
| Cookie Manager Middleware
|--------------------------------------------------------------------------
|
| This middleware demonstrates comprehensive cookie management in AdonisJS:
| - Setting cookies with various options (httpOnly, secure, sameSite, etc.)
| - Reading existing cookies
| - Modifying and deleting cookies
| - Cookie security best practices
| - Different use cases (preferences, tracking, authentication tokens)
|
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CookieManager {
  private parseCookies(cookieString: string): Record<string, string> {
    const cookies: Record<string, string> = {}
    if (cookieString) {
      cookieString.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=')
        if (name && value) {
          cookies[name] = decodeURIComponent(value)
        }
      })
    }
    return cookies
  }

  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    console.log('🍪 Cookie Manager Middleware - Processing Request')

    // Read all existing cookies - try different approaches
    let allCookies = {}
    try {
      // Try the standard way
      if (typeof request.cookies === 'function') {
        allCookies = request.cookies()
      } else {
        // Fallback - parse from headers
        const cookieHeader = request.header('cookie')
        if (cookieHeader) {
          allCookies = this.parseCookies(cookieHeader)
        }
      }
    } catch (error) {
      console.log('Cookie parsing error:', error.message)
      allCookies = {}
    }
    console.log('📖 Existing cookies:', allCookies)

    // Demonstrate different cookie operations based on route
    const route = request.url()

    if (route.includes('/demo/cookies/set-basic')) {
      // Basic cookie setting
      response.cookie('user_preference', 'dark_mode', {
        maxAge: '7d', // 7 days
        httpOnly: false, // Allow JavaScript access
        path: '/',
      })
      console.log('✅ Set basic preference cookie')

    } else if (route.includes('/demo/cookies/set-secure')) {
      // Secure cookie with all security options
      response.cookie('auth_token', 'secure_token_12345', {
        httpOnly: true,     // Prevent XSS attacks
        secure: true,       // HTTPS only (will be ignored in development)
        sameSite: 'strict', // CSRF protection
        maxAge: '1h',       // 1 hour expiry
        path: '/',
        signed: true,       // Sign the cookie for integrity
      })
      console.log('🔐 Set secure authentication cookie')

    } else if (route.includes('/demo/cookies/set-tracking')) {
      // Tracking cookie with longer expiry
      const visitCount = parseInt(request.cookie('visit_count', '0')) + 1
      response.cookie('visit_count', visitCount.toString(), {
        maxAge: '30d', // 30 days
        httpOnly: false,
        path: '/',
      })

      // Set last visit timestamp
      response.cookie('last_visit', new Date().toISOString(), {
        maxAge: '30d',
        httpOnly: false,
        path: '/',
      })
      console.log(`📊 Updated visit count to: ${visitCount}`)

    } else if (route.includes('/demo/cookies/shopping-cart')) {
      // Shopping cart cookie (JSON data)
      const existingCart = request.cookie('shopping_cart', '[]')
      let cart = []
      
      try {
        cart = JSON.parse(existingCart)
      } catch (error) {
        cart = []
      }

      // Simulate adding an item
      const newItem = {
        id: Date.now(),
        name: `Product ${Date.now()}`,
        price: Math.floor(Math.random() * 100) + 10,
        quantity: 1
      }
      cart.push(newItem)

      response.cookie('shopping_cart', JSON.stringify(cart), {
        maxAge: '7d',
        httpOnly: false, // Allow frontend JavaScript to read
        path: '/',
      })
      console.log('🛒 Updated shopping cart:', newItem)

    } else if (route.includes('/demo/cookies/clear')) {
      // Clear specific cookies
      response.clearCookie('user_preference')
      response.clearCookie('visit_count')
      response.clearCookie('last_visit')
      response.clearCookie('shopping_cart')
      console.log('🧹 Cleared cookies')

    } else if (route.includes('/demo/cookies/clear-auth')) {
      // Clear authentication cookies
      response.clearCookie('auth_token')
      console.log('🚪 Cleared authentication cookies')
    }

    // Add cookie information to request for use in controller
    request['cookieInfo'] = {
      totalCookies: Object.keys(allCookies).length,
      cookieNames: Object.keys(allCookies),
      cookiesSizes: Object.entries(allCookies).map(([key, value]) => ({
        name: key,
        size: `${key}=${value}`.length
      }))
    }

    await next()
  }
}
