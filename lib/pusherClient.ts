import PusherClient from "pusher-js"

let pusherClient: PusherClient | null = null

export const getPusherClient = () => {
  if (!pusherClient) {
    // Sanitize values to remove accidental quotes or spaces from Vercel UI
    const key = (process.env.NEXT_PUBLIC_PUSHER_KEY || "").replace(/["' ]/g, "")
    const cluster = (process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2").replace(/["' ]/g, "")
    
    if (!key) {
      console.warn("Pusher client initialized without a key!")
    }

    pusherClient = new PusherClient(key, {
      cluster: cluster,
      forceTLS: true,
    })
    
    console.log("Pusher Client Initialized (Production-ready)")
  }
  return pusherClient
}
