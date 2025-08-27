-- CreateTable
CREATE TABLE "public"."topic" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "parentId" UUID,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."year" (
    "id" SERIAL NOT NULL,
    "year" SMALLINT NOT NULL,

    CONSTRAINT "year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."value" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "value_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."topic" ADD CONSTRAINT "topic_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
