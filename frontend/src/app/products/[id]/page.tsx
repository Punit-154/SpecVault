"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProduct, deleteProduct } from "@/lib/api";

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    getProduct(params.id).then(setProduct).finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(params.id);
      router.push("/dashboard");
    } catch {
      alert("Failed to delete product");
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto p-8">Loading...</div>;
  if (!product) return <div className="max-w-2xl mx-auto p-8"><p>Product not found</p><a href="/dashboard" className="text-blue-500">Back to Dashboard</a></div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <a href="/dashboard" className="text-blue-500 mb-4 inline-block">&larr; Back to Dashboard</a>
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-500 text-lg">{product.brand}</p>
      <p className="text-gray-500">{product.category}</p>
      <p className="text-2xl text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Specifications</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          {Object.entries(product.specs || {}).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b"><span className="font-medium">{key}</span><span className="text-gray-600">{String(value)}</span></div>
          ))}
          {Object.keys(product.specs || {}).length === 0 && <p className="text-gray-500">No specifications</p>}
        </div>
      </div>
      {product.source_url && <a href={product.source_url} target="_blank" rel="noopener noreferrer" className="mt-4 text-blue-500 inline-block">View Source &rarr;</a>}

      {/* Delete Button */}
      <div className="mt-8 pt-6 border-t">
        {confirming ? (
          <div className="flex gap-2">
            <button onClick={handleDelete} disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">
              {deleting ? "Deleting..." : "Confirm Delete"}
            </button>
            <button onClick={() => setConfirming(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)}
            className="px-4 py-2 border border-red-300 text-red-500 rounded hover:bg-red-50">Delete Product</button>
        )}
      </div>
    </div>
  );
}
