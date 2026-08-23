
"use client"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

const features = [
  {
    id: "traffic",
    title: "Traffic Monitor",
    headline: "A live ledger, not a speed graph",
    description: "The connections your machine is making right now. See what opened them, which policy they took, and where they actually went.",
    bullets: [
      "By client or by host: Group the same ledger by the app or host, each with a live count.",
      "Recent or active: See everything recently opened, or narrow to connections alive right now.",
      "Narrow it down: Filter by host, process or port, keep only the columns you care about."
    ]
  },
  {
    id: "process",
    title: "Process",
    headline: "Which app is doing that",
    description: "Traffic doesn't come from nowhere. Process collapses the ledger into the applications behind it, with live speed and the details you need to act.",
    bullets: [
      "Live per-app bandwidth: Current up and down speed for every application.",
      "Where it actually goes: Active and closed connection counts, host talks.",
      "Act from where you are: Right-click any process to write a rule for it, or kill connections."
    ]
  },
  {
    id: "checkpoint",
    title: "Checkpoint",
    headline: "Nothing new connects without asking",
    description: "Turn Checkpoint on and Zeytun stops guessing. The connection is held, and you are asked.",
    bullets: [
      "It holds. A window comes up with the app that asked, and your options.",
      "Four ways out: Allow it, block it, hand it to FINAL rule, or pick any policy.",
      "Answer once: Flip \"remember\" and your decision is written as a process rule.",
      "You can always walk away. If you don't answer, the FINAL rule applies when timeout runs out."
    ]
  },
  {
    id: "policy",
    title: "Policy",
    headline: "Policies, not just a server list",
    description: "Three outbound modes, eight protocols, and policies that nest inside each other. Build the exact topology you want, then let it keep choosing the fastest way out.",
    bullets: [
      "Policies inside policies. Manual picks by hand, Auto picks the lowest latency.",
      "Balancing that fits the traffic: Round Robin, Weighted, Least Conn, Hashing, Sticky, Failover.",
      "Proxy chains: Send traffic through several hops in order."
    ],
    pills: ["http", "socks", "shadowsocks", "trojan", "vmess", "vless", "hysteria2", "tuic"]
  },
  {
    id: "rules",
    title: "Rules",
    headline: "A routing table, not a config file",
    description: "Rules are evaluated top to bottom and the first match wins. The last row is always FINAL.",
    bullets: [
      "Order is the logic: Drag a rule to change priority, switch one off, leave a comment.",
      "Rule-sets as a condition. Use .srs files: geosite, geoip, or your own.",
      "Rules that expire: Give a rule a lifespan and it removes itself when expired."
    ],
    pills: ["DOMAIN", "DOMAIN-SUFFIX", "DOMAIN-KEYWORD", "IP-CIDR", "PROCESS-NAME", "PORT"]
  },
  {
    id: "dns",
    title: "DNS",
    headline: "DNS, all the way down",
    description: "The layer most tools hide behind one input field. Zeytun opens all of it.",
    bullets: [
      "Route by name, not by address: FakeIP engine matches before it resolves, no DNS leaks.",
      "Remote and local, split. External names through proxy, internal names on network.",
      "DNS rules: Send a domain to your router, to a resolver, or refuse to answer.",
      "Lookup that explains itself: Type a domain and see server, transport, records, and time."
    ],
    pills: ["DoH", "DoT", "QUIC", "TCP", "UDP"]
  }
]

function AbstractTrafficMicroUI() {
  return (
    <div className="flex h-full w-full flex-col gap-3 p-6">
      <div className="flex flex-col gap-2 opacity-60">
        <div className="h-4 w-32 rounded-sm bg-primary/20" />
        <div className="h-4 w-48 rounded-sm bg-white/10" />
        <div className="h-4 w-24 rounded-sm bg-white/10" />
      </div>
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="mt-4 flex flex-1 flex-col gap-3 border-l border-primary/30 pl-4"
      >
        <div className="flex w-full items-center justify-between rounded-lg bg-primary/5 p-3 outline outline-1 outline-primary/20">
          <div className="h-3 w-16 rounded bg-primary/50" />
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-2 w-2 rounded-full bg-primary" 
          />
        </div>
        <div className="flex w-full items-center justify-between rounded-lg bg-white/2 p-3 outline outline-1 outline-white/5">
          <div className="h-3 w-20 rounded bg-white/20" />
          <div className="h-2 w-4 rounded bg-white/10" />
        </div>
      </motion.div>
    </div>
  )
}

function AbstractProcessMicroUI() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="relative flex size-48 items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-white/20" 
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute inset-4 rounded-full border border-primary/40" 
        />
        <div className="z-10 flex size-16 items-center justify-center rounded-2xl bg-white/5 shadow-2xl outline outline-1 outline-white/10 backdrop-blur-md">
          <div className="size-6 rounded-md bg-primary/80" />
        </div>
      </div>
    </div>
  )
}

