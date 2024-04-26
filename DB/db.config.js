import { Prisma } from "@prisma/client";

const prisma = new Prisma({
  log: ["query", "error"],
});

export default prisma;
