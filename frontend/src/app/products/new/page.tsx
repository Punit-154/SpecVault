"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", brand: "", category: "", price: "", specs: "", source_url: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.brand || !form.category || !form.price) { setError("All fields except specs and URL are required"); return; }
    if (parseFloat(form.price) <= 0) { setError("Price must be greater than 0"); return; }

    const specs: Record<string, string> = {};
    if (form.specs) form.specs.split(",").forEach((pair) => { const [k, v] = pair.split(":").map(s => s.trim()); if (k && v) specs[k] = v; });

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, brand: form.brand, category: form.category, price: parseFloat(form.price), specs, source_url: form.source_url || null }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      router.push("/dashboard");
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Name *</label><input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium mb-1">Brand *</label><input name="brand" value={form.brand} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium mb-1">Category *</label><input name="category" value={form.category} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium mb-1">Price ($) *</label><input name="price" type="number" step="0.01" min="0.01" value={form.price} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium mb-1">Specs (key:value,key:value)</label><textarea name="specs" value={form.specs} onChange={handleChange} className="w-full p-2 border rounded" rows={3} placeholder="display:OLED,chip:A17 Pro" /></div>
          <div><label className="block text-sm font-medium mb-1">Source URL</label><input name="source_url" value={form.source_url} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://..." /></div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">{loading ? "Creating..." : "Create Product"}</button>
            <a href="/dashboard" className="px-6 py-2 border rounded hover:bg-gray-50">Cancel</a>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
