import { Search } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-lg">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-violet-500/70 dark:text-cyan-400/70" />
      </div>
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name…"
        autoComplete="off"
        className="w-full rounded-2xl border border-white/80 bg-white/80 py-3.5 pl-12 pr-5 text-base text-ink-900 shadow-glass backdrop-blur-md placeholder:text-ink-400 focus:border-violet-400/80 focus:outline-none focus:ring-2 focus:ring-violet-500/30 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-100 dark:placeholder:text-ink-500 dark:focus:border-violet-500/50 dark:focus:ring-violet-400/25"
      />
    </div>
  );
}
