/**
 * The Zeytun mark, taken from the desktop app's icon assets.
 *
 * This is the only hand-written SVG left in the landing page — it is brand
 * identity, so it has no @hugeicons equivalent. Every other icon comes from
 * `@hugeicons/core-free-icons`.
 */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M0 21.4821C10.2275 21.4821 18.5187 29.7726 18.5189 40C8.29146 40 0.000269965 31.7095 0 21.4821ZM40 21.4821C39.9997 31.7093 31.7093 39.9998 21.4821 40C21.4823 29.7727 29.7727 21.4823 40 21.4821ZM18.5189 0C18.5189 10.2276 10.2276 18.5189 0 18.5189C0 8.2913 8.2913 0 18.5189 0ZM21.4821 0C31.7095 0.000236235 40 8.29144 40 18.5189C29.7726 18.5187 21.4821 10.2275 21.4821 0Z"
        fill="currentColor"
      />
    </svg>
  )
}
