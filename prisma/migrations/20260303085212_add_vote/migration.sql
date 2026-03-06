/*
  Warnings:

  - You are about to drop the `RoomPlayback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RoomPlayback" DROP CONSTRAINT "RoomPlayback_code_fkey";

-- DropTable
DROP TABLE "RoomPlayback";

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userEmail_songId_key" ON "Vote"("userEmail", "songId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_songId_fkey" FOREIGN KEY ("songId") REFERENCES "RoomQueueSong"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
