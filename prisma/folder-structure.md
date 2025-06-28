vocagent/
├── src/                          # Main source directory
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/            # Internationalized routes
│   │   │   ├── (auth)/          # Auth route group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/     # Protected route group
│   │   │   │   ├── dashboard/
│   │   │   │   └── profile/
│   │   │   ├── (admin)/         # Admin route group
│   │   │   │   └── admin/
│   │   │   ├── layout.tsx       # Locale layout
│   │   │   └── page.tsx         # Home page
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   └── users/
│   │   ├── globals.css
│   │   ├── layout.tsx           # Root layout
│   │   └── not-found.tsx
│   ├── components/              # Reusable components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── auth/                # Auth-specific components
│   │   │   ├── auth-button.tsx
│   │   │   ├── login-form.tsx
│   │   │   └── role-guard.tsx
│   │   ├── navigation/          # Navigation components
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── language-switcher.tsx
│   │   └── forms/               # Form components
│   ├── lib/                     # Utilities and configurations
│   │   ├── auth.ts
│   │   ├── db.ts                # Prisma client
│   │   ├── utils.ts
│   │   ├── validations.ts       # Zod schemas
│   │   └── constants.ts
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-role.ts
│   │   ├── use-auth.ts
│   │   └── use-locale.ts
│   ├── i18n/                    # Internationalization
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── config.ts
│   ├── types/                   # TypeScript type definitions
│   │   ├── next-auth.d.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   └── providers/               # Context providers
│       ├── auth-provider.tsx
│       ├── theme-provider.tsx
│       └── query-provider.tsx
├── prisma/                      # Database
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── messages/                    # Translation files
│   ├── en.json
│   └── tr.json
├── public/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
├── docs/                        # Documentation
└── config files...