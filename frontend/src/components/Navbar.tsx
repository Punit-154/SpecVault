"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (stored && token) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white border-b p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <a href={user ? "/dashboard" : "/"} className="text-xl font-bold">SpecVault</a>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <a href="/dashboard" className="text-gray-600 hover:text-black">Dashboard</a>
              <span className="text-sm text-gray-500">{user.email}</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
            </>
          ) : (
            <>
              <a href="/login" className="text-gray-600 hover:text-black">Login</a>
              <a href="/signup" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
