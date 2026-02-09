"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authRegister } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isReady } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authRegister(username, password);
      setUsername("");
      setPassword("");
      setError("");
      router.push("/schedule");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка створення користувача");
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) {
    return (
      <div className="card p-8 text-center text-gray-400">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-bold text-center text-amber-signal mb-2">
        Додати адміна
      </h1>
      <p className="text-center text-gray-400 text-sm mb-6">
        Новий користувач зможе входити та керувати розкладом
      </p>
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
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Створення..." : "Додати адміна"}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400 text-sm">
        <Link href="/schedule" className="text-amber-signal hover:underline">
          Назад до розкладу
        </Link>
      </p>
    </div>
  );
}
