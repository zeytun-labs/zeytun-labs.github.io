# Zeytun Web

The official website and landing page for [Zeytun](https://github.com/zeytun-labs/zeytun), an open-source network manager for macOS.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Components**: Tailwind CSS v4, Base UI, Lucide Icons, Hugeicons
- **Motion & Scroll**: Motion (Framer Motion), Lenis smooth scrolling, Custom 3D Particle Canvas
- **Package Manager**: pnpm

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Type check
pnpm typecheck

# Lint
pnpm lint

# Production build (Static export)
pnpm build
```

## Environment Variables

Copy `.env.example` to `.env.local` to override default settings:

```bash
# Optional direct download URL override (HTTPS required).
# Defaults to the official releases page: https://github.com/zeytun-labs/zeytun-app/releases
NEXT_PUBLIC_ZEYTUN_DOWNLOAD_URL=

# Canonical production site URL.
# Leave empty until the production domain is confirmed.
NEXT_PUBLIC_SITE_URL=
```

## Architecture & Animations

- **Single Dark Theme**: The landing page is strictly dark-themed (`forcedTheme="dark"`).
- **Interactive Demos**: Live interactive ledgers (Traffic Monitor, Process, Checkpoint, Rules, Policy, DNS) pause automatically when out of viewport or when the tab is inactive via `useDemoActivity`.
- **Accessibility & Reduced Motion**: Automatically disables continuous RAF loops and Lenis scrolling when `prefers-reduced-motion: reduce` is enabled, rendering clear, deterministic previews.
