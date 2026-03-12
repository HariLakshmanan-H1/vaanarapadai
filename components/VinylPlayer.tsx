"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"

interface VinylPlayerProps {
  songTitle: string
}

export default function VinylPlayer({ songTitle }: VinylPlayerProps) {
  const discRef = useRef<SVGGElement>(null)
  const armRef = useRef<SVGLineElement>(null)
  const wasPlayingRef = useRef<boolean | null>(null)

  useEffect(() => {
  if (!discRef.current || !armRef.current) return

  const discTween = gsap.to(discRef.current, {
    rotation: 360,
    duration: 3,
    repeat: -1,
    ease: "none",
    transformOrigin: "50% 50%",
  })

  const armTween = gsap.to(armRef.current, {
    rotation: -25,
    transformOrigin: "50px 80px",
    duration: 0.5,
    ease: "power2.inOut",
  })

  return () => {
    discTween.kill()
    armTween.kill()
  }
}, [])

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <svg width="420" height="420" viewBox="0 0 400 400" className="filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <defs>
          <linearGradient id="metal-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 0.1 }} />
            <stop offset="50%" style={{ stopColor: "#ffffff", stopOpacity: 0.05 }} />
            <stop offset="100%" style={{ stopColor: "#ffffff", stopOpacity: 0.1 }} />
          </linearGradient>
          <radialGradient id="vinyl-texture" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: "#1a1a1a", stopOpacity: 1 }} />
            <stop offset="95%" style={{ stopColor: "#0a0a0a", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0.2 }} />
          </radialGradient>
        </defs>

        {/* Turntable Base - Shadow/Depth */}
        <rect x="45" y="45" width="310" height="310" rx="30" fill="#020617" opacity="0.5" />
        
        {/* Main Base */}
        <rect
          x="40"
          y="40"
          width="320"
          height="320"
          rx="24"
          className="fill-slate-900 stroke-emerald-500/20"
          strokeWidth="1"
        />

        {/* Vinyl Disc */}
        <g ref={discRef}>
          {/* Main Disc */}
          <circle cx="200" cy="200" r="145" fill="url(#vinyl-texture)" />
          
          {/* Grooves */}
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx="200"
              cy="200"
              r={60 + i * 10}
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity="0.03"
            />
          ))}

          {/* Center Label */}
          <circle cx="200" cy="200" r="45" className="fill-emerald-500 shadow-inner" />
          <circle cx="200" cy="200" r="42" className="fill-slate-950" />
          
          <text
            x="200"
            y="198"
            textAnchor="middle"
            className="fill-emerald-400 font-black text-[10px] uppercase tracking-tighter"
          >
            {songTitle.substring(0, 15)}
          </text>
          <text
            x="200"
            y="210"
            textAnchor="middle"
            className="fill-white/40 font-bold text-[6px] uppercase tracking-[0.2em]"
          >
            Spinning Vibe
          </text>

          {/* Center Hole */}
          <circle cx="200" cy="200" r="4" fill="#10b981" />
        </g>

        {/* Shine Overlay */}
        <circle cx="200" cy="200" r="145" fill="url(#metal-shine)" pointerEvents="none" />

        {/* Tone Arm Assembly */}
        <g className="filter drop-shadow-lg">
          <circle cx="320" cy="70" r="12" fill="#1e293b" />
          <circle cx="320" cy="70" r="6" fill="#10b981" />

          {/* Tone Arm */}
          <line
            ref={armRef}
            x1="320"
            y1="70"
            x2="210"
            y2="190"
            stroke="#94a3b8"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transformOrigin: "320px 70px" }}
          />
          
          {/* Headshell */}
          <rect
            x="200"
            y="180"
            width="20"
            height="12"
            rx="2"
            fill="#10b981"
            style={{ transform: "rotate(-35deg)", transformOrigin: "210px 190px" }}
          />
        </g>
      </svg>
    </div>
  )
}