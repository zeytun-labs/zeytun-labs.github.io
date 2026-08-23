
export function ArchitectureRest() {
  return (
    <section className="mx-auto mt-40 max-w-7xl px-6 md:px-8">
      {/* Architecture */}
      <div className="mb-32">
        <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase">Architecture</span>
        <h2 className="mb-6 text-4xl font-medium tracking-tight md:text-5xl">The engine underneath</h2>
        <p className="mb-12 max-w-2xl text-lg text-muted-foreground">What the interface can promise depends entirely on what runs below it. Everything above is only as good as the engine keeping it true.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
             <div className="font-mono text-sm text-primary mb-4">01</div>
             <h4 className="text-xl font-medium text-white">Rules that apply live</h4>
             <p className="text-muted-foreground">Add, edit or reorder a rule and it takes effect immediately. Change a rule mid-download and the download keeps going.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
             <div className="font-mono text-sm text-primary mb-4">02</div>
             <h4 className="text-xl font-medium text-white">TUN mode</h4>
             <p className="text-muted-foreground">Capture traffic at the interface, including the apps that quietly ignore a system proxy.</p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
             <div className="font-mono text-sm text-primary mb-4">03</div>
             <h4 className="text-xl font-medium text-white">A core we ship ourselves</h4>
             <p className="text-muted-foreground">Not a wrapper around whatever is installed on your machine. We patch and update zeytun-core on our own schedule.</p>
          </div>
        </div>
      </div>

      {/* And the rest of it */}
      <div>
         <h2 className="mb-12 text-3xl font-medium tracking-tight md:text-4xl">Everything else in the box</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
           <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
             <h4 className="text-lg font-medium text-white">Profiles</h4>
             <p className="text-muted-foreground">Separate proxies, policies, rules and DNS per profile. Switch and the whole setup changes.</p>
           </div>
           <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
             <h4 className="text-lg font-medium text-white">Subscriptions</h4>
             <p className="text-muted-foreground">Point a profile at a subscription URL and let it pull its node list in.</p>
           </div>
           <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
             <h4 className="text-lg font-medium text-white">Share over LAN</h4>
             <p className="text-muted-foreground">Let phones, TVs and VMs on your network use the same rules through this machine.</p>
           </div>
           <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
             <h4 className="text-lg font-medium text-white">Tools & Logs</h4>
             <p className="text-muted-foreground">Network quality tests, latency breakdowns, and live core logs filtered by level.</p>
           </div>
         </div>
      </div>
    </section>
  )
}
