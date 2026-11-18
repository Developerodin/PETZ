import { MongoMemoryServer } from "mongodb-memory-server";
import { writeFileSync } from "fs";

const mongod = await MongoMemoryServer.create({
  instance: { port: 27017, dbName: "petz" },
});
const uri = mongod.getUri("petz");
console.log("MongoMemoryServer ready:", uri);
writeFileSync(new URL("../.mongo-uri", import.meta.url), uri);
// keep alive
process.on("SIGINT", async () => {
  await mongod.stop();
  process.exit(0);
});
await new Promise(() => {});
