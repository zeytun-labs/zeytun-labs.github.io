import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Static site: `next build` emits plain HTML/CSS/JS into `out/`, deployable
  // to any CDN with no Node server. No middleware / route handlers / server
  // actions / next-image loader in this app, so nothing is given up.
  // ponytail: if a CMS-backed blog or dynamic OG images land later, drop this
  // line and deploy on a runtime (Workers / Node) instead. MDX blog is fine.
  output: "export",
}

export default nextConfig
