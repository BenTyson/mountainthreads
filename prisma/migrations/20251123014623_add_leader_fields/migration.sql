-- AlterTable
ALTER TABLE "FormSubmission" ADD COLUMN     "isLeader" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "leaderEmail" TEXT,
ADD COLUMN     "leaderName" TEXT,
ADD COLUMN     "rentalEndDate" TIMESTAMP(3),
ADD COLUMN     "rentalStartDate" TIMESTAMP(3),
ADD COLUMN     "skiResort" TEXT;
