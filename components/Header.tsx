"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/30 px-6 py-4 flex items-center justify-between shadow-2xl">
      {session && (
        <div className="flex items-center gap-12 w-full justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
              <Image
                src="/monkey-logo.jpg"
                alt="Vaanarapadai Logo"
                width={56}
                height={56}
                className="relative rounded-2xl border border-white/10 shadow-2xl"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                Vaanara<span className="text-emerald-500 text-glow-emerald font-light">padai</span>
              </h1>

            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-white font-bold text-sm uppercase tracking-tight leading-none">
                {session.user?.name}
              </p>

            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-xs rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}