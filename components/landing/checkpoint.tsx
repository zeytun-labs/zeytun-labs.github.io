"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"
import { Description, Heading, Section, Title } from "../common/section"
import { HugeiconsIcon } from "@hugeicons/react"
import { Asterisk02Icon } from "@hugeicons/core-free-icons"
import { Separator } from "./../ui/separator"
import { cn } from "@/lib/utils"

export function Checkpoint() {
  return (
    <Section>
      <CHeader />
      <CBody />
    </Section>
  )
}

function CHeader() {
  return (
    <div className="mb-16 flex flex-col items-center text-center">
      {[
        <Title key="c-t">Checkpoint</Title>,
        <Heading key="c-h">Nothing new connects without asking</Heading>,
        <Description key="c-d">
          Turn Checkpoint on and Zeytun stops guessing. The connection is held,
          and you are asked.
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

function CBody() {
  return (
    <div className="grid grid-cols-5">
      <div className="col-span-3 grid grid-cols-2 border-border [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(odd)]:border-r">
        <Option
          title="It holds"
          description="A window comes up with the app that asked, where it wants to go, and your options. Nothing moves until you answer."
        />
        <Option
          title="Four ways out"
          description="Allow it, block it, hand it to the FINAL rule — the catch-all at the bottom of your rule list — or pick any policy from the dropdown, per connection."
        />
        <Option
          title="Answer once"
          description="Flip “remember” and your decision is written as a process rule you can find, edit, reorder or disable later."
        />

        <Option
          title="You can always walk away"
          description="If you don't answer, the FINAL rule applies when the timeout runs out. Nothing hangs waiting on you."
        />
      </div>
      <div className="col-span-2">{/**Animated FIG */}</div>
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
    <div className="space-y-0.5 p-6 py-6">
      <div className="flex gap-1">
        <HugeiconsIcon
          icon={Asterisk02Icon}
          className="mt-0.75 size-6 text-primary"
        />
        <p className="font-heading text-2xl">{title}</p>
      </div>
      <p className="ps-7 text-muted-foreground">{description}</p>
    </div>
  )
}
