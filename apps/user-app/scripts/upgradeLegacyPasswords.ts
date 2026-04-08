import { PrismaClient } from "../../../packages/db/generated/prisma/client";
import { randomBytes, scryptSync } from "crypto";

const db = new PrismaClient();

async function upgradeLegacy() {
  const findUsers = await db.user.findMany({
    select: { id: true, password: true, phone: true },
  });

  for (const user of findUsers) {
    if (!user.password || user.password.includes(":")) continue;

    const unHashedPassword = user.password;
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(unHashedPassword, salt, 64).toString("hex");
    const storedPassword = `${salt}:${hashedPassword}`;

    await db.user.updateMany({
      where: { id: user.id },
      data: { password: storedPassword },
    });

    console.log(`upgrading ${user.phone ?? user.id}`);
  }
}

async function main() {
  try {
    await upgradeLegacy();
  } catch (err) {
    console.error("migration failed", err);
  } finally {
    await db.$disconnect();
    console.log("DB-DISCONNECTED");
  }
}

main().catch((err) => console.error("unhandled", err));

