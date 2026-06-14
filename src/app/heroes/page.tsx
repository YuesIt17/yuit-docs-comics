import Link from "next/link";
import { getCharacters } from "@/lib/content";
import { HeroCard } from "@/components/heroes/HeroCard";

export default function HeroesPage() {
  const characters = getCharacters();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-panel-border px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Meet the Heroes</h1>
          <p className="text-sm text-slate-400">
            The Staff Engineering Team — your communication companions
          </p>
        </div>
        <Link
          href="/episodes/hr-intro"
          className="text-sm text-accent-cyan hover:underline"
        >
          ← Back to Episode
        </Link>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {characters.map((character) => (
            <HeroCard key={character.id} character={character} />
          ))}
        </div>
      </main>
    </div>
  );
}
