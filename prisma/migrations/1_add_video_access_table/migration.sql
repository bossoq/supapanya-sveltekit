-- Remove allowList JSON column from videoTable
ALTER TABLE "videoTable" DROP COLUMN IF EXISTS "allowList";

-- Create videoAccess join table
CREATE TABLE "videoAccess" (
    "id" BIGSERIAL NOT NULL,
    "videoId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "videoAccess_pkey" PRIMARY KEY ("id")
);

-- Unique constraint to prevent duplicate access entries
CREATE UNIQUE INDEX "videoAccess_videoId_userId_key" ON "videoAccess"("videoId", "userId");

-- Foreign keys
ALTER TABLE "videoAccess" ADD CONSTRAINT "videoAccess_videoId_fkey"
    FOREIGN KEY ("videoId") REFERENCES "videoTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "videoAccess" ADD CONSTRAINT "videoAccess_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "userTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
