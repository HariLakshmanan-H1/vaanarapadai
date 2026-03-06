/*
  Warnings:

  - You are about to drop the column `leaderId` on the `Playlist` table. All the data in the column will be lost.
  - Added the required column `leaderEmail` to the `Playlist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_leaderId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "leaderId",
ADD COLUMN     "leaderEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_leaderEmail_fkey" FOREIGN KEY ("leaderEmail") REFERENCES "User"("email") ON DELETE CASCADE ON UPDATE CASCADE;
