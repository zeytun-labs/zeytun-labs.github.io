import { cn } from "@/lib/utils"

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("mx-auto max-w-6xl", className)} {...props}>
      {children}
    </section>
  )
}
