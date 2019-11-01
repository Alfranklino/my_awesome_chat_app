exports.up = pgm => {
  pgm.sql(`
        CREATE TABLE "chatwithme"."users" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "password" VARCHAR(255) NOT NULL,
            "email" VARCHAR(255) NOT NULL UNIQUE,
            "date_created" TIMESTAMP NOT NULL DEFAULT NOW(),
            "date_of_birth" DATE,
            "fullname" VARCHAR(128),
            "phone_number" VARCHAR(32),
            "avatar" TEXT,
            "location" VARCHAR(64),
            "status" VARCHAR(64)
        );
    `),
    pgm.sql(`
        CREATE TABLE "chatwithme"."groups" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "created_by" INT REFERENCES chatwithme.users(id),
            "group_title" VARCHAR(128),
            "time_created" TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `),
    pgm.sql(`
        CREATE TABLE "chatwithme"."messages" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "content" TEXT NOT NULL,
            "from_user" INT REFERENCES chatwithme.users(id) ON DELETE CASCADE,
            "to_user" INT REFERENCES chatwithme.users(id) ON DELETE CASCADE,
            "to_group" INT REFERENCES chatwithme.groups(id) ON DELETE CASCADE,
            "time_created" TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `),
    pgm.sql(`
        CREATE TABLE "chatwithme"."groupsmembers" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "member_id" INT REFERENCES chatwithme.users(id) ON DELETE CASCADE,
            "group_id" INT REFERENCES chatwithme.groups(id) ON DELETE CASCADE,
            "time_added" TIMESTAMP NOT NULL DEFAULT NOW()
        );
    `),
    pgm.sql(`
        CREATE TABLE "chatwithme"."usersessions" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "user_id" INT REFERENCES chatwithme.users(id) ON DELETE CASCADE,
            "time_session_starts" TIMESTAMP NOT NULL DEFAULT NOW(),
            "time_session_ends" TIMESTAMP
        );
    `);
};