function AbstractCheckpointMicroUI() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex w-64 flex-col gap-4 rounded-xl border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur-xl"
      >
        <div className="h-2 w-12 rounded-full bg-white/20" />
        <div className="h-4 w-3/4 rounded-sm bg-white/40" />
        <div className="mt-4 flex gap-2">
          <div className="h-8 flex-1 rounded-md bg-white/5 outline outline-1 outline-white/10" />
          <div className="h-8 flex-1 rounded-md bg-primary/20 outline outline-1 outline-primary/50" />
        </div>
      </motion.div>
    </div>
  )
}

function AbstractPolicyMicroUI() {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-8">
      <div className="flex gap-4">
        <div className="flex h-12 flex-1 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
          <div className="h-2 w-8 rounded-full bg-primary/60" />
        </div>
        <div className="flex h-12 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/5">
           <div className="h-2 w-8 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="relative mt-4 flex h-32 w-full justify-between rounded-xl border border-white/5 bg-black/20 p-4">
        <motion.div 
          animate={{ x: [0, 200] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute top-1/2 left-4 h-px w-12 bg-primary" 
        />
        <div className="h-full w-px border-l border-dashed border-white/20" />
        <div className="h-full w-px border-l border-dashed border-primary/50" />
        <div className="h-full w-px border-l border-dashed border-white/20" />
      </div>
    </div>
  )
}

function AbstractRulesMicroUI() {
  return (
    <div className="flex h-full w-full flex-col gap-2 p-6 justify-center">
      <div className="h-10 w-full rounded-md border border-white/10 bg-white/2 mb-2" />
      <div className="h-12 w-full rounded-md border border-primary/30 bg-primary/10 flex items-center px-4 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
        <div className="h-2 w-16 bg-primary/80 rounded-full" />
      </div>
      <div className="h-12 w-full rounded-md border border-white/10 bg-white/5" />
      <div className="h-12 w-full rounded-md border border-white/10 bg-white/5" />
    </div>
  )
}

function AbstractDnsMicroUI() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="relative flex aspect-square w-full max-w-sm items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/5" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-16 rounded-full border border-primary/20" />
        
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="absolute inset-8"
        >
          <div className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        </motion.div>
        
        <div className="z-10 flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
           <div className="size-3 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  )
}

const UI_BLOCKS = [
  AbstractTrafficMicroUI,
  AbstractProcessMicroUI,
  AbstractCheckpointMicroUI,
  AbstractPolicyMicroUI,
  AbstractRulesMicroUI,
  AbstractDnsMicroUI
]

export function FeaturesScroll() {
  const [activeIndex, setActiveIndex] = useState(0)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id')
          const idx = features.findIndex(f => f.id === id)
          if(idx !== -1) setActiveIndex(idx)
        }
      })
    }, {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0
    })
    
    document.querySelectorAll('.feature-block').forEach(el => {
      observerRef.current?.observe(el)
    })
    
    return () => observerRef.current?.disconnect()
  }, [])
  
  const ActiveUI = UI_BLOCKS[activeIndex] || UI_BLOCKS[0]

  return (
    <section className="relative mx-auto mt-24 mb-40 max-w-[1400px] px-4 md:px-8">
      {/* Decorative Line */}
      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24 relative">
        <div className="flex flex-col gap-[30vh] pb-[30vh] pt-[15vh]">
          {features.map((feature, idx) => (
            <div 
              key={feature.id} 
              data-id={feature.id}
              className={cn(
                "feature-block flex flex-col items-start transition-opacity duration-500",
                activeIndex === idx ? "opacity-100" : "opacity-40"
              )}
            >
              <span className="mb-4 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs tracking-widest text-primary uppercase">
                {feature.title}
              </span>
              <h3 className="mb-6 text-3xl font-medium tracking-tight text-foreground md:text-5xl">
                {feature.headline}
              </h3>
              <p className="mb-8 text-lg font-normal leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              <ul className="flex flex-col gap-4">
                {feature.bullets.map((bullet, i) => {
                  const [strong, rest] = bullet.split(/: |\. /)
                  return (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                      <span className="leading-relaxed">
                        <strong className="font-medium text-foreground">{strong}</strong> 
                        {rest ? `: ${rest}` : ""}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {feature.pills && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {feature.pills.map(pill => (
                     <span key={pill} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/70">
                       {pill}
                     </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Sticky Visualizer */}
        <div className="hidden lg:block">
          <div className="sticky top-[20vh] flex h-[60vh] w-full items-center justify-center rounded-3xl border border-white/5 bg-[#0a0a0a]/80 shadow-2xl backdrop-blur-2xl overflow-hidden p-2">
             <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
             <div className="relative h-full w-full rounded-2xl border border-white/5 bg-black/40 overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <ActiveUI />
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
