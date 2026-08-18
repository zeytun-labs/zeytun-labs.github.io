import { ArrowRight } from "lucide-react"
import { ShinyButton } from "@/components/ui/shiny-button"

export default function ShinyButtonDemo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <ShinyButton onClick={() => alert("Button clicked!")}>
        Join the waitlist
        <ArrowRight className="ml-2 h-4 w-4" />
      </ShinyButton>
    </div>
  )
}
