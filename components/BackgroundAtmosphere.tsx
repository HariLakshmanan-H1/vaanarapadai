"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function BackgroundAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const orbs = containerRef.current.querySelectorAll(".orb")

    orbs.forEach((orb) => {
      // Slow, gentle movement — keeps the scene alive without hammering the GPU
      gsap.to(orb, {
        x: "random(-80, 80)",
        y: "random(-80, 80)",
        duration: "random(12, 22)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Soft pulse in opacity only — no scale changes that would invalidate blur layers
      gsap.to(orb, {
        opacity: "random(0.6, 1.0)",
        duration: "random(6, 12)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950"
    >
      {/* Static noise overlay (cheap PNG texture, not SVG feTurbulence) */}
      <div className="noise-overlay transform-gpu" />

      {/*
        Orbs — each one is a radial-gradient instead of a solid colour + blur filter.
        Radial gradients are rasterised once as a texture and composited by the GPU
        without any per-frame filter arithmetic, so they are essentially free to animate.
      */}

      {/* Top-left large emerald orb */}
      <div
        className="orb absolute top-[10%] left-[15%] w-[45vw] h-[45vw] rounded-full transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.13) 0%, rgba(16,185,129,0.04) 45%, transparent 70%)",
          willChange: "transform, opacity",
        }}
      />

      {/* Bottom-right medium orb */}
      <div
        className="orb absolute top-[55%] left-[58%] w-[38vw] h-[38vw] rounded-full transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.02) 50%, transparent 70%)",
          willChange: "transform, opacity",
        }}
      />

      {/* Top-right subtle slate orb */}
      <div
        className="orb absolute top-[15%] left-[68%] w-[32vw] h-[32vw] rounded-full transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(30,41,59,0.35) 0%, rgba(30,41,59,0.1) 50%, transparent 70%)",
          willChange: "transform, opacity",
        }}
      />

      {/* Bottom-left faint accent orb */}
      <div
        className="orb absolute top-[75%] left-[18%] w-[28vw] h-[28vw] rounded-full transform-gpu"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 65%)",
          willChange: "transform, opacity",
        }}
      />
    </div>
  )
}
