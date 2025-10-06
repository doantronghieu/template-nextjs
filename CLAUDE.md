# Project Configuration

## UI Framework
- **shadcn/ui**: Component library integrated with Tailwind CSS v4
- **Style**: New York variant with CSS variables
- **Icon Library**: Lucide React
- **Component Path**: `@/components/ui`

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

## Utilities
- `cn()` helper in `@/lib/utils` for className merging (clsx + tailwind-merge)
