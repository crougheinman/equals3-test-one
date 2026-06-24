import { getPractitioners } from "@/lib/practitioners";
import { Header } from "@/components/header";
import { Directory } from "@/components/directory";

// Uncached fetch (Next 16) + DB read — render at request time, don't prerender at build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const practitioners = await getPractitioners();
  return (
    <div className="min-h-full bg-zinc-50 dark:bg-black">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <Directory practitioners={practitioners} />
      </main>
    </div>
  );
}
