# Project Configuration

## UI Framework
- **shadcn/ui**: Component library integrated with Tailwind CSS v4
- **Style**: New York variant with CSS variables
- **Icon Library**: Lucide React
- **Component Path**: `@/components/ui`

## Adding Components
```bash
pnpm dlx shadcn@latest add <component-name>
```

## Utilities
- `cn()` helper in `@/lib/utils` for className merging (clsx + tailwind-merge)
