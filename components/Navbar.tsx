"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { href: "/schedule", label: "Розклад" },
  { href: "/trains", label: "Поїзди" },
  { href: "/stations", label: "Станції" },
  { href: "/routes", label: "Маршрути" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-rail-700/80 bg-rail-900/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/schedule" className="text-lg font-semibold text-amber-signal">
          🚂 Розклад поїздів
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map(({ href, label }) => {
            // Показуємо тільки розклад для незалогіненого користувача
            if (!isAuthenticated && href !== "/schedule") {
              return null;
            }
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-rail-700 text-amber-signal"
                    : "text-gray-400 hover:text-white hover:bg-rail-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/register" className="btn-primary text-sm">
                Додати адміна
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="btn-ghost text-sm"
              >
                Вийти
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-sm">
              Вхід
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
