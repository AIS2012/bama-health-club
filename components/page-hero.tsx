import Image from "next/image";

export function PageHero({
  kicker,
  title,
  children,
  image,
  alt,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
  image: string;
  alt: string;
}) {
  return (
    <header className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-[0_18px_50px_-32px_rgba(14,51,40,0.65)] ring-1 ring-[#14603a]/10 md:grid-cols-[1.15fr_0.85fr]">
      <div className="grid content-center gap-3 p-6 sm:p-8">
        <p className="text-base font-medium text-[#14603a]">{kicker}</p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        <div className="text-lg leading-relaxed">{children}</div>
      </div>
      <div className="relative min-h-56 md:h-full">
        <Image src={image} alt={alt} fill loading="eager" className="object-cover" sizes="(min-width: 768px) 36rem, 100vw" />
      </div>
    </header>
  );
}
