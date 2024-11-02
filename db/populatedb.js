require("dotenv").config();

const { Client } = require("pg");

const SQL = `

DROP TYPE IF EXISTS membership_status CASCADE;
 
DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS messages;

DROP TABLE IF EXISTS session;

CREATE TYPE membership_status AS ENUM ('non-member', 'member', 'admin');

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, first_name VARCHAR(30), last_name VARCHAR(30), email VARCHAR(30), password VARCHAR(255), confirm_password VARCHAR(255), membership_status membership_status);

CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title VARCHAR(50), content VARCHAR(255), timestamp DATE, user_id INTEGER REFERENCES users (id) NOT NULL);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

`;

async function main() {
  try {
    console.log("seeding...");

    const client = new Client({
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await client.connect();

    await client.query(SQL);

    await client.end();

    console.log("done");
  } catch (err) {
    console.error("An error occurred when seeing", err);
    throw err;
  }
}

main();
