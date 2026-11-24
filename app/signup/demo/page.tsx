import { redirect } from "next/navigation";
import { ActionForm } from "@/components/action-form";
import { Button } from "@/components/ui/button";
import { demoLineLoginAction } from "@/lib/actions";
import { safeNextPath } from "@/lib/config";
import { lineConfigured } from "@/lib/line";

export const metadata = { title: "示範 LINE 登入" };

export default async function DemoLinePage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (lineConfigured()) redirect("/signup");
  const params = await searchParams;
  const next = safeNextPath(params.next, "/profile");
  return (
    <div className="mx-auto grid max-w-xl gap-6">
      <p className="rounded-2xl bg-[#fff3bf] px-4 py-3 text-lg font-medium text-[#1a1200]">示範：這不是真正的 LINE。沒有設定頻道時，用下面這個假帳號繼續。</p>
      <div className="grid gap-2">
        <p className="text-lg font-medium text-[#06C755]">LINE 示範帳號</p>
        <h1 className="text-4xl">林示範</h1>
        <p className="text-xl">顯示名稱會帶進下一步，您可以再改。</p>
      </div>
      <ActionForm action={demoLineLoginAction}>
        <input type="hidden" name="next" value={next} />
        <Button type="submit" className="min-h-16 bg-[#06C755] text-xl text-white hover:bg-[#05b34c]">
          用這個示範帳號繼續
        </Button>
      </ActionForm>
    </div>
  );
}
