# 🎯 AdonisJS Middleware Learning Lab

Welcome to the ultimate AdonisJS middleware learning experience! This project demonstrates every type of middleware pattern you'll encounter in real-world applications.

## 🧠 What You'll Learn

### 📋 Middleware Types
- **Global Middleware** - Runs on every request
- **Named Middleware** - Reusable with aliases  
- **Route-specific Middleware** - Applied to specific routes
- **Parameterized Middleware** - Configurable middleware
- **Multiple Middleware Chains** - Combining middleware

### ⚡ Before vs After Request Processing
- **Before Request** - Authentication, validation, rate limiting
- **After Request** - Response transformation, logging, cleanup

## 🚀 Getting Started

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Visit the overview:**
   ```bash
   curl http://localhost:3333/
   ```

## 🧪 Testing Each Middleware Pattern

### 1. 🌍 Global Middleware (Runs on ALL requests)

**What it does:** Every request gets logged, security headers, and CORS handling.

```bash
# Any request will trigger global middleware
curl http://localhost:3333/demo/public

# Check the terminal logs to see:
# - 📥 Request logging (before)
# - 🛡️ Security headers (after)
# - 🌍 CORS headers (after)
```

### 2. 🔐 Authentication Middleware

**What it does:** Validates tokens and injects user context.

```bash
# ❌ Without token (will fail)
curl http://localhost:3333/demo/protected

# ✅ With valid token
curl -H "Authorization: Bearer user-token-123" http://localhost:3333/demo/protected

# Available tokens:
# - user-token-123 (regular user)
# - admin-token-456 (admin user)
# - demo-token-789 (demo user)
```

### 3. 👑 Admin Authorization Middleware

**What it does:** Requires admin role after authentication.

```bash
# ❌ With user token (will fail - not admin)
curl -H "Authorization: Bearer user-token-123" http://localhost:3333/demo/admin

# ✅ With admin token
curl -H "Authorization: Bearer admin-token-456" http://localhost:3333/demo/admin
```

### 4. 🚦 Rate Limiting Middleware

**What it does:** Limits requests per time window.

```bash
# Test strict rate limiting (10 requests/minute)
for i in {1..15}; do
  echo "Request $i:"
  curl http://localhost:3333/demo/rate-limited
  echo "\\n"
done

# Watch the logs to see:
# - ✅ First 10 requests succeed
# - ❌ 11th+ requests get 429 status
```

### 5. 📱 Device Detection Middleware

**What it does:** Analyzes user agent and optimizes response.

```bash
# Desktop request
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \\
     http://localhost:3333/demo/device

# Mobile request  
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" \\
     http://localhost:3333/demo/device

# Check response headers for device info
```

### 6. 🚩 Feature Flag Middleware

**What it does:** Controls feature access with rollout percentages.

```bash
# ✅ Enabled feature (100% rollout)
curl http://localhost:3333/demo/beta

# ❌ Disabled feature (0% rollout)
curl http://localhost:3333/demo/experimental

# Note: 50% rollout means ~50% of requests succeed based on IP hash
```

### 7. 🎯 Multiple Middleware Chains

**What it does:** Combines multiple middleware in sequence.

```bash
# This endpoint uses: Auth + Device Detection + Feature Flag
curl -H "Authorization: Bearer user-token-123" \\
     -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" \\
     http://localhost:3333/demo/multiple
```

### 8. 🔄 Response Transformation

**What it does:** Enriches responses with metadata and error handling.

```bash
# Normal response transformation
curl http://localhost:3333/demo/transform

# Error handling transformation
curl http://localhost:3333/demo/error
```

### 9. 📝 POST Requests with Middleware

**What it does:** Shows middleware on data creation endpoints.

```bash
# Create data with authentication and rate limiting
curl -X POST \\
     -H "Authorization: Bearer user-token-123" \\
     -H "Content-Type: application/json" \\
     -d '{"title": "Test Post", "content": "Hello middleware!"}' \\
     http://localhost:3333/demo/create
```

### 10. 💎 Premium Features (Group Middleware)

**What it does:** Shows route group middleware application.

```bash
# Premium dashboard (requires auth + premium feature)
curl -H "Authorization: Bearer user-token-123" \\
     http://localhost:3333/premium/dashboard
```

## 🔍 Understanding Middleware Flow

### Execution Order Example:
```
Request → Global Middleware → Named Middleware → Route Handler → Response

1. RequestLogger (before) 📥
2. CORS (before) ✈️
3. SecurityHeaders (pass-through)
4. Auth (before) 🔐
5. DeviceDetector (before) 📱
6. → Route Handler Executes 🎯
7. DeviceDetector (after) 📱
8. Auth (after) 🔐
9. SecurityHeaders (after) 🛡️
10. CORS (after) 🌍
11. RequestLogger (after) 📤
```

## 💡 Key Concepts Demonstrated

### 1. **Before Request Processing:**
- Input validation
- Authentication checks
- Rate limiting
- Feature flag verification

### 2. **After Request Processing:**
- Response transformation
- Header addition
- Logging completion
- Performance measurement

### 3. **Early Termination:**
- Auth failures stop execution
- Rate limit exceeded
- Feature flags disabled

### 4. **Context Injection:**
- User data from Auth
- Device info from DeviceDetector
- Request metadata from ResponseTransformer

### 5. **Error Handling:**
- Graceful error responses
- Error logging and tracking
- Request ID correlation

## 🎓 Advanced Patterns

### Middleware with Parameters:
```typescript
// In routes.ts
.middleware('rateLimit:strict')      // Parameter: 'strict'
.middleware('feature:beta-features') // Parameter: 'beta-features'
```

### Multiple Middleware Array:
```typescript
// Multiple middleware in sequence
.middleware(['auth', 'admin', 'transform'])
```

### Route Group Middleware:
```typescript
// Applied to all routes in the group
Route.group(() => { ... }).middleware(['auth'])
```

## 🚀 Next Steps

1. **Modify middleware parameters** in the classes
2. **Add new named middleware** to `start/kernel.ts`
3. **Create route-specific middleware** for special cases
4. **Experiment with middleware order** and see how it affects execution

## 📊 Production Considerations

- Use **Redis** for rate limiting storage
- Implement **proper JWT validation** in Auth middleware  
- Add **database queries** for user lookup
- Use **proper logging services** instead of console.log
- Implement **circuit breakers** for external service calls
- Add **monitoring and metrics** collection

Happy middleware learning! 🎉
