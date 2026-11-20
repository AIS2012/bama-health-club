import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { setReportStatusAction } from "@/lib/actions";
import { getRepo } from "@/lib/repo";

export const metadata = { title: "檢舉" };

const label = { open: "未處理", reviewed: "已查看", dismissed: "不成立" };

export default async function AdminReportsPage() {
  const reports = await (await getRepo()).adminListReports();
  if (!Array.isArray(reports)) return <p>{reports.ok ? "無法讀取檢舉" : reports.error}</p>;
  return (
    <div className="grid gap-4">
      <h2 className="text-3xl font-bold">檢舉</h2>
      {reports.length === 0 ? <p>目前沒有檢舉。</p> : null}
      {reports.map((report) => (
        <article key={report.id} className="grid gap-3 rounded-xl bg-white p-5 shadow-[0_16px_40px_-28px_rgba(14,51,40,0.55)] ring-1 ring-[#14603a]/12">
          <p className="font-medium">
            {label[report.status]} · {report.targetType === "post" ? "公告" : "會員"} · {report.reporterNickname}
          </p>
          <p>{report.reason}</p>
          <p className="break-all">對象編號：{report.targetId}</p>
          <div className="flex flex-wrap gap-3">
            {(["reviewed", "dismissed", "open"] as const).map((status) => (
              <ActionForm key={status} action={setReportStatusAction}>
                <input type="hidden" name="report_id" value={report.id} />
                <input type="hidden" name="status" value={status} />
                <Button type="submit" variant="outline">
                  標成{label[status]}
                </Button>
              </ActionForm>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
