"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authLogin } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { access_token } = await authLogin(username, password);
      login(access_token);
      router.push("/schedule");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка входу");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-bold text-center text-amber-signal mb-6">
        Вхід
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-900/40 border border-red-600 text-red-200 px-4 py-2 text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Ім&apos;я користувача
          </label>
          <input
            type="text"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Пароль
          </label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Вхід..." : "Увійти"}
        </button>
      </form>
      <p className="mt-6 text-center">
        <Link href="/schedule" className="text-gray-500 hover:text-gray-300 text-sm">
          Переглянути розклад без входу
        </Link>
      </p>
    </div>
  );
}
