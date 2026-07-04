"use client";

export default function ProductCard({ product }: { product: any }) {
  return (
    <a href={`/products/${product.id}`} className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-500">{product.brand}</p>
      <p className="text-gray-500 text-sm">{product.category}</p>
      <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
    </a>
  );
}
