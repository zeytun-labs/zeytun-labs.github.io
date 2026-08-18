import { cn } from "@/lib/utils"

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("max-w-6xl mx-auto", className)} {...props}>
      {children}
    </section>
  )
}
