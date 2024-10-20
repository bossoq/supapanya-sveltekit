yarn run v1.22.19
$ /Users/kittipos/Code/github.com/bossoq/supapanya-sveltekit/node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
-- CreateTable
CREATE TABLE "postTable" (
    "id" BIGSERIAL NOT NULL,
    "authorId" BIGINT NOT NULL,
    "postDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "postTitle" TEXT NOT NULL,
    "postContent" TEXT NOT NULL,
    "postExcerpt" TEXT NOT NULL,
    "postStatus" TEXT NOT NULL,
    "postModified" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "postLink" TEXT NOT NULL,
    "postPicture" TEXT,

    CONSTRAINT "postTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userTable" (
    "id" BIGSERIAL NOT NULL,
    "userLogin" TEXT,
    "userPassword" TEXT,
    "displayName" TEXT,
    "meta" JSON,
    "registeredDate" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "authorised" BOOLEAN,

    CONSTRAINT "userTable1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videoTable" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT,
    "baseUrl" TEXT,
    "type" TEXT,
    "allowAll" BOOLEAN DEFAULT true,
    "allowList" JSONB,
    "fileType" TEXT NOT NULL DEFAULT 'HLS',

    CONSTRAINT "videoTable1_pkey" PRIMARY KEY ("id")
);

Done in 0.51s.
