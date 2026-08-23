"use client"
import React, { useState, MouseEvent } from "react"
import { cn } from "@/lib/utils"
import { GridNet } from "./gird-net"
import { AppWindow } from "./chrome"
import { HugeiconsIcon } from "@hugeicons/react"
import { Description, Heading, Section, Title } from "../common/section"
import { Radar03Icon, Flag02Icon } from "@hugeicons/core-free-icons"
import { IconSvgObject } from "@hugeicons/core-free-icons/types"
// We use custom inline SVGs to precisely match the target design

function Card({
  children,
  className,
  icon,
  title,
  description,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  icon: IconSvgObject
  title: string
  description: string
}) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border! bg-linear-to-b from-card to-card/30 bg-clip-padding transition-colors",
        className
      )}
      {...props}
    >
      {children}

      <div className="relative z-10 px-6">
        <div className="mb-2 flex items-center gap-2">
          {/* Fallback svg if Target02Icon fails, but HugeiconsIcon is safe */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary bg-primary/10 text-primary">
            <HugeiconsIcon icon={icon} />
          </div>
          <h3 className="font-heading text-3xl tracking-wide">{title}</h3>
        </div>
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function Fig({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-50 w-full items-center justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function SeeCard() {
  return (
    <Card
      icon={Radar03Icon}
      title="SEE"
      description="Every connection attributed to the app that opened it, with live upload and download per process, host and policy."
    >
      <Fig>
        {/* Radar Animation */}
        <div className="absolute top-0 aspect-square w-4/5">
          <div className="absolute -top-1/2 aspect-square w-full rounded-full border border-border">
            <div className="absolute inset-5 rounded-full border border-border" />
            <div className="absolute inset-10 rounded-full border border-border" />
            <div className="absolute inset-15 rounded-full border border-border" />
            <div className="absolute inset-20 rounded-full border border-border" />
            <div className="absolute inset-25 rounded-full border border-border" />
            <div className="absolute inset-30 rounded-full border border-border" />
            {/* Sweep */}
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(132,204,22,0.2)_360deg)]" />
            <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
              <div className="absolute top-0 left-1/2 h-1/2 w-0.5 origin-bottom -translate-x-1/2 rounded-full bg-lime-500/80 shadow-[0_0_8px_rgba(132,204,22,0.6)]" />{" "}
            </div>
            {/* Blips */}
            <div className="absolute top-[85%] left-[50%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            <div className="absolute top-[55%] left-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)] delay-75" />
            <div className="absolute top-[75%] left-[30%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_var(--primary)] delay-150" />
          </div>
        </div>
      </Fig>
    </Card>
  )
}

function DecideCard() {
  return (
    <Card
      icon={Flag02Icon}
      title="DECIDE"
      description="Turn Checkpoint on and unmatched connections wait for you instead of taking a default. Allow, block, or send it somewhere — once, or as a rule."
    >
      <Fig>
        {/* Grid Line Traces Canvas (Vercel Style) */}
        <GridNet className="opacity-70 mix-blend-screen" />

        {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(15,15,15,0.8)_100%)]" /> */}

        {/* Window Box */}
        {/* <div className="relative z-20 w-full max-w-[240px] shadow-2xl transition-transform duration-700 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(132,204,22,0.1)]">
          <AppWindow title="CHECKPOINT" small>
            <div className="flex flex-col gap-4 bg-black/60 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="size-8 shrink-0 rounded-full bg-white/10" />
                <div className="flex w-full flex-col gap-2">
                  <div className="h-2 w-2/3 rounded bg-white/20" />
                  <div className="h-2 w-1/3 rounded bg-white/10" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 flex-1 rounded bg-white/10" />
                <div className="h-6 flex-1 rounded bg-primary shadow-[0_0_8px_var(--primary)]" />
              </div>
            </div>
          </AppWindow>
        </div> */}
      </Fig>
    </Card>
  )
}

function RouteCard() {
  return (
    // Meteor Border Wrap
    <div className="relative flex flex-col overflow-hidden rounded-3xl p-[1px]">
      {/* Meteor spinning gradient */}
      <div className="absolute inset-[-100%] z-0 animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(132,204,22,1)_360deg)]" />

      {/* Inner Surface */}
      <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-[23px] bg-[#0F0F0F]">
        <div className="relative flex h-[250px] w-full items-center justify-center overflow-hidden border-b border-white/5 bg-black/20">
          {/* SVG Core traces with flowing light */}
          <div className="absolute inset-0 opacity-80">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              {/* Background Traces */}
              <path
                d="M -20 80 L 100 80 L 120 100 L 160 100"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M -20 160 L 80 160 L 120 120 L 160 120"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 350 70 L 280 70 L 240 100 L 200 100"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 350 170 L 260 170 L 240 120 L 200 120"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 180 0 L 180 80"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 180 250 L 180 140"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2"
                fill="none"
              />

              {/* Animated Glowing Traces */}
              <path
                d="M -20 80 L 100 80 L 120 100 L 160 100"
                stroke="var(--primary)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="30 200"
                className="animate-[dash_3s_linear_infinite]"
              />
              <path
                d="M -20 160 L 80 160 L 120 120 L 160 120"
                stroke="var(--primary)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="20 180"
                className="animate-[dash_2.5s_linear_infinite_0.5s]"
              />
              <path
                d="M 350 70 L 280 70 L 240 100 L 200 100"
                stroke="var(--primary)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="40 220"
                className="animate-[dash_3.5s_linear_infinite_reverse]"
              />
              <path
                d="M 350 170 L 260 170 L 240 120 L 200 120"
                stroke="var(--primary)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="25 150"
                className="animate-[dash_2s_linear_infinite_reverse]"
              />

              {/* Nodes */}
              <circle cx="100" cy="80" r="3" fill="rgba(255,255,255,0.2)" />
              <circle cx="80" cy="160" r="3" fill="rgba(255,255,255,0.2)" />
              <circle cx="280" cy="70" r="3" fill="rgba(255,255,255,0.2)" />
              <circle cx="260" cy="170" r="3" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>

          {/* Center Microchip Graphic */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-xl border border-white/20 bg-black shadow-[0_0_30px_rgba(132,204,22,0.15)] transition-transform duration-500 group-hover:scale-110">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
          </div>
        </div>

        <div className="relative z-10 p-8 pt-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 text-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20V10M18 20V4M6 20v-4" />
                <path d="M12 10l-4-4 4-4M18 10l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-wide text-white">
              ROUTE
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Rules, policies, proxy chains and DNS. Traffic goes exactly where
            you send it, or nowhere at all.
          </p>
        </div>
      </div>
    </div>
  )
}

export function WhyZeytun() {
  return (
    <Section>
      <div className="mb-16 flex flex-col items-center text-center">
        <Title>Why Zeytun</Title>
        <Heading>Your network, finally legible</Heading>
        <Description>
          Most tools give you a switch and a status light.
          <br className="hidden md:block" />
          Zeytun gives you the whole picture, then hands you the controls.
        </Description>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SeeCard />
        <DecideCard />
        <RouteCard />
      </div>
{/* 
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash {
          to { stroke-dashoffset: -400; }
        }
      `,
        }}
      /> */}
    </Section>
  )
}
