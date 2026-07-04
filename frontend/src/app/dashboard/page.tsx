"use client";

import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { getProducts } from "@/lib/api";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);
    getProducts(page, 10, search)
      .then((data) => { setProducts(data.items); setPages(data.pages); setTotal(data.total); })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page, search]);

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Products ({total})</h1>
          <a href="/products/new" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">+ Add Product</a>
        </div>
        <SearchBar onSearch={(q) => { setSearch(q); setPage(1); }} />

        {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />)}</div>}
        {error && <div className="text-center py-12"><p className="text-red-500">{error}</p><button onClick={fetchProducts} className="mt-2 text-blue-500">Retry</button></div>}
        {!loading && !error && products.length === 0 && <div className="text-center py-12"><p className="text-gray-500 text-lg">No products found</p><a href="/products/new" className="text-blue-500 mt-2 inline-block">Add your first product</a></div>}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">{products.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </>
        )}
      </div>
    </AuthGuard>
  );
}
