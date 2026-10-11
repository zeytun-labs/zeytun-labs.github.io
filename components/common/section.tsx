import { cn } from "@/lib/utils"

export function Section({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("mx-auto max-w-6xl scroll-mt-28", className)} {...props}>
      {children}
    </section>
  )
}

export function Title({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-heading text-xs font-bold tracking-widest text-primary uppercase",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export function Heading({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-4xl font-normal tracking-tight md:text-5xl font-heading",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}



export function Description({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-4 max-w-2xl text-lg text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

