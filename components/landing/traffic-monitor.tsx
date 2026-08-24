"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { Description, Heading, Section, Title } from "../common/section"
import { HugeiconsIcon } from "@hugeicons/react"
import { Asterisk02Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"
export function TrafficMonitor() {
  return (
    <Section>
      <TMHeader />
      <TMBody />
    </Section>
  )
}

function TMHeader() {
  return (
    <div className="mb-16 flex flex-col items-center text-center">
      {[
        <Title key="tm-t">Traffic Monitor</Title>,
        <Heading key="tm-h">A live ledger, not a speed graph</Heading>,
        <Description key="tm-d">
          The connections your machine is making right now — what opened them,
          which policy they took, and where they actually went.
        </Description>,
      ].map((el, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.7,
            delay: i * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {el}
        </motion.div>
      ))}
    </div>
  )
}

function TMBody() {
  return (
    <div className="grid grid-cols-2">
      <div className="space-y-8">
        <Option
          title="By client or by host"
          description="Group the same ledger by the app that opened each connection, or by the host it reached, each with a live count."
        />
        <Separator />
        <Option
          title="Recent or active"
          description="See everything that has opened recently, or narrow to the connections still alive right now."
        />
        <Separator />
        <Option
          title="Narrow it down"
          description="Filter by host, process or port, and keep only the columns you care about."
        />
      </div>
      <div>
        <AnimatedFig />
      </div>
    </div>
  )
}

function Option({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1">
        <HugeiconsIcon icon={Asterisk02Icon} className="size-6 text-primary" />
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <p className="ps-7 text-muted-foreground">{description}</p>
    </div>
  )
}

function AnimatedFig() {
  type Conn = { id: string; ip: string; done: boolean; isTcp: boolean }
  const [conns, setConns] = useState<Conn[]>([])

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const r = (n: number) => Math.floor(Math.random() * n)
    const add = () => {
      const conn: Conn = {
        id: crypto.randomUUID(),
        ip: `${1 + r(223)}.${r(256)}.${r(256)}.${r(256)}:${1024 + r(64511)}`,
        done: false,
        isTcp: Math.random() < 0.7,
      }
      setConns((cs) => [...cs.slice(-5), conn])
      timers.push(
        setTimeout(
          () =>
            setConns((cs) =>
              cs.map((c) => (c.id === conn.id ? { ...c, done: true } : c))
            ),
          1000 + Math.random() * 4000
        )
      )
    }
    for (let i = 0; i < 5; i++) add()
    const loop = setInterval(add, 1500)
    return () => {
      clearInterval(loop)
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="flex flex-col gap-3 max-w-100 ms-auto h-98.5">
      <AnimatePresence initial={false}>
        {conns.map((c) => (
          <motion.div
            key={c.id}
            layout
            initial={{ opacity: 0, x: 24, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ConnectionRaw ip={c.ip} done={c.done} isTcp={c.isTcp} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function ConnectionRaw({
  done,
  ip,
  isTcp,
}: {
  done: boolean
  ip: string
  isTcp?: boolean
}) {
  return (
    <div className={cn("flex gap-4 px-4 py-2.5 rounded-2xl items-center border border-border/40 bg-card/70 transition-all", done ? 'opacity-100' : 'opacity-50')}>
      <span
        className={cn(
          "block size-2 rounded-full transition-all",
          done ? "bg-primary" : "bg-amber-500"
        )}
      />
      <p className="font-mono">{ip}</p>

      <div
        className={cn(
          "ms-auto font-mono rounded-full px-2",
          isTcp
            ? "bg-cyan-500/10 text-cyan-500"
            : "bg-pink-500/10 text-pink-500"
        )}
      >
        {isTcp ? "TCP" : "UDP"}
      </div>
    </div>
  )
}
