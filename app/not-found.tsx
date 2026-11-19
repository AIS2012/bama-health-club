import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid gap-4">
      <h1 className="text-4xl font-bold">找不到這個頁面</h1>
      <p>連結可能過期，或活動已經移除。</p>
      <Link href="/" className="inline-flex h-12 items-center justify-center rounded-full bg-[#14603a] transition-colors hover:bg-[#0f5132] px-4 text-white">
        回首頁
      </Link>
    </div>
  );
}
