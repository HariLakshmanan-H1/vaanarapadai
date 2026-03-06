"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Image from "next/image"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const containerRef = useRef(null)
  const logoRef = useRef(null)
  const textRef = useRef(null)
  const particlesRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (!logoRef.current || !containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the entire splash screen after 3 seconds
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onComplete,
        })
      },
    })

    // Scale up from tiny
    tl.from(logoRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
      // Rotate and bounce effect
      .to(
        logoRef.current,
        {
          rotation: 360,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0
      )
      // Bounce up and down
      .to(
        logoRef.current,
        {
          y: -30,
          duration: 0.4,
          ease: "power2.out",
        },
        0.3
      )
      .to(
        logoRef.current,
        {
          y: 0,
          duration: 0.4,
          ease: "bounce.out",
        },
        0.7
      )
      // Bounce again
      .to(
        logoRef.current,
        {
          y: -20,
          duration: 0.3,
          ease: "power2.out",
        },
        1.1
      )
      .to(
        logoRef.current,
        {
          y: 0,
          duration: 0.3,
          ease: "bounce.out",
        },
        1.4
      )
      // Scale pulse effect
      .to(
        logoRef.current,
        {
          scale: 1.15,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 2,
        },
        1.7
      )
      // Text animation - staggered character reveal
      .from(
        textRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: "power2.out",
        },
        0.8
      )
      // Animate each character of "GET LOST"
      .from(
        ".get-lost-char",
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: "back.out(1.2)",
          stagger: 0.08,
        },
        1.2
      )
      // Glow effect (scale shadow)
      .to(
        logoRef.current,
        {
          boxShadow:
            "0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)",
          duration: 0.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        },
        1.7
      )
      // Hold for 3 seconds total, then fade
      .to(
        logoRef.current,
        {
          opacity: 1,
          duration: 0.1,
        },
        3
      )
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 z-50"
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Logo container */}
      <div
        ref={logoRef}
        className="relative z-10 mb-8"
        style={{
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        }}
      >
        <Image
          src="/monkey-logo.jpg"
          alt="Monkey Logo"
          width={200}
          height={200}
          priority
          className="drop-shadow-2xl"
        />
      </div>

      {/* Text animation */}
      <div
        ref={textRef}
        className="text-center relative z-10"
      >
        <h1 className="text-5xl font-black text-emerald-400 tracking-tight mb-3">
          Vaanarapadai
        </h1>
        <div className="text-emerald-300/70 text-2xl font-bold tracking-wider flex justify-center gap-1">
          {Array.from("PLEASE GET LOST").map((char, index) => (
            <span
              key={index}
              className="get-lost-char inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>

      {/* Loading dots */}
      <div className="absolute bottom-20 flex gap-2 z-10">
        <div
          className="w-2 h-2 bg-emerald-400 rounded-full"
          style={{
            animation: "bounce 1.4s infinite",
            animationDelay: "0s",
          }}
        ></div>
        <div
          className="w-2 h-2 bg-emerald-400 rounded-full"
          style={{
            animation: "bounce 1.4s infinite",
            animationDelay: "0.2s",
          }}
        ></div>
        <div
          className="w-2 h-2 bg-emerald-400 rounded-full"
          style={{
            animation: "bounce 1.4s infinite",
            animationDelay: "0.4s",
          }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-20px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
