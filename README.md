# 🌐 Next.js i18n Auth.js Starter

A complete example implementation of **Auth.js (NextAuth.js)** with **multi-language support**, **role-based authentication**, and **PostgreSQL + Prisma** integration.

## ✨ Features

- 🔐 **Google OAuth Authentication** with Auth.js v4
- 🌍 **Multi-language Support** (English/Turkish) with next-intl
- 👥 **Role-based Access Control** (Admin/User)
- 🗄️ **PostgreSQL Database** with Prisma ORM
- 🔒 **JWT Session Strategy** for scalable authentication
- 🛡️ **Protected Routes** with middleware
- 🎨 **Modern UI** with Tailwind CSS and Shadcn/ui
- 📱 **Responsive Design** with mobile-first approach
- 🚀 **Production Ready** with TypeScript and ESLint

## 🏗️ Architecture

```
┌─ Authentication Flow ─────────────────────────┐
│ Google OAuth → JWT Token → Role Assignment   │
│ ↓                                            │
│ Session Persistence → Middleware Protection  │
└──────────────────────────────────────────────┘

┌─ Tech Stack ──────────────────────────────────┐
│ • Next.js 15 (App Router)                    │
│ • Auth.js v4 (NextAuth.js)                   │
│ • PostgreSQL + Prisma                        │
│ • next-intl (Internationalization)           │
│ • Tailwind CSS + Shadcn/ui                   │
│ • TypeScript                                 │
└───────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

### 1. Clone and Install

```bash
git clone https://github.com/Enescyc/nextjs-i18n-authjs-starter.git
cd nextjs-i18n-authjs-starter
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL and create database
createdb nextjs_i18n_authjs_starter

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push
```

### 3. Environment Configuration

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/nextjs_i18n_authjs_starter?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-strong-randomly-generated-secret"

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin emails (comma-separated)
ADMIN_EMAILS="admin@example.com,your-email@gmail.com"
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test authentication!

## 📁 Project Structure

```
nextjs-i18n-authjs-starter/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes
│   │   ├── admin/               # Admin-only pages
│   │   ├── dashboard/           # User dashboard
│   │   └── page.tsx             # Home page
│   ├── api/auth/[...nextauth]/  # Auth.js API routes
│   └── auth/error/              # Auth error pages
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── auth-button.tsx          # Authentication button
│   ├── navigation.tsx           # Navigation with role-based links
│   └── role-guard.tsx           # Role-based access components
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Auth.js configuration
│   ├── providers.tsx            # Session provider wrapper
│   └── role-utils.ts            # Role management utilities
├── hooks/                       # Custom React hooks
│   └── use-role.ts              # Role-based logic hook
├── messages/                    # Internationalization files
│   ├── en.json                  # English translations
│   └── tr.json                  # Turkish translations
├── prisma/                      # Database schema
│   └── schema.prisma            # Prisma schema with roles
├── src/i18n/                    # i18n configuration
│   ├── routing.ts               # Locale routing
│   └── request.ts               # Request configuration
├── types/                       # TypeScript definitions
│   └── next-auth.d.ts           # Extended Auth.js types
└── middleware.ts                # Route protection middleware
```

## 🔐 Authentication Flow

### 1. User Sign-In Process

```typescript
// User clicks "Sign In with Google"
signIn('google') 
  ↓
// Google OAuth flow
Google OAuth Consent 
  ↓  
// Auth.js callbacks
jwt: (token, user) => {
  // Assign role based on ADMIN_EMAILS
  token.role = isAdmin ? 'ADMIN' : 'USER'
} 
  ↓
// Session creation
session: (session, token) => {
  session.user.role = token.role
}
  ↓
// Database storage
Prisma: User created/updated with role
  ↓
// JWT token issued
Encrypted JWT with role data
```

### 2. Route Protection

```typescript
// middleware.ts
if (pathname.includes('/admin')) {
  return token?.role === 'ADMIN'
}

if (pathname.includes('/dashboard')) {
  return !!token
}
```

### 3. Role-Based UI

```typescript
// Components automatically adapt based on role
{session.user.role === 'ADMIN' && (
  <AdminPanel />
)}
```

## 🌍 Internationalization

### Supported Languages

- 🇺🇸 English (`en`)
- 🇹🇷 Turkish (`tr`)

### URL Structure

```
/en/dashboard    # English dashboard
/tr/dashboard    # Turkish dashboard
/en/admin        # English admin panel
/tr/admin        # Turkish admin panel
```

### Adding New Languages

1. Add locale to `src/i18n/routing.ts`:
```typescript
locales: ['en', 'tr', 'es'] // Add Spanish
```

2. Create translation file `messages/es.json`:
```json
{
  "Auth": {
    "signIn": "Iniciar sesión",
    "signOut": "Cerrar sesión"
  }
}
```

## 👥 Role Management

### Default Role Assignment

Users are automatically assigned roles based on the `ADMIN_EMAILS` environment variable:

```env
ADMIN_EMAILS="admin@company.com,boss@company.com"
```

### Manual Role Management

```typescript
import { promoteToAdmin, demoteFromAdmin } from '@/lib/role-utils'

// Promote user to admin
await promoteToAdmin('user@example.com')

// Demote admin to user
await demoteFromAdmin('admin@example.com')
```

### Role-Based Components

```typescript
import { AdminOnly, AuthenticatedOnly } from '@/components/role-guard'

<AdminOnly fallback={<div>Access Denied</div>}>
  <AdminPanel />
</AdminOnly>

<AuthenticatedOnly>
  <UserDashboard />
</AuthenticatedOnly>
```

## 🗄️ Database Schema

### Core Models

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          Role      @default(USER)
  accounts      Account[]
  sessions      Session[]
}

enum Role {
  USER
  ADMIN
}
```

### Database Commands

```bash
# View data in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Apply schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 🛡️ Security Best Practices

### Environment Variables

- ✅ **NEXTAUTH_SECRET**: Cryptographically strong (generated with `openssl rand -base64 32`)
- ✅ **Database credentials**: Never commit to repository
- ✅ **OAuth secrets**: Stored securely in environment

### Authentication Security

- ✅ **JWT tokens**: Encrypted and signed
- ✅ **Session strategy**: Stateless JWT for scalability
- ✅ **Role verification**: Server-side validation
- ✅ **Protected routes**: Middleware-level protection

### Production Considerations

```env
# Production environment variables
NEXTAUTH_URL="https://yourdomain.com"
DATABASE_URL="postgresql://user:pass@prod-server:5432/db"
```

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add Environment Variables**:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAILS`

4. **Update Google OAuth**:
   - Add production callback URL: `https://yourdomain.com/api/auth/callback/google`

### Database Setup (Production)

```bash
# Apply database schema
npx prisma db push

# Or use migrations
npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **OAuthAccountNotLinked Error**
```
Solution: Ensure NEXTAUTH_SECRET is set and JWT strategy is used
```

#### 2. **Session Not Persisting**
```
Solution: Check JWT token configuration and middleware setup
```

#### 3. **Role Not Working**
```
Solution: Verify ADMIN_EMAILS environment variable format
```

#### 4. **Database Connection Error**
```
Solution: Check DATABASE_URL format and database accessibility
```

### Debug Commands

```bash
# Check environment variables
npm run build

# Test database connection
npx prisma db pull

# View logs
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Auth.js](https://authjs.dev/) - Authentication framework
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database ORM
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Shadcn/ui](https://ui.shadcn.com/) - UI components

---

## 📚 Learn More

- [Auth.js Documentation](https://authjs.dev/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

Built with ❤️ for the developer community