"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

export default function BackgroundAtmosphere() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const orbs = containerRef.current.querySelectorAll(".orb")
    
    orbs.forEach((orb) => {
      // Random movement
      gsap.to(orb, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: "random(10, 20)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Random pulse
      gsap.to(orb, {
        scale: "random(0.8, 1.2)",
        opacity: "random(0.1, 0.3)",
        duration: "random(5, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    })
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-950">
      {/* Subtle Noise */}
      <div className="noise-overlay" />
      
      {/* Animated Orbs */}
      <div 
        className="orb absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-emerald-500/10 blur-[120px]" 
      />
      <div 
        className="orb absolute top-[60%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-emerald-400/5 blur-[100px]" 
      />
      <div 
        className="orb absolute top-[20%] left-[70%] w-[30vw] h-[30vw] rounded-full bg-slate-800/20 blur-[90px]" 
      />
      <div 
        className="orb absolute top-[80%] left-[20%] w-[25vw] h-[25vw] rounded-full bg-emerald-600/5 blur-[80px]" 
      />
    </div>
  )
}
