"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b-2 border-emerald-500 shadow-[0_4px_20px_rgba(16,185,129,0.4)] backdrop-blur-sm">
      
      {session && (
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <Image
              src="/monkey-logo.jpg"
              alt="Vaanarapadai Logo"
              width={64}
              height={64}
              className="rounded-2xl border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-200"
            />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-emerald-400 uppercase tracking-widest drop-shadow-[0_2px_6px_rgba(16,185,129,0.6)]">
              Vaanarapadai
            </h1>
          </div>

          {/* User Info & Logout */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <p className="text-emerald-300 font-semibold text-lg sm:text-xl drop-shadow-[0_1px_3px_rgba(16,185,129,0.5)]">
              {session.user?.name}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2 bg-gradient-to-tr from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 font-black uppercase rounded-2xl shadow-[0_0_12px_rgba(16,185,129,0.5)] border-2 border-emerald-400 hover:border-emerald-300 transition-all duration-200 active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  )
}