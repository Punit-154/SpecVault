const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = { "Content-Type": "application/json", ...options.headers };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  return res;
}

export async function login(email: string, password: string) {
  const res = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function signup(email: string, password: string) {
  const res = await apiFetch("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function getProducts(page = 1, limit = 10, search = "") {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  const res = await apiFetch(`/api/products?${params}`);
  return res.json();
}

export async function getProduct(id: string) {
  const res = await apiFetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await apiFetch(`/api/products/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}
