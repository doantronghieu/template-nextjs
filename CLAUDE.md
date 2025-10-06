# Project Configuration

## UI Framework
- **shadcn/ui**: Component library integrated with Tailwind CSS v4
- **Style**: New York variant with CSS variables
- **Icon Library**: Lucide React
- **Component Path**: `@/components/ui`

## Authentication
- **Clerk**: Authentication and user management using `@clerk/nextjs`
- Middleware: `src/middleware.ts` with `clerkMiddleware()` (App Router)
- Provider: `<ClerkProvider>` wraps app in `src/app/layout.tsx`
- Components: `<SignInButton>`, `<SignUpButton>`, `<UserButton>`, `<SignedIn>`, `<SignedOut>`
- Environment: Requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local`

## State Management
- **TanStack Query**: Server state management (queries/mutations)
- **Zustand**: Client state management (hooks-based, no providers needed)

## Data Fetching
- TanStack Query configured in `@/providers/query-provider` with 60s stale time
- Store pattern: `src/stores/*.ts` for Zustand stores

## Adding Components
```bash
pnpm dlx shadcn@latest add <component-name>
```

## Validation
- **Zod**: TypeScript-first schema validation with type inference
- Utilities: `@/lib/zod` (common patterns, response schemas, safeParse helper)
- Schemas: `src/schemas/*.schema.ts` for domain schemas

## Forms
- **React Hook Form**: Form state management with `@hookform/resolvers/zod` for Zod integration
- **shadcn/ui Form**: Accessible form components with built-in error handling
- Pattern: `useForm<T>({ resolver: zodResolver(schema) })` with type inference
- Examples: `src/components/examples/*-form.tsx` for reference patterns

## Logging
- **Pino**: Server-side structured logging with `@/lib/logger`
- Dev: Pretty-printed with colors via pino-pretty
- Prod: JSON structured logs with configurable level (default: info)
- Usage: `logger.info()`, `logger.error()`, `logger.debug()`, `logger.warn()`

## Utilities
- `cn()` helper in `@/lib/utils` for className merging (clsx + tailwind-merge)
