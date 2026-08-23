"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Icon } from "./icons"
import { cn } from "@/lib/utils"

import { MacOSDesktop } from "./macos-desktop"

const TABS = [
  {
    id: "activity",
    icon: "activity",
    label: "Live Network",
    color: "from-primary/30 to-primary/0",
  },
  {
    id: "route",
    icon: "route",
    label: "Tunnels & Routes",
    color: "from-blue-500/30 to-blue-500/0",
  },
  {
    id: "shield",
    icon: "shield",
    label: "DNS Firewall",
    color: "from-orange-500/30 to-orange-500/0",
  },
]

export function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section className="relative mx-auto mt-24 mb-40 flex max-w-6xl flex-col items-center gap-12 overflow-hidden px-8 py-16">
      {/* Absolute Space Background (The Stars) */}
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 25px 5px, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 50px 25px, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 125px 20px, rgba(255,255,255,0.6), transparent), radial-gradient(1.5px 1.5px at 170px 75px, rgba(255,255,255,0.5), transparent), radial-gradient(2px 2px at 15px 125px, rgba(255,255,255,0.2), transparent), radial-gradient(1.5px 1.5px at 110px 180px, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 190px 140px, rgba(255,255,255,0.8), transparent)",
          backgroundSize: "200px 200px",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative z-10 text-center">
        <h2 className="mb-3 text-3xl font-medium tracking-tight">
          One tool for the entire stack.
        </h2>
        <p className="text-lg text-muted-foreground">
          Watch process traffic, manage outbound VPNs, and block tracking -
          seamlessly.
        </p>
      </div>

      {/* Main Mockup Container container */}
      <div className="relative w-full max-w-4xl pt-8 pb-16">
        {/* Soft Ambient Radiance behind the MacOS window */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <div className="h-[85%] w-[85%] rounded-[100px] bg-primary/40 blur-[100px]" />
        </div>

        {/* Thick, heavy Raycast-style Glass Frame */}
        <div className="relative z-10 w-full rounded-[24px] bg-white/[0.04] p-[6px] shadow-[0_0_0_1px_rgba(0,0,0,0.8),_0_60px_100px_-20px_rgba(0,0,0,1)] backdrop-blur-3xl">
          {/* Outer edge highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/10"
            style={{ boxShadow: "inset 0 1px 1px rgba(255,255,255,0.15)" }}
          />

          {/* Phase 1: Real Canvas MacOS Sim */}
          <MacOSDesktop>
            {/* Phase 2: App Mock up inside Mac */}
            {/* For now, just rendering a glass placeholder matching the tabs */}
            <div className="absolute inset-0 top-7 flex h-full min-h-[400px] w-full items-center justify-center bg-black/20">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto flex w-full max-w-xl items-center justify-center rounded-3xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-3xl"
                >
                  {activeTab === 0 && <ActivityMock />}
                  {activeTab === 1 && <RoutingMock />}
                  {activeTab === 2 && <FirewallMock />}
                </motion.div>
              </AnimatePresence>
            </div>
          </MacOSDesktop>
        </div>

        {/* Floating App Dock Switcher (Raycast Style) */}
        <div className="absolute -bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#121212]/80 p-2 shadow-2xl backdrop-blur-xl">
            {TABS.map((tab, idx) => {
              const isActive = activeTab === idx
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={cn(
                    "group relative flex size-12 items-center justify-center rounded-xl transition-all duration-300",
                    isActive
                      ? "border border-white/20 bg-white/10 text-white shadow-inner"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon name={tab.icon as any} />

                  {/* Tooltip */}
                  {isActive && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-black px-2 py-1 text-xs font-medium whitespace-nowrap text-white shadow ring-1 ring-white/10">
                      {tab.label}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ----------------- Mocks for specific tabs -----------------

function ActivityMock() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <span className="text-sm font-medium text-white/50">Live Traffic</span>
        <div className="h-6 w-32 rounded-md bg-white/5" />
      </div>
      {[
        { proc: "Arc", ip: "172.217.18.206", lat: "12ms", state: "direct" },
        { proc: "Docker", ip: "192.168.1.5", lat: "0ms", state: "local" },
        { proc: "Telegram", ip: "149.154.167.92", lat: "56ms", state: "proxy" },
      ].map((r, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-white/10" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{r.proc}</span>
              <span className="text-xs text-white/40">{r.ip}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-white/60">
              {r.state}
            </span>
            <span className="text-sm font-medium text-primary">{r.lat}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function RoutingMock() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-1 flex-col items-center">
          <span className="text-3xl font-medium text-white">Xray</span>
          <span className="mt-1 text-xs text-green-400">● Connected</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="flex flex-1 flex-col items-center">
          <span className="text-3xl font-medium text-white">42ms</span>
          <span className="mt-1 text-xs text-white/50">Avg Latency</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <span className="text-xs font-medium text-white/40 uppercase">
          Active Rules
        </span>
        <div className="flex items-center justify-between rounded-md border border-white/5 bg-white/5 px-4 py-2">
          <span className="text-sm text-white">geosite:iran</span>
          <span className="rounded border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
            DIRECT
          </span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-white/5 bg-white/5 px-4 py-2">
          <span className="text-sm text-white">domain:youtube.com</span>
          <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
            PROXY
          </span>
        </div>
      </div>
    </div>
  )
}

function FirewallMock() {
  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10">
        <Icon name="shield" />
      </div>
      <h3 className="text-xl font-medium text-white">12,492 Ads Blocked</h3>
      <p className="mt-2 max-w-sm text-white/40">
        DNS layer filtering is instantly rejecting tracking requests across your
        entire system.
      </p>

      <div className="mt-8 flex w-full max-w-md items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
        <div className="size-2 flex-none rounded-full bg-red-500" />
        <span className="truncate text-left text-sm text-red-100/70">
          app-measurement.com
        </span>
        <span className="ml-auto flex-none text-xs text-red-400">BLOCKED</span>
      </div>
    </div>
  )
}
