-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(200);

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "image" VARCHAR(100),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_title_key" ON "News"("title");

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
