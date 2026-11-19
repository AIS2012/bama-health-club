import fs from "node:fs";
import path from "node:path";
import { createSeedDb, type DemoDb } from "@/lib/demo/logic";

const file = process.env.DEMO_DB_PATH || path.join(process.cwd(), ".data", "demo-db.json");

let queue: Promise<unknown> = Promise.resolve();

function read(): DemoDb {
  if (!fs.existsSync(file)) {
    const db = createSeedDb();
    write(db);
    return db;
  }
  return JSON.parse(fs.readFileSync(file, "utf8")) as DemoDb;
}

function write(db: DemoDb) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(db));
  fs.renameSync(temporary, file);
}

export function updateDb<T>(fn: (db: DemoDb) => T): Promise<T> {
  const run = queue.then(() => {
    const db = read();
    const result = fn(db);
    write(db);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
