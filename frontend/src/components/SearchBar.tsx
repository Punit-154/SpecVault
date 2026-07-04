"use client";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (e.target as HTMLFormElement).search.value;
    onSearch(q);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input name="search" placeholder="Search products..." className="flex-1 p-2 border rounded" />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Search</button>
    </form>
  );
}
