import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Admin Authorization Middleware
 * 
 * This NAMED middleware demonstrates:
 * - Role-based authorization
 * - Dependency on Auth middleware (must run after Auth)
 * - Accessing user context from previous middleware
 * - Admin-only route protection
 */
export default class Admin {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const { request, response } = ctx

    console.log('👑 Admin middleware: Checking admin authorization...')

    // 🔍 BEFORE REQUEST - Check if user exists in context (from Auth middleware)
    const user = request.ctx?.user

    if (!user) {
      console.log('❌ Admin middleware: No user in context (Auth middleware must run first)')
      return response.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated before checking admin access',
        hint: 'Make sure Auth middleware runs before Admin middleware'
      })
    }

    // 👑 Check if user has admin role
    if (user.role !== 'admin') {
      console.log(`❌ Admin middleware: Access denied for user ${user.name} (role: ${user.role})`)
      return response.status(403).json({
        error: 'Insufficient privileges',
        message: 'Admin access required',
        user: {
          name: user.name,
          role: user.role,
          requiredRole: 'admin'
        }
      })
    }

    console.log(`✅ Admin middleware: Admin access granted for ${user.name}`)

    // 📊 Add admin context data
    request.ctx = {
      ...request.ctx,
      isAdmin: true,
      adminPermissions: [
        'read_all_users',
        'delete_users',
        'modify_system_settings',
        'view_analytics'
      ]
    }

    // ⏭️ Continue to next middleware/route
    await next()

    // 📝 AFTER REQUEST - Log admin action completion
    console.log('👑 Admin middleware: Admin action completed successfully')
  }
}
