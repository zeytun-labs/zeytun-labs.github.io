
export function RoadmapNew() {
  return (
    <section className="mx-auto mt-40 max-w-7xl px-6 md:px-8 pb-32">
      <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase">Roadmap</span>
      <h2 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">Where this is going</h2>
      <p className="mb-16 max-w-2xl text-lg text-muted-foreground">Three phases, in order. No dates, each one ships when it is actually ready.</p>
      
      <div className="flex flex-col gap-12 border-l border-white/10 pl-8 relative">
        <div className="relative">
           <div className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full bg-primary outline outline-4 outline-[#0a0a0a]" />
           <h3 className="text-xl font-medium text-foreground mb-4">Phase 01: Something you can trust on macOS</h3>
           <ul className="flex flex-col gap-3 text-muted-foreground max-w-3xl">
             <li>• Correct under pressure: process attribution that holds up, DNS that never slips past your rules.</li>
             <li>• Checkpoint on every path. Every unmatched connection, every time.</li>
             <li>• Alpha to beta to a stable v1.</li>
           </ul>
        </div>
        <div className="relative">
           <div className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full border-2 border-white/30 bg-[#0a0a0a]" />
           <h3 className="text-xl font-medium text-foreground mb-4">Phase 02: The same setup on every machine</h3>
           <ul className="flex flex-col gap-3 text-muted-foreground max-w-3xl">
             <li>• Windows and Linux, each with real TUN capture and process routing.</li>
             <li>• Profiles that travel with you between your own machines.</li>
           </ul>
        </div>
        <div className="relative">
           <div className="absolute -left-[39px] top-1.5 h-3 w-3 rounded-full border-2 border-white/30 bg-[#0a0a0a]" />
           <h3 className="text-xl font-medium text-foreground mb-4">Phase 03: The network layer, in your hands</h3>
           <ul className="flex flex-col gap-3 text-muted-foreground max-w-3xl">
             <li>• Take an app off the network entirely, instead of only choosing its route.</li>
             <li>• Connection history you can search back through, not just watch go by.</li>
             <li>• Read inside HTTPS: a CA the app generates and the system trusts.</li>
             <li>• Rewrite a request or answer it yourself.</li>
           </ul>
        </div>
      </div>
    </section>
  )
}
