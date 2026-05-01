-- Step 1: Create videoAccess join table
CREATE TABLE "videoAccess" (
    "id" BIGSERIAL NOT NULL,
    "videoId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "videoAccess_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "videoAccess_videoId_userId_key" ON "videoAccess"("videoId", "userId");

ALTER TABLE "videoAccess" ADD CONSTRAINT "videoAccess_videoId_fkey"
    FOREIGN KEY ("videoId") REFERENCES "videoTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "videoAccess" ADD CONSTRAINT "videoAccess_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "userTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 2: Migrate existing allowList JSON data into videoAccess rows.
-- Only inserts rows where the referenced user actually exists (avoids FK violations).
-- Skips videos where allowAll = true (they don't need per-user rows).
INSERT INTO "videoAccess" ("videoId", "userId")
SELECT v.id, (elem.value #>> '{}')::bigint
FROM "videoTable" v
CROSS JOIN LATERAL jsonb_array_elements(v."allowList"::jsonb) AS elem(value)
WHERE v."allowList" IS NOT NULL
  AND jsonb_typeof(v."allowList"::jsonb) = 'array'
  AND (v."allowAll" IS NULL OR v."allowAll" = false)
  AND EXISTS (
    SELECT 1 FROM "userTable" u WHERE u.id = (elem.value #>> '{}')::bigint
  )
ON CONFLICT ("videoId", "userId") DO NOTHING;

-- Step 3: Drop allowList now that data has been migrated
ALTER TABLE "videoTable" DROP COLUMN IF EXISTS "allowList";
