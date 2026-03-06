/*
  Warnings:

  - A unique constraint covering the columns `[currentSongId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PlaylistSong_playlistId_idx";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "currentSongId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Room_currentSongId_key" ON "Room"("currentSongId");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_currentSongId_fkey" FOREIGN KEY ("currentSongId") REFERENCES "RoomQueueSong"("id") ON DELETE SET NULL ON UPDATE CASCADE;
