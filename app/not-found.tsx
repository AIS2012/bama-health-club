import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl font-bold">找不到這個頁面</h1>
      <p>連結可能過期，或活動已經移除。</p>
      <Link href="/" className="inline-flex h-12 items-center justify-center rounded-lg bg-[#12382c] px-4 text-white">
        回首頁
      </Link>
    </div>
  );
}
