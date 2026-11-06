export function ChangelogHero() {
  return (
    <div className="relative pt-12 pb-10 sm:pt-16 sm:pb-12">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[130px]"
      />

      {/* Header text */}
      <div className="text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-3 py-1 font-mono text-xs text-primary backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          <span>Product Updates & Releases</span>
        </div>
        <h1 className="mt-4 font-heading text-4xl font-medium tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Changelog
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Stay up to date with the latest features, improvements, and releases
          for Zeytun.
        </p>
      </div>
    </div>
  )
}
