import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/* ------------------------------------------------ */
/* 🎨 Class Name Utility */
/* ------------------------------------------------ */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ------------------------------------------------ */
/* 🔐 Secure Code Generator */
/* ------------------------------------------------ */

export function generateCode(options?: {
  length?: number
  charset?: string
}) {
  const length = options?.length ?? 6
  const charset =
    options?.charset ?? "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

  const values = new Uint32Array(length)
  globalThis.crypto.getRandomValues(values)

  let result = ""
  for (let i = 0; i < length; i++) {
    result += charset[values[i] % charset.length]
  }

  return result
}

/* ------------------------------------------------ */
/* 🏠 Standard Room Code */
/* ------------------------------------------------ */

export function generateRoomCode() {
  return generateCode({
    length: 6,
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  })
}

/* ------------------------------------------------ */
/* 🛡 Create Unique Room Code */
/* ------------------------------------------------ */

export async function createUniqueRoomCode(prisma: any) {
  while (true) {
    const code = generateRoomCode()

    const existing = await prisma.room.findUnique({
      where: { code },
    })

    if (!existing) return code
  }
}