import { getPractitioners } from "@/lib/practitioners";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Directory } from "@/components/directory";
import { Footer } from "@/components/footer";

// Uncached fetch (Next 16) + DB read — render at request time, don't prerender at build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const practitioners = await getPractitioners();
  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      <Header />
      <Hero />
      <main className="relative z-10 mx-auto -mt-16 w-full max-w-4xl flex-1 px-4 pb-12 sm:px-6">
        <Directory practitioners={practitioners} />
      </main>
      <Footer />
    </div>
  );
}
