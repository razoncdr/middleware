/*
|--------------------------------------------------------------------------
| Session Manager Middleware
|--------------------------------------------------------------------------
|
| This middleware demonstrates comprehensive session management in AdonisJS:
| - Creating and managing session data
| - Flash messages (data that persists for one request)
| - Session security and regeneration
| - User authentication state
| - Shopping cart session management
| - Session lifecycle management
|
*/

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionManager {
  public async handle({ request, response, session }: HttpContextContract, next: () => Promise<void>) {
    console.log('💾 Session Manager Middleware - Processing Request')

    // Get current session ID and check if session exists
    const sessionId = session.sessionId
    console.log('🆔 Session ID:', sessionId)

    // Demonstrate different session operations based on route
    const route = request.url()

    if (route.includes('/demo/sessions/init')) {
      // Initialize user session
      session.put('user', {
        id: Math.floor(Math.random() * 1000) + 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        loginTime: new Date().toISOString(),
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true
        }
      })

      // Initialize visit tracking
      const visitCount = session.get('visit_count', 0) + 1
      session.put('visit_count', visitCount)
      session.put('last_visit', new Date().toISOString())

      console.log('✅ Initialized user session')

    } else if (route.includes('/demo/sessions/shopping-cart')) {
      // Session-based shopping cart
      let cart = session.get('cart', [])
      
      // Add random item to cart
      const newItem = {
        id: Date.now(),
        name: `Session Product ${Math.floor(Math.random() * 100)}`,
        price: Math.floor(Math.random() * 100) + 10,
        quantity: 1,
        addedAt: new Date().toISOString()
      }
      
      cart.push(newItem)
      session.put('cart', cart)
      session.put('cart_updated_at', new Date().toISOString())

      // Flash message for next request
      session.flash('cart_message', `Added ${newItem.name} to your cart!`)
      
      console.log('🛒 Added item to session cart:', newItem.name)

    } else if (route.includes('/demo/sessions/flash')) {
      // Flash message examples
      session.flash('success', 'Operation completed successfully!')
      session.flash('info', 'This is an informational message')
      session.flash('warning', 'This is a warning message')
      session.flash('error', 'This is an error message')
      
      console.log('⚡ Set flash messages for next request')

    } else if (route.includes('/demo/sessions/update-preferences')) {
      // Update user preferences
      const user = session.get('user')
      if (user) {
        user.preferences = {
          ...user.preferences,
          theme: user.preferences?.theme === 'dark' ? 'light' : 'dark',
          lastUpdated: new Date().toISOString()
        }
        session.put('user', user)
        session.flash('success', 'Preferences updated successfully!')
        
        console.log('⚙️ Updated user preferences')
      } else {
        session.flash('error', 'No user session found')
      }

    } else if (route.includes('/demo/sessions/regenerate')) {
      // Regenerate session ID for security (e.g., after login)
      await session.regenerate()
      session.flash('info', 'Session regenerated for security')
      
      console.log('🔄 Regenerated session ID for security')

    } else if (route.includes('/demo/sessions/clear-cart')) {
      // Clear shopping cart
      session.forget('cart')
      session.forget('cart_updated_at')
      session.flash('success', 'Shopping cart cleared')
      
      console.log('🧹 Cleared shopping cart from session')

    } else if (route.includes('/demo/sessions/logout')) {
      // Clear user session (logout)
      session.forget('user')
      session.forget('visit_count')
      session.forget('last_visit')
      session.forget('cart')
      session.forget('cart_updated_at')
      session.flash('info', 'You have been logged out')
      
      console.log('🚪 User logged out - cleared session data')

    } else if (route.includes('/demo/sessions/destroy')) {
      // Completely destroy session
      await session.clear()
      console.log('💥 Session completely destroyed')
    }

    // Add session information to request for use in controller
    const sessionData = {
      id: sessionId,
      user: session.get('user'),
      visitCount: session.get('visit_count', 0),
      lastVisit: session.get('last_visit'),
      cartItems: session.get('cart', []).length,
      flashMessages: {
        success: session.flashMessages.get('success'),
        info: session.flashMessages.get('info'),
        warning: session.flashMessages.get('warning'),
        error: session.flashMessages.get('error'),
        cart_message: session.flashMessages.get('cart_message')
      }
    }

    request['sessionInfo'] = sessionData

    await next()
  }
}
