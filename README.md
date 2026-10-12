# Zeytun Web

The official website and landing page for [Zeytun](https://github.com/zeytun-labs/zeytun), an open-source network manager for macOS.

## Structure

The landing page is designed for high clarity and rapid comprehension (~30s read), organized into 6 core sections:

1. **Hero**: 3D particle canvas logo, concise value proposition, primary download button, and link to GitHub source.
2. **Product Showcase (`#model`)**: Interactive tabbed stage (`See`, `Decide`, `Route`) hosting live process, connection checkpoint, and rule table figures without unmounting.
3. **Capabilities (`#features`)**: Compact highlights featuring interactive radar, checkpoint minimal window, and routing chips.
4. **Community (`#community`)**: Live release statistics (macOS DMG installer downloads and GitHub stargazers) alongside a responsive weekly star history SVG chart.
5. **FAQ (`#faq`)**: Five collapsed native details/summary accordions addressing pricing, macOS platform requirements, VPN models, and system permissions.
6. **Download (`#download`)**: Clean beta download CTA with Apple Silicon requirements and bug report links.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, static export)
- **UI & Styling**: Tailwind CSS v4, Base UI, Lucide Icons, Hugeicons
- **Motion & Scroll**: Motion (Framer Motion), Lenis smooth scrolling, Custom 3D Particle Canvas
- **Package Manager**: pnpm

## Development & Build

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Synchronize GitHub stats (downloads, stars, weekly history)
pnpm stats:sync

# Type check
pnpm typecheck

# Lint
pnpm lint

# Production static export (automatically runs stats:sync first)
pnpm build
```

## GitHub Stats Synchronization

The statistics shown in the **Community** section are pre-fetched at build time and stored in `data/github-stats.json`. This maintains pure static hosting with zero client-side GitHub API requests.

- **Downloads**: Computed strictly by summing `download_count` of all uploaded `.dmg` installer assets across all non-draft releases in `zeytun-labs/zeytun-app`.
- **Stars & History**: Fetched from official GitHub stargazers count and weekly stargazers history endpoints.
- **Resilience**: If the GitHub API fails or hits rate limits, the previous valid snapshot values are retained to ensure builds always succeed.

## Environment Variables

Copy `.env.example` to `.env.local` to customize settings:

```bash
# Optional direct download URL override (HTTPS required).
# Defaults to https://github.com/zeytun-labs/zeytun-app/releases
NEXT_PUBLIC_ZEYTUN_DOWNLOAD_URL=

# Canonical production site URL.
NEXT_PUBLIC_SITE_URL=

# Optional GitHub token for builds to increase rate limits during stats:sync.
GITHUB_STATS_TOKEN=
```
