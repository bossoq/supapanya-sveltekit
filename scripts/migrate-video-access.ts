/**
 * Data migration: videoTable.allowList JSON → videoAccess join table
 *
 * Run AFTER the videoAccess table has been created but BEFORE allowList is dropped:
 *   npx tsx scripts/migrate-video-access.ts
 *
 * Safe to re-run — conflicts are ignored via ON CONFLICT DO NOTHING.
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type VideoRow = { id: bigint; allowList: unknown; allowAll: boolean | null }

async function main() {
  console.log('Reading videos with allowList data...')

  const videos = await prisma.$queryRaw<VideoRow[]>`
    SELECT id, "allowList", "allowAll"
    FROM "videoTable"
    WHERE "allowList" IS NOT NULL
  `

  if (videos.length === 0) {
    console.log('No videos with allowList found. Nothing to migrate.')
    return
  }

  console.log(`Found ${videos.length} video(s) with allowList.`)

  let inserted = 0
  let skippedMissingUser = 0
  let skippedInvalidEntry = 0

  for (const video of videos) {
    const allowList = video.allowList

    if (!Array.isArray(allowList) || allowList.length === 0) {
      console.log(`  Video ${video.id}: allowList is empty or not an array, skipping.`)
      continue
    }

    // allowAll=true videos are already open to everyone — no per-user rows needed
    if (video.allowAll === true) {
      console.log(`  Video ${video.id}: allowAll=true, skipping per-user rows.`)
      continue
    }

    console.log(`  Video ${video.id}: migrating ${allowList.length} user(s)...`)

    for (const entry of allowList) {
      const userId = typeof entry === 'number' ? BigInt(entry) : null
      if (userId === null) {
        console.warn(`    Invalid entry in allowList: ${JSON.stringify(entry)}, skipping.`)
        skippedInvalidEntry++
        continue
      }

      const user = await prisma.userTable.findUnique({ where: { id: userId } })
      if (!user) {
        console.warn(`    User ${userId} not found in userTable, skipping.`)
        skippedMissingUser++
        continue
      }

      await prisma.$executeRaw`
        INSERT INTO "videoAccess" ("videoId", "userId")
        VALUES (${video.id}, ${userId})
        ON CONFLICT ("videoId", "userId") DO NOTHING
      `
      inserted++
    }
  }

  console.log('\nMigration complete.')
  console.log(`  Inserted:             ${inserted}`)
  console.log(`  Skipped (no user):    ${skippedMissingUser}`)
  console.log(`  Skipped (bad entry):  ${skippedInvalidEntry}`)

  if (skippedMissingUser > 0) {
    console.warn('\nWARNING: Some user IDs in allowList had no matching userTable row.')
    console.warn('Check the skipped entries above before dropping the allowList column.')
  }
}

main()
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
