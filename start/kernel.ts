/*
|--------------------------------------------------------------------------
| Application middleware
|--------------------------------------------------------------------------
|
| This file is used to define middleware for HTTP requests. You can register
| middleware as a `closure` or an IoC container binding. The bindings are
| preferred, since they keep this file clean.
|
*/

import Server from '@ioc:Adonis/Core/Server'

/*
|--------------------------------------------------------------------------
| Global middleware
|--------------------------------------------------------------------------
|
| An array of global middleware, that will be executed in the order they
| are defined for every HTTP requests.
|
| 🌍 These run on EVERY request in the specified order:
| 1. RequestLogger - Logs all requests with timing
| 2. CORS - Handles cross-origin requests
| 3. SecurityHeaders - Adds security headers
| 4. BodyParser - Parses request bodies (built-in)
|
*/
Server.middleware.register([
  () => import('App/Middleware/RequestLogger'),     // 📝 Log every request
  () => import('App/Middleware/Cors'),              // 🌍 Handle CORS
  () => import('App/Middleware/SecurityHeaders'),   // 🛡️ Add security headers
  () => import('@ioc:Adonis/Core/BodyParser'),      // 📦 Parse request bodies
])

/*
|--------------------------------------------------------------------------
| Named middleware
|--------------------------------------------------------------------------
|
| Named middleware are defined as key-value pair. The value is the namespace
| or middleware function and key is the alias. Later you can use these
| alias on individual routes. For example:
|
| Route.get('dashboard', 'UserController.dashboard').middleware('auth')
| Route.get('admin', 'AdminController.index').middleware(['auth', 'admin'])
| Route.get('api/data', 'DataController.index').middleware('rateLimit:strict')
|
| 🏷️ Available Named Middleware:
| - auth: Authentication (token validation)
| - admin: Admin authorization (requires auth)
| - rateLimit: Rate limiting (configurable)
| - device: Device detection
| - transform: Response transformation
| - feature: Feature flag checking
|
*/
Server.middleware.registerNamed({
  // 🔐 Authentication & Authorization
  auth: () => import('App/Middleware/Auth'),
  admin: () => import('App/Middleware/Admin'),
  
  // 🚦 Rate Limiting & Throttling
  rateLimit: () => import('App/Middleware/RateLimit'),
  
  // 📱 Request Enhancement
  device: () => import('App/Middleware/DeviceDetector'),
  
  // 🔄 Response Processing
  transform: () => import('App/Middleware/ResponseTransformer'),
  
  // 🚩 Feature Management
  feature: () => import('App/Middleware/FeatureFlag'),
  
  // 🍪 Cookie & Session Management
  cookies: () => import('App/Middleware/CookieManager'),
  sessions: () => import('App/Middleware/SessionManager'),
})
