export function CheckpointWindow() {
  return (
    <div className="absolute z-20 mb-4 w-full max-w-60 animate-[ckpt_3s_ease-in-out_infinite]">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex px-2.5 pb-0">
          <div className="flex gap-1 pt-2.5">
            <span className="block size-2 rounded-full bg-red-500" />
            <span className="block size-2 rounded-full bg-yellow-500" />
            <span className="block size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-1.5 mr-8 w-full text-center font-heading text-[10px] font-bold text-muted-foreground/50">
            CHECKPOINT
          </p>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex items-center gap-3 pb-3">
            <div className="size-8 shrink-0 rounded-full bg-white/10" />
            <div className="flex w-full flex-col gap-2">
              <div className="h-2 w-2/3 rounded bg-white/20" />
              <div className="h-2 w-1/3 rounded bg-white/10" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 flex-1 rounded-full border border-white/15" />
            <div className="h-6 flex-1 rounded-full bg-white/15" />
            <div className="h-6 flex-1 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}
