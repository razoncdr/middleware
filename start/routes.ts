/*
|--------------------------------------------------------------------------
| Middleware Demo Routes
|--------------------------------------------------------------------------
|
| This file demonstrates all types of AdonisJS middleware patterns:
| - Global Middleware (runs on every request)
| - Named Middleware (applied to specific routes)
| - Multiple Middleware (chaining middleware)
| - Parameterized Middleware (middleware with configuration)
|
*/

import Route from '@ioc:Adonis/Core/Route'

// 🏠 Welcome Route - Shows middleware overview
Route.get('/', async ({ response }) => {
  return response.json({
    message: '🎯 AdonisJS Middleware Learning Lab',
    description: 'Explore different middleware patterns and use cases',
    available_endpoints: {
      public: {
        path: '/demo/public',
        description: 'Only global middleware',
        middleware: ['RequestLogger', 'CORS', 'SecurityHeaders']
      },
      protected: {
        path: '/demo/protected',
        description: 'Requires authentication',
        middleware: ['Global middleware', 'Auth']
      },
      admin: {
        path: '/demo/admin',
        description: 'Admin-only access',
        middleware: ['Global middleware', 'Auth', 'Admin']
      },
      rate_limited: {
        path: '/demo/rate-limited',
        description: 'Strict rate limiting (10/min)',
        middleware: ['Global middleware', 'RateLimit:strict']
      },
      beta: {
        path: '/demo/beta',
        description: 'Beta feature (50% rollout)',
        middleware: ['Global middleware', 'FeatureFlag:beta-features']
      },
      device_aware: {
        path: '/demo/device',
        description: 'Device detection and optimization',
        middleware: ['Global middleware', 'DeviceDetector']
      },
      multiple: {
        path: '/demo/multiple',
        description: 'Multiple middleware chaining',
        middleware: ['Global middleware', 'Auth', 'DeviceDetector', 'FeatureFlag']
      }
    },
    authentication_tokens: {
      user: 'user-token-123',
      admin: 'admin-token-456',
      demo: 'demo-token-789'
    },
    usage_examples: {
      curl_auth: 'curl -H "Authorization: Bearer user-token-123" http://localhost:3333/demo/protected',
      curl_admin: 'curl -H "Authorization: Bearer admin-token-456" http://localhost:3333/demo/admin',
      postman_tip: 'Add Authorization header with Bearer token'
    }
  })
}).as('home')

/*
|--------------------------------------------------------------------------
| Demo Routes - Various Middleware Patterns
|--------------------------------------------------------------------------
*/

// 🌍 PUBLIC - Only Global Middleware
Route.get('/demo/public', 'DemoController.public')
  .as('demo.public')

// 🔐 PROTECTED - Authentication Required
Route.get('/demo/protected', 'DemoController.protected')
  .middleware('auth')
  .as('demo.protected')

// 👑 ADMIN - Authentication + Admin Authorization
Route.get('/demo/admin', 'DemoController.admin')
  .middleware(['auth', 'admin'])
  .as('demo.admin')

// 🚦 RATE LIMITED - Strict Rate Limiting (10 requests/minute)
Route.get('/demo/rate-limited', 'DemoController.rateLimited')
  .middleware('rateLimit:strict')
  .as('demo.rateLimited')

// 🚩 BETA FEATURE - Feature Flag (50% rollout)
Route.get('/demo/beta', 'DemoController.betaFeature')
  .middleware('feature:beta-features')
  .as('demo.beta')

// 📱 DEVICE AWARE - Device Detection
Route.get('/demo/device', 'DemoController.deviceAware')
  .middleware('device')
  .as('demo.device')

// 🎯 MULTIPLE MIDDLEWARE - Chaining Multiple Middleware
Route.get('/demo/multiple', 'DemoController.multipleMiddleware')
  .middleware(['auth', 'device', 'feature:new-api'])
  .as('demo.multiple')

// 🔄 RESPONSE TRANSFORMATION - Advanced Processing
Route.get('/demo/transform', 'DemoController.public')
  .middleware('transform')
  .as('demo.transform')

/*
|--------------------------------------------------------------------------
| POST Routes - Testing Different Scenarios
|--------------------------------------------------------------------------
*/

// 📝 CREATE DATA - Protected POST with Rate Limiting
Route.post('/demo/create', 'DemoController.create')
  .middleware(['auth', 'rateLimit:default'])
  .as('demo.create')

// 👑 ADMIN CREATE - Admin-only Creation
Route.post('/demo/admin/create', 'DemoController.create')
  .middleware(['auth', 'admin', 'transform'])
  .as('demo.admin.create')

/*
|--------------------------------------------------------------------------
| Premium Features - Complex Middleware Chains
|--------------------------------------------------------------------------
*/

// 💎 PREMIUM - Authentication + Premium Feature Flag
Route.group(() => {
  Route.get('/dashboard', 'DemoController.multipleMiddleware').as('dashboard')
  Route.get('/analytics', 'DemoController.admin').as('analytics')
  Route.post('/settings', 'DemoController.create').as('settings')
})
.prefix('/premium')
.middleware(['auth', 'feature:premium-features', 'transform'])
.as('premium')

/*
|--------------------------------------------------------------------------
| Testing Routes - Error Handling & Edge Cases
|--------------------------------------------------------------------------
*/

// 💥 ERROR HANDLING - Test Error Middleware
Route.get('/demo/error', 'DemoController.error')
  .middleware('transform')
  .as('demo.error')

// 🔒 EXPERIMENTAL - Disabled Feature Flag
Route.get('/demo/experimental', 'DemoController.betaFeature')
  .middleware('feature:experimental')
  .as('demo.experimental')

/*
|--------------------------------------------------------------------------
| API Routes - Different Rate Limits
|--------------------------------------------------------------------------
*/

Route.group(() => {
  // Generous rate limit for basic API
  Route.get('/data', 'DemoController.public').middleware('rateLimit:generous').as('data')
  
  // Default rate limit for standard API
  Route.get('/users', 'DemoController.protected').middleware(['auth', 'rateLimit:default']).as('users')
  
  // Strict rate limit for intensive operations
  Route.post('/process', 'DemoController.create').middleware(['auth', 'rateLimit:strict']).as('process')
})
.prefix('/api/v1')
.middleware(['transform']) // Apply to all routes in group
.as('api')
