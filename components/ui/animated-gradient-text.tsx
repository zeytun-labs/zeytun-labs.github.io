import { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#adff8f1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#bfdea03f] dark:bg-black/40",
        className
      )}
    >
      <div
        className={`absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-linear-to-r from-primary/50 via-primary-foreground/50 to-primary/50 bg-size-[var(--bg-size)_100%] mask-subtract! p-px [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]`}
      />

      {children}
    </div>
  )
}
