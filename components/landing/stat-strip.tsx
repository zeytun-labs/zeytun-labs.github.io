const stats = [
  { value: "28", label: "outbound protocols" },
  { value: "6", label: "dns transports" },
  { value: "3", label: "desktop platforms" },
  { value: "0", label: "telemetry endpoints" },
  { value: "GPLv3", label: "open core" },
]

export function StatStrip() {
  return (
    <section className="strip">
      <div className="strip__in">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
