/*
|--------------------------------------------------------------------------
| Cookie & Session Demo Controller
|--------------------------------------------------------------------------
|
| This controller demonstrates practical use cases for cookies and sessions:
| - User preferences management
| - Shopping cart functionality
| - Authentication state
| - Visit tracking and analytics
| - Flash messages for user feedback
|
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CookieSessionController {
  
  private getAllCookies(request) {
    try {
      if (typeof request.cookies === 'function') {
        return request.cookies()
      } else {
        // Fallback - parse manually from header
        const cookieHeader = request.header('cookie')
        if (cookieHeader) {
          return this.parseCookies(cookieHeader)
        }
      }
    } catch (error) {
      console.log('Cookie access error:', error.message)
    }
    return {}
  }

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
  
  /**
   * 🏠 Overview of all cookie and session demos
   */
  public async index({ response }: HttpContextContract) {
    return response.json({
      message: '🍪💾 Cookie & Session Learning Lab',
      description: 'Learn cookies and sessions with practical examples',
      learning_objectives: {
        cookies: [
          'Understanding client-side storage',
          'Cookie security options (httpOnly, secure, sameSite)',
          'Cookie lifecycle and expiration',
          'Cookie size limitations and best practices'
        ],
        sessions: [
          'Server-side data storage',
          'Session lifecycle management',
          'Flash messages and temporary data',
          'Session security and regeneration'
        ]
      },
      cookie_endpoints: {
        basic: '/demo/cookies/set-basic - Set basic preference cookie',
        secure: '/demo/cookies/set-secure - Set secure authentication cookie',
        tracking: '/demo/cookies/set-tracking - Set tracking cookies',
        cart: '/demo/cookies/shopping-cart - Cookie-based cart',
        clear: '/demo/cookies/clear - Clear cookies',
        clearAuth: '/demo/cookies/clear-auth - Clear auth cookies',
        read: '/demo/cookies/read - Read all cookies'
      },
      session_endpoints: {
        init: '/demo/sessions/init - Initialize user session',
        cart: '/demo/sessions/shopping-cart - Session-based cart',
        flash: '/demo/sessions/flash - Flash messages demo',
        preferences: '/demo/sessions/update-preferences - Update user preferences',
        regenerate: '/demo/sessions/regenerate - Regenerate session ID',
        clearCart: '/demo/sessions/clear-cart - Clear session cart',
        logout: '/demo/sessions/logout - Logout (clear user data)',
        destroy: '/demo/sessions/destroy - Destroy entire session',
        read: '/demo/sessions/read - Read session data'
      },
      comparison_endpoint: '/demo/cookies-vs-sessions - Compare both approaches',
      security_tips: {
        cookies: [
          'Use httpOnly for sensitive data to prevent XSS',
          'Use secure flag for HTTPS-only cookies',
          'Use sameSite for CSRF protection',
          'Sign cookies for integrity verification',
          'Keep cookie size under 4KB'
        ],
        sessions: [
          'Regenerate session ID after authentication',
          'Use proper session storage (not memory in production)',
          'Set appropriate session timeouts',
          'Clear sensitive session data on logout',
          'Use HTTPS to protect session cookies'
        ]
      }
    })
  }

  /**
   * 🍪 Cookie Operations Demo
   */
  public async cookiesDemo({ request, response }: HttpContextContract) {
    const cookieInfo = request['cookieInfo'] || {}
    
    return response.json({
      message: '🍪 Cookie Management Demo',
      operation: 'Cookie operation completed',
      cookie_information: {
        total_cookies: cookieInfo.totalCookies || 0,
        cookie_names: cookieInfo.cookieNames || [],
        cookie_sizes: cookieInfo.cookiesSizes || [],
        total_size: cookieInfo.cookiesSizes?.reduce((sum, cookie) => sum + cookie.size, 0) || 0
      },
      all_cookies: this.getAllCookies(request),
      specific_cookies: {
        user_preference: request.cookie('user_preference'),
        visit_count: request.cookie('visit_count'),
        last_visit: request.cookie('last_visit'),
        shopping_cart: request.cookie('shopping_cart'),
        auth_token: request.cookie('auth_token') ? '[HIDDEN FOR SECURITY]' : null
      },
      cookie_facts: {
        max_size: '4KB per cookie',
        max_cookies_per_domain: '~50-300 (browser dependent)',
        sent_with_requests: 'All matching cookies sent with every HTTP request',
        client_access: 'Accessible via JavaScript (unless httpOnly)',
        security: 'Can be secured with httpOnly, secure, sameSite flags'
      },
      next_steps: [
        'Check browser developer tools to see cookies',
        'Try different routes to see cookie changes',
        'Compare with session-based approach'
      ]
    })
  }

  /**
   * 💾 Session Operations Demo
   */
  public async sessionsDemo({ request, response }: HttpContextContract) {
    const sessionInfo = request['sessionInfo'] || {}
    
    return response.json({
      message: '💾 Session Management Demo',
      operation: 'Session operation completed',
      session_information: {
        session_id: sessionInfo.id,
        visit_count: sessionInfo.visitCount,
        last_visit: sessionInfo.lastVisit,
        cart_items_count: sessionInfo.cartItems,
        user_authenticated: !!sessionInfo.user,
        user_data: sessionInfo.user ? {
          id: sessionInfo.user.id,
          name: sessionInfo.user.name,
          email: sessionInfo.user.email,
          role: sessionInfo.user.role,
          theme: sessionInfo.user.preferences?.theme,
          login_time: sessionInfo.user.loginTime
        } : null
      },
      flash_messages: sessionInfo.flashMessages || {},
      session_facts: {
        storage: 'Server-side storage (file, database, memory, Redis)',
        identification: 'Session ID stored in cookie',
        size_limit: 'No practical size limit (depends on storage)',
        security: 'Data not accessible to client-side JavaScript',
        lifecycle: 'Persists until expiry or manual cleanup'
      },
      advantages_over_cookies: [
        'More secure (server-side storage)',
        'No size limitations',
        'Not sent with every request (only session ID)',
        'Cannot be tampered with by client',
        'Better for sensitive data'
      ]
    })
  }

  /**
   * ⚖️ Cookie vs Session Comparison
   */
  public async compareApproaches({ request, response, session }: HttpContextContract) {
    // Get cookie data
    const cookieCart = request.cookie('shopping_cart', '[]')
    let cookieParsedCart = []
    try {
      cookieParsedCart = JSON.parse(cookieCart)
    } catch (e) {
      cookieParsedCart = []
    }

    // Get session data
    const sessionCart = session.get('cart', [])
    const user = session.get('user')

    return response.json({
      message: '⚖️ Cookie vs Session Comparison',
      comparison: {
        storage_location: {
          cookies: 'Client-side (browser)',
          sessions: 'Server-side (file/database/memory)'
        },
        data_transmission: {
          cookies: 'Sent with every HTTP request to domain',
          sessions: 'Only session ID sent (usually in cookie)'
        },
        size_limits: {
          cookies: '4KB per cookie, ~50-300 cookies per domain',
          sessions: 'Limited by server storage capacity'
        },
        security: {
          cookies: 'Visible to client, can be secured with flags',
          sessions: 'Hidden from client, more secure'
        },
        javascript_access: {
          cookies: 'Accessible via document.cookie (unless httpOnly)',
          sessions: 'Not directly accessible from client-side'
        },
        persistence: {
          cookies: 'Until expiry date or browser closure',
          sessions: 'Until server cleanup or manual destruction'
        },
        performance: {
          cookies: 'Increases request size, processed on every request',
          sessions: 'Minimal request overhead, server memory usage'
        }
      },
      current_data_comparison: {
        cookie_shopping_cart: {
          items: cookieParsedCart,
          total_items: cookieParsedCart.length,
          storage_method: 'Browser cookie',
          accessible_to_js: true
        },
        session_shopping_cart: {
          items: sessionCart,
          total_items: sessionCart.length,
          storage_method: 'Server session',
          accessible_to_js: false
        },
        session_user_data: user ? {
          stored: true,
          method: 'Server session only',
          security: 'High - not accessible from client'
        } : {
          stored: false,
          note: 'Visit /demo/sessions/init to create session'
        }
      },
      use_cases: {
        prefer_cookies: [
          'User preferences (theme, language)',
          'Non-sensitive tracking data',
          'Small data that needs client-side access',
          'Data that should persist across sessions'
        ],
        prefer_sessions: [
          'Authentication state',
          'Sensitive user data',
          'Large datasets (shopping cart with many items)',
          'Temporary data (flash messages)',
          'Server-side processing data'
        ]
      },
      best_practices: {
        hybrid_approach: 'Use both - cookies for preferences, sessions for sensitive data',
        security_first: 'Never store sensitive data in cookies',
        performance_consideration: 'Consider request size impact of cookies',
        user_experience: 'Flash messages work best with sessions'
      }
    })
  }

  /**
   * 🛒 Shopping Cart Demo (showing both approaches)
   */
  public async shoppingCartDemo({ request, response, session }: HttpContextContract) {
    // Cookie-based cart
    const cookieCart = request.cookie('shopping_cart', '[]')
    let cookieParsedCart = []
    try {
      cookieParsedCart = JSON.parse(cookieCart)
    } catch (e) {
      cookieParsedCart = []
    }

    // Session-based cart
    const sessionCart = session.get('cart', [])

    return response.json({
      message: '🛒 Shopping Cart Comparison Demo',
      cookie_based_cart: {
        items: cookieParsedCart,
        total_items: cookieParsedCart.length,
        total_value: cookieParsedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        storage: 'Client-side cookie',
        pros: [
          'Persists across browser sessions',
          'No server storage required',
          'Accessible to client-side JavaScript'
        ],
        cons: [
          'Size limited to ~4KB',
          'Sent with every request',
          'Can be tampered with by user',
          'Visible in browser dev tools'
        ]
      },
      session_based_cart: {
        items: sessionCart,
        total_items: sessionCart.length,
        total_value: sessionCart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        storage: 'Server-side session',
        pros: [
          'No size limitations',
          'Secure from client tampering',
          'Only session ID transmitted',
          'Can store complex objects'
        ],
        cons: [
          'Requires server storage',
          'Lost if session expires',
          'Not accessible to client JavaScript',
          'Requires server resources'
        ]
      },
      recommendations: {
        small_carts: 'Cookie-based for simplicity and persistence',
        large_carts: 'Session-based for complex data and security',
        hybrid: 'Store cart ID in cookie, full cart data in session/database',
        enterprise: 'Database-backed with session tracking'
      },
      demo_actions: {
        add_to_cookie_cart: 'GET /demo/cookies/shopping-cart',
        add_to_session_cart: 'GET /demo/sessions/shopping-cart',
        clear_cookie_cart: 'GET /demo/cookies/clear',
        clear_session_cart: 'GET /demo/sessions/clear-cart'
      }
    })
  }

  /**
   * ⚡ Flash Messages Demo
   */
  public async flashMessagesDemo({ response, session }: HttpContextContract) {
    // Flash messages are automatically cleared after being read
    const messages = {
      success: session.flashMessages.get('success'),
      info: session.flashMessages.get('info'),
      warning: session.flashMessages.get('warning'),
      error: session.flashMessages.get('error'),
      cart_message: session.flashMessages.get('cart_message')
    }

    return response.json({
      message: '⚡ Flash Messages Demo',
      description: 'Flash messages are temporary messages that persist for exactly one request',
      flash_messages: messages,
      how_it_works: [
        '1. Flash message is set in session',
        '2. Message persists until next request',
        '3. Message is automatically deleted after being read',
        '4. Perfect for user feedback after form submissions'
      ],
      common_use_cases: [
        'Success messages after form submission',
        'Error messages for validation failures',
        'Information messages for user guidance',
        'Shopping cart notifications'
      ],
      demo_instructions: [
        'Visit /demo/sessions/flash to set flash messages',
        'Then visit this endpoint to see and consume them',
        'Refresh this page - messages will be gone!'
      ],
      note: messages.success || messages.info || messages.warning || messages.error || messages.cart_message 
        ? 'Flash messages displayed above will be gone on next request!' 
        : 'No flash messages found. Visit /demo/sessions/flash first!'
    })
  }
}
