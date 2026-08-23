
"use client"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export function FeaturesApple() {
  return (
    <section className="mx-auto mt-24 mb-32 max-w-[1200px] px-6 md:px-8 space-y-32">
      
      {/* SECTION 1: Traffic & Process (The Apple Macro Card) */}
      <div className="flex flex-col items-center text-center">
        <h2 className="mb-4 text-5xl font-semibold tracking-tighter md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          A live ledger. <br className="hidden md:block" />Not a speed graph.
        </h2>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground font-medium">
          The connections your machine is making right now. What opened them, which policy they took, and where they actually went.
        </p>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full rounded-[40px] border border-white/10 bg-[#151516]/80 p-8 md:p-16 shadow-2xl backdrop-blur-3xl overflow-hidden relative"
        >
          {/* Glass mesh background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50 mix-blend-overlay" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 text-left">
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-semibold tracking-tight text-white mb-4">Which app is doing that.</h3>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                Traffic doesn't come from nowhere. Process collapses the ledger into the applications behind it, with live speed and the details you need to act.
              </p>
              <ul className="space-y-4">
                {[
                  "By client or by host: Group the same ledger by the app or host.",
                  "Live per-app bandwidth: Current up and down speed individually.",
                  "Act from where you are: Right-click any process to write a rule."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1.5 flex size-4 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <div className="size-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center justify-center">
               {/* Apple-style Typographic Data Viz */}
               <div className="w-full flex-col gap-4 flex rounded-3xl border border-white/5 bg-black/40 p-6 md:p-8 backdrop-blur-md">
                 <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                    <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Active connections</span>
                    <span className="text-white text-5xl font-semibold tracking-tighter">1,284</span>
                 </div>
                 <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                    <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Monitored Apps</span>
                    <span className="text-primary text-4xl font-semibold tracking-tighter">37</span>
                 </div>
                 <div className="flex justify-between items-baseline pt-2">
                    <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Status</span>
                    <span className="text-white text-xl font-medium tracking-tight bg-white/10 px-4 py-1.5 rounded-full">Monitoring</span>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 2: Checkpoint (The Privacy Modal) */}
      <div className="flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full rounded-[40px] border border-white/10 bg-gradient-to-b from-[#1c1c1e] to-[#000000] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Apple Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[200px] bg-red-500/10 blur-[120px] rounded-[100%]" />
          
          <div className="relative z-10 flex flex-col items-center mx-auto max-w-3xl">
            <div className="size-20 bg-white/10 rounded-3xl border border-white/10 flex items-center justify-center mb-8 shadow-inner backdrop-blur-xl">
               <svg className="size-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h2 className="mb-6 text-4xl font-semibold tracking-tighter md:text-6xl text-white">
              Nothing new connects <br />without asking.
            </h2>
            <p className="text-xl text-white/60 mb-12">
              Turn Checkpoint on and Zeytun stops guessing. The connection is held, a window comes up with the app that asked, and your options. Nothing moves until you answer.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
               {["Allow once", "Block", "Route Policy", "FINAL Rule"].map(action => (
                 <div key={action} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center text-white/80 font-medium">
                   {action}
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION 3: The Ultimate Bento (Policy, Rules, DNS) */}
      <div className="flex flex-col text-center pt-12">
        <h2 className="mb-4 text-5xl font-semibold tracking-tighter md:text-6xl text-white">
          A routing table. <br/>Not a config file.
        </h2>
        <p className="mt-4 max-w-2xl text-xl text-muted-foreground font-medium mx-auto mb-16">
          Build the exact topology you want, then let it keep choosing the fastest way out.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[340px]">
          
          {/* Bento 1: Rules */}
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-[32px] bg-[#151516] border border-white/5 p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
               <svg className="size-32 text-primary" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M4 6h16M4 12h16m-7 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <div className="relative z-10 max-w-md text-left mt-auto">
              <h3 className="text-3xl font-semibold tracking-tight text-white mb-2">Rules that expire.</h3>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Order is the logic. Drag a rule to change priority, switch one off without deleting it. Give a rule a lifespan and it removes itself when expired.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {["DOMAIN-SUFFIX", "IP-CIDR", "PROCESS-NAME", ".srs Rulesets"].map(pill => (
                  <span key={pill} className="text-xs font-mono bg-white/10 text-white/70 px-3 py-1.5 rounded-full backdrop-blur-md">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bento 2: DNS */}
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[32px] bg-primary/10 border border-primary/20 p-10 flex flex-col justify-between relative"
          >
            <div className="w-full flex-1 flex items-center justify-center">
               <div className="size-32 rounded-full border-[12px] border-primary/20 flex items-center justify-center">
                 <div className="size-16 rounded-full bg-primary shadow-[0_0_40px_rgba(var(--primary),0.8)]" />
               </div>
            </div>
            <div className="text-center mt-8">
              <h3 className="text-2xl font-semibold tracking-tight text-white mb-2">DNS, all the way down.</h3>
              <p className="text-primary/80">Route by name, not by address. Remote and local, perfectly split.</p>
            </div>
          </motion.div>
          
          {/* Bento 3: Policies */}
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-3 rounded-[32px] bg-gradient-to-br from-[#1c1c1e] to-[#0a0a0a] border border-white/5 p-10 flex flex-col md:flex-row items-center justify-between gap-12"
          >
            <div className="max-w-xl text-left">
              <h3 className="text-3xl font-semibold tracking-tight text-white mb-4">Policies, not just a list.</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Three outbound modes, eight protocols, and policies that nest inside each other. Use Round Robin, Least Connections, Consistent Hashing, or Strict Failover.
              </p>
            </div>
            <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
               {["http", "socks", "trojan", "vless", "vmess", "hysteria2", "tuic", "shadowsocks"].map(proto => (
                 <div key={proto} className="bg-white/5 rounded-xl flex items-center justify-center h-16 font-mono text-sm tracking-wide text-white/60 border border-white/5">
                   {proto}
                 </div>
               ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
