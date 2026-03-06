/*
  Warnings:

  - You are about to drop the column `roomId` on the `RoomParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RoomParticipant` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `RoomQueueSong` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code,userEmail]` on the table `RoomParticipant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code,youtubeId]` on the table `RoomQueueSong` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `RoomParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `RoomParticipant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `RoomQueueSong` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomParticipant" DROP CONSTRAINT "RoomParticipant_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomQueueSong" DROP CONSTRAINT "RoomQueueSong_roomId_fkey";

-- DropIndex
DROP INDEX "RoomParticipant_roomId_userId_key";

-- DropIndex
DROP INDEX "RoomQueueSong_roomId_votes_idx";

-- DropIndex
DROP INDEX "RoomQueueSong_roomId_youtubeId_key";

-- AlterTable
ALTER TABLE "RoomParticipant" DROP COLUMN "roomId",
DROP COLUMN "userId",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RoomQueueSong" DROP COLUMN "roomId",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RoomParticipant_code_userEmail_key" ON "RoomParticipant"("code", "userEmail");

-- CreateIndex
CREATE INDEX "RoomQueueSong_code_votes_idx" ON "RoomQueueSong"("code", "votes");

-- CreateIndex
CREATE UNIQUE INDEX "RoomQueueSong_code_youtubeId_key" ON "RoomQueueSong"("code", "youtubeId");

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_code_fkey" FOREIGN KEY ("code") REFERENCES "Room"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomParticipant" ADD CONSTRAINT "RoomParticipant_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomQueueSong" ADD CONSTRAINT "RoomQueueSong_code_fkey" FOREIGN KEY ("code") REFERENCES "Room"("code") ON DELETE CASCADE ON UPDATE CASCADE;
