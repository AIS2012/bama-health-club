import { getRepo } from "@/lib/repo";

async function run(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const header = request.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return Response.json({ ok: false, error: "未授權" }, { status: 401 });
  }
  const repo = await getRepo();
  const result = await repo.sendDueReminders(true);
  return Response.json({ ok: true, ...result });
}

export function GET(request: Request) {
  return run(request);
}

export function POST(request: Request) {
  return run(request);
}
