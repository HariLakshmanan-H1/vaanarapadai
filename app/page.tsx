"use client"

import { signIn, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import SplashScreen from "@/components/SplashScreen"

export default function LandingPage() {
  const { status } = useSession()
  const router = useRouter()
  const [showSplash, setShowSplash] = useState(true)

  const titleRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/room/create")
    }
  }, [status, router])

  useEffect(() => {
    if (!showSplash && titleRef.current && buttonRef.current) {
      const tl = gsap.timeline()

      // Animate TO visible state instead of FROM hidden
      tl.to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      }).to(
        buttonRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.6"
      )
    }
  }, [showSplash])

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white px-6">
      <div className="text-center space-y-8 relative">
        {/* Decorative element */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />

        <h1
          ref={titleRef}
          className="text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-tight opacity-0 translate-y-8"
        >
          Vaanara<span className="text-emerald-500 text-glow-emerald">padai</span>
        </h1>



        <div ref={buttonRef} className="opacity-0 translate-y-6 pt-8">
          <button
            onClick={() => signIn("google")}
            className="group relative px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-sm rounded-full shadow-2xl shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10">Connect with Google</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </main>
  )
}
