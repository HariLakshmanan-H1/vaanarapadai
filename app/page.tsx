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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-emerald-400">
      <h1 
        ref={titleRef}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-emerald-400 uppercase tracking-widest drop-shadow-[0_2px_6px_rgba(16,185,129,0.6)]">
              Vaanarapadai
            </h1>

      <button
        ref={buttonRef}
        onClick={() => signIn("google")}
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-emerald-500/40 transition active:scale-95 translate-y-6 opacity-0"
      >
        Sign in with Google
      </button>
    </main>
  )
}
