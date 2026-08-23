"use client"
import { useEffect, useRef, useState } from "react"
import { Icon } from "./icons"

export function MacOSDesktop({ children }: { children?: React.ReactNode }) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      )
    }
    updateTime()
    const int = setInterval(updateTime, 10000)
    return () => clearInterval(int)
  }, [])

  return (
    <div className="relative z-20 flex w-full flex-col overflow-hidden rounded-[18px] bg-black shadow-2xl">
      {/* Inner stroke effect tightly wrapping the Mac content */}
      <div
        className="pointer-events-none absolute inset-0 z-50 rounded-[18px] border border-white/5"
        style={{
          boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.15)",
        }}
      ></div>

      {/* Aspect ratio bounding box */}
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-black p-12">
        {/* Static macOS Wallpaper */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')",
          }}
        />

        {/* macOS Topbar */}
        <div className="absolute top-0 left-0 z-50 flex h-7 w-full items-center justify-between border-b border-white/10 bg-black/20 px-3 text-[13px] font-medium tracking-wide text-white/90 backdrop-blur-md select-none">
          {/* Left: App Menus */}
          <div className="flex h-full items-center gap-4">
            <span className="flex items-center justify-center">
              {/* Apple Logo SVG */}
              <svg
                viewBox="0 0 170 170"
                className="h-3.5 w-3.5 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M150.37,130.25c-2.45,5.66-5.35,10.87-8.71,15.66-4.58,6.53-8.33,11.05-11.22,13.56-4.48,4.12-9.28,6.23-14.42,6.23-1.69,0-4.39-0.42-8.08-1.24-3.68-0.83-6.52-1.24-8.5-1.24-2.84,0-5.91,0.47-9.23,1.42-3.32,0.94-5.63,1.42-6.93,1.42-4.13,0-8.56-1.84-13.28-5.52-3.78-2.6-7.81-7.51-12.09-14.73-6.42-10.37-10.45-20.27-12.09-29.69-1.99-10.51-1.35-18.78,1.94-24.8,2.74-5.42,6.56-9.84,11.45-13.25,4.88-3.41,10.23-5.11,16.03-5.11,2.09,0,4.8.47,8.14,1.42,3.34.94,5.43,1.42,6.28,1.42,1.3,0,4.28-0.66,8.96-1.99,4.68-1.32,9.33-1.99,13.94-1.99,7.6,0,14.15,2.15,19.62,6.46,4.03,3.31,6.85,7.39,8.47,12.24-11.25,5.49-16.19,13.88-14.84,25.17,1.39,10.15,7.74,17.2,19.03,21.14C152.88,122.9,151.77,126.54,150.37,130.25ZM116.32,32.32c-0.1,5.28-2.03,10.15-5.8,14.61-4.73,5.66-10.61,8.96-17.63,9.89-0.3-5.11,1.54-10,5.52-14.67,4.38-5.38,10.03-8.68,16.94-9.89C115.65,27.17,115.93,28.79,116.32,32.32Z" />
              </svg>
            </span>
            <span className="cursor-default font-bold hover:text-white">
              Zeytun
            </span>
            <span className="cursor-default hover:text-white">File</span>
            <span className="cursor-default hover:text-white">Edit</span>
            <span className="cursor-default hover:text-white">View</span>
            <span className="cursor-default hover:text-white">Window</span>
            <span className="cursor-default hover:text-white">Help</span>
          </div>

          {/* Right: Trays */}
          <div className="flex h-full items-center gap-3">
            <span className="flex cursor-default items-center hover:text-white">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.5C11.605 21.5 11.2413 21.3533 10.9088 21.06C10.5763 20.7667 10.41 20.4267 10.41 20.04L10.42 16.96C10.42 16.5133 10.5825 16.1433 10.9075 15.85C11.2325 15.5567 11.5967 15.41 12 15.41C12.4033 15.41 12.7675 15.5567 13.0925 15.85C13.4175 16.1433 13.58 16.5133 13.58 16.96L13.59 20.04C13.59 20.4267 13.4238 20.7667 13.0912 21.06C12.7588 21.3533 12.395 21.5 12 21.5ZM12 13.5C10.5333 13.5 9.17083 13.1617 7.9125 12.485C6.65417 11.8083 5.61667 10.8717 4.8 9.67499C4.54 9.27499 4.45333 8.87833 4.54 8.485C4.62667 8.09166 4.85667 7.76833 5.23 7.51499C5.55 7.28833 5.91833 7.18 6.335 7.18999C6.75167 7.19999 7.09667 7.37 7.37 7.7C8.01 8.52666 8.79917 9.17666 9.7375 9.64999C10.6758 10.1233 11.43 10.36 12 10.36C12.57 10.36 13.3242 10.1233 14.2625 9.64999C15.2008 9.17666 15.99 8.52666 16.63 7.7C16.91 7.35333 17.26 7.17333 17.68 7.15999C18.1 7.14666 18.47 7.25499 18.79 7.48499C19.1633 7.73833 19.3883 8.05833 19.465 8.445C19.5417 8.83166 19.455 9.22499 19.205 9.62499C18.385 10.8217 17.3475 11.7583 16.0925 12.435C14.8375 13.1117 13.4733 13.5 12 13.5ZM12 6.1C9.07 6.1 6.37667 5.37833 3.92 3.935C1.46333 2.49166 0.17 0.941663 0.04 0.284997C-0.0333333 0.051663 -0.0116667 -0.165003 0.09 -0.365003C0.191667 -0.565003 0.355 -0.718337 0.58 -0.825004C0.846667 -0.93167 1.13 -0.958337 1.43 -0.905003C1.73 -0.85167 1.97 -0.718337 2.15 -0.505004C2.39 -0.278337 3.52833 1.05 5.565 2.48C7.60167 3.91 9.74667 4.625 12 4.625C14.2533 4.625 16.3983 3.91 18.435 2.48C20.4717 1.05 21.61 -0.278337 21.85 -0.505004C22.04 -0.718337 22.2833 -0.85167 22.58 -0.905003C22.8767 -0.958337 23.1567 -0.93167 23.42 -0.825004C23.6467 -0.718337 23.81 -0.565003 23.91 -0.365003C24.01 -0.165003 24.0333 0.051663 23.96 0.284997C23.83 0.941663 22.5367 2.49166 20.08 3.935C17.6233 5.37833 14.93 6.1 12 6.1Z" />
              </svg>
            </span>
            <span className="flex cursor-default items-center hover:text-white">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.33 6h-11.66c-1.8 0-3.3 1.4-3.3 3.14v5.72c0 1.74 1.5 3.14 3.3 3.14h11.66c1.8 0 3.3-1.4 3.3-3.14v-5.72c0-1.74-1.5-3.14-3.3-3.14zM16 16h-9c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h9c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1zm5.5-8.5v5c0 .38-.2.74-.53.92-.16.09-.34.13-.5.13-.2 0-.4-.06-.57-.18l-.9-.63v-3.48l.9-.63c.31-.22.72-.25 1.07-.05.33.18.53.54.53.92z" />
              </svg>
            </span>
            <span className="cursor-default hover:text-white">
              {time || "2:13 PM"}
            </span>
          </div>
        </div>
      </div>

      {/* App content placeholder */}
      {children}
    </div>
  )
}
