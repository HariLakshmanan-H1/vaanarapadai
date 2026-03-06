-- CreateTable
CREATE TABLE "RoomPlayback" (
    "code" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "isPlaying" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" BIGINT,
    "pausedAt" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomPlayback_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "RoomPlayback" ADD CONSTRAINT "RoomPlayback_code_fkey" FOREIGN KEY ("code") REFERENCES "Room"("code") ON DELETE CASCADE ON UPDATE CASCADE;
