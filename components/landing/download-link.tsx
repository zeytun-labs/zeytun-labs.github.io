import type { ReactNode } from "react"
import { DOWNLOAD_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

export function DownloadLink({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return DOWNLOAD_URL ? (
    <a href={DOWNLOAD_URL} className={className}>
      {children}
    </a>
  ) : (
    <button
      type="button"
      disabled
      title="Installer coming soon"
      className={cn(className, "cursor-not-allowed opacity-45")}
    >
      {children}
    </button>
  )
}
