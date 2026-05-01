-- CreateTable
CREATE TABLE "postTable" (
    "id" BIGSERIAL NOT NULL,
    "authorId" BIGINT NOT NULL DEFAULT 1,
    "postDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postTitle" TEXT NOT NULL,
    "postContent" JSONB NOT NULL,
    "postExcerpt" TEXT,
    "postStatus" TEXT NOT NULL,
    "postLink" TEXT NOT NULL,
    "postPicture" TEXT,
    "postType" TEXT NOT NULL,
    "postModified" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" BIGINT NOT NULL DEFAULT 1,

    CONSTRAINT "postTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userTable" (
    "id" BIGSERIAL NOT NULL,
    "userLogin" TEXT NOT NULL,
    "userPassword" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "meta" JSON NOT NULL,
    "registeredDate" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorised" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "userTable1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videoTable" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "allowAll" BOOLEAN DEFAULT true,
    "fileType" TEXT NOT NULL DEFAULT 'HLS',

    CONSTRAINT "videoTable1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videoAccess" (
    "id" BIGSERIAL NOT NULL,
    "videoId" BIGINT NOT NULL,
    "userId" BIGINT NOT NULL,

    CONSTRAINT "videoAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videoProcess" (
    "id" BIGSERIAL NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spaceName" TEXT NOT NULL,
    "participants" JSONB NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "downloaded" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "teacherId" BIGINT NOT NULL DEFAULT 1,
    "className" TEXT NOT NULL,

    CONSTRAINT "videoProcess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videoAccess_videoId_userId_key" ON "videoAccess"("videoId", "userId");

-- AddForeignKey
ALTER TABLE "postTable" ADD CONSTRAINT "postTable_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "userTable"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postTable" ADD CONSTRAINT "postTable_modifiedBy_fkey" FOREIGN KEY ("modifiedBy") REFERENCES "userTable"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoAccess" ADD CONSTRAINT "videoAccess_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videoTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoAccess" ADD CONSTRAINT "videoAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "userTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videoProcess" ADD CONSTRAINT "videoProcess_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "userTable"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

