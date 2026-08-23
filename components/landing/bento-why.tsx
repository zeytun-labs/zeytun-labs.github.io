
import { cn } from "@/lib/utils"

export function BentoWhy() {
  return (
    <section className="mx-auto mt-32 max-w-7xl px-6 md:px-8">
      <div className="mb-16 flex flex-col">
        <h2 className="text-4xl font-medium tracking-tight md:text-5xl">Your network, finally legible.</h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Most tools give you a switch and a status light. Zeytun gives you the whole picture, then hands you the controls.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Card 1 */}
        <div className="col-span-1 md:col-span-2 flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12">
           <div>
             <h3 className="text-2xl font-medium text-foreground">See</h3>
             <p className="mt-2 text-muted-foreground max-w-md w-full">Every connection attributed to the app that opened it, with live upload and download per process, host and policy.</p>
           </div>
           <div className="mt-12 flex flex-wrap gap-4">
             <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-black/20 p-4">
                <span className="text-xs text-white/50">Active connections</span>
                <span className="font-mono text-2xl text-primary">24</span>
             </div>
             <div className="flex flex-col gap-1 rounded-xl border border-white/5 bg-black/20 p-4">
                <span className="text-xs text-white/50">Outbound mode</span>
                <span className="font-mono text-2xl text-white">Rule-based</span>
             </div>
           </div>
        </div>
        
        {/* Card 2 */}
        <div className="col-span-1 flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 relative overflow-hidden">
           {/* Abstract mesh */}
           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent -z-10" />
           <div>
             <h3 className="text-2xl font-medium text-foreground">Decide</h3>
             <p className="mt-2 text-muted-foreground">Turn Checkpoint on and unmatched connections wait for you instead of taking a default.</p>
           </div>
           <div className="mt-12 h-32 w-full rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-xs text-white/60">
              <div className="text-primary">&gt; Block</div>
              <div>&gt; Allow once</div>
              <div>&gt; Route to proxy</div>
           </div>
        </div>

        {/* Card 3 */}
        <div className="col-span-1 md:col-span-3 flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 relative">
           <div className="max-w-xl">
             <h3 className="text-2xl font-medium text-foreground">Route</h3>
             <p className="mt-2 text-muted-foreground">Rules, policies, proxy chains and DNS. Traffic goes exactly where you send it, or nowhere at all. Group policies by rule structures.</p>
           </div>
           <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
             {["Network latency: 34 ms", "DNS 12 ms", "proxy 21 ms"].map(item => (
                <div key={item} className="whitespace-nowrap rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground">
                   {item}
                </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  )
}
