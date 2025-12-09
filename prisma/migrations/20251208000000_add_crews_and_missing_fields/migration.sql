-- DropIndex (uid is no longer used)
DROP INDEX IF EXISTS "Group_uid_key";

-- AlterTable: Remove uid, add expectedSize
ALTER TABLE "Group" DROP COLUMN IF EXISTS "uid",
ADD COLUMN IF NOT EXISTS "expectedSize" INTEGER;

-- CreateTable: Crew
CREATE TABLE IF NOT EXISTS "Crew" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for Crew
CREATE INDEX IF NOT EXISTS "Crew_groupId_idx" ON "Crew"("groupId");

-- AddForeignKey for Crew
ALTER TABLE "Crew" DROP CONSTRAINT IF EXISTS "Crew_groupId_fkey";
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add crew fields to FormSubmission
ALTER TABLE "FormSubmission"
ADD COLUMN IF NOT EXISTS "crewId" TEXT,
ADD COLUMN IF NOT EXISTS "isCrewLeader" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "paysSeparately" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex for FormSubmission crewId
CREATE INDEX IF NOT EXISTS "FormSubmission_crewId_idx" ON "FormSubmission"("crewId");

-- AddForeignKey for FormSubmission -> Crew
ALTER TABLE "FormSubmission" DROP CONSTRAINT IF EXISTS "FormSubmission_crewId_fkey";
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE SET NULL ON UPDATE CASCADE;
