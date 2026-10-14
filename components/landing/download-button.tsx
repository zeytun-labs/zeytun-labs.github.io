import { ShinyButton } from "@/components/ui/shiny-button"
import { DOWNLOAD_URL } from "@/lib/site"
import { AppleIcon } from "./apple-icon"

export function DownloadButton({ className }: { className?: string }) {
  const props = DOWNLOAD_URL
    ? { href: DOWNLOAD_URL }
    : { disabled: true, title: "Installer coming soon" }

  return (
    <ShinyButton {...props} className={className}>
      <AppleIcon className="size-5" />
      Download for Mac
    </ShinyButton>
  )
}
