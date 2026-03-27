import PusherServer from "pusher"

const appId = process.env.PUSHER_APP_ID?.replace(/["' ]/g, "")
const key = process.env.NEXT_PUBLIC_PUSHER_KEY?.replace(/["' ]/g, "")
const secret = process.env.PUSHER_SECRET?.replace(/["' ]/g, "")
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER?.replace(/["' ]/g, "")

if (!appId || !key || !secret || !cluster) {
  console.error("PUSHER CONFIG MISSING: One or more environment variables are not set or are empty.")
}

export const pusherServer = new PusherServer({
  appId: appId || "",
  key: key || "",
  secret: secret || "",
  cluster: cluster || "ap2",
  useTLS: true,
})
