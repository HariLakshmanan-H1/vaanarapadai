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
    <div className="w-full h-full flex items-center justify-center">
      <svg width="400" height="400" viewBox="0 0 400 400" className="drop-shadow-2xl">

        {/* Turntable Base */}
        <rect
          x="50"
          y="250"
          width="300"
          height="150"
          rx="20"
          fill="#1e293b"
          stroke="#10b981"
          strokeWidth="3"
        />

        {/* Vinyl Disc */}
        <g ref={discRef}>
          <circle
            cx="200"
            cy="200"
            r="140"
            fill="#1a1a1a"
            stroke="#10b981"
            strokeWidth="2"
          />

          <circle
            cx="200"
            cy="200"
            r="50"
            fill="#0f172a"
            stroke="#22c55e"
            strokeWidth="2"
          />

          <text
            x="200"
            y="195"
            textAnchor="middle"
            fill="#10b981"
            fontSize="11"
            fontWeight="bold"
          >
            {songTitle.substring(0, 20)}
          </text>

          <text
            x="200"
            y="210"
            textAnchor="middle"
            fill="#22c55e"
            fontSize="10"
            opacity="0.7"
          >
           
          </text>
        </g>

        {/* Tone Arm */}
        <g>
          <circle cx="50" cy="80" r="8" fill="#22c55e" />

          <line
            ref={armRef}
            x1="50"
            y1="80"
            x2="180"
            y2="200"
            stroke="#10b981"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ transformOrigin: "50px 80px" }}
          />

          <circle cx="180" cy="200" r="5" fill="#22c55e" />
        </g>
      </svg>
    </div>
  )
}