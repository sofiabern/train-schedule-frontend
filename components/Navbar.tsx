"use client";

import { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleNavItems = nav.filter(({ href }) => 
    isAuthenticated || href === "/schedule"
  );

  return (
    <header className="border-b border-rail-700/80 bg-rail-900/60 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/schedule" className="text-base sm:text-lg font-semibold text-amber-signal whitespace-nowrap">
            <span className="hidden sm:inline">🚂 Розклад поїздів</span>
            <span className="sm:hidden">🚂 Розклад</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleNavItems.map(({ href, label }) => (
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
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/register" className="btn-primary text-sm whitespace-nowrap">
                  Додати адміна
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="btn-ghost text-sm whitespace-nowrap"
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link href="/login" className="btn-primary text-sm whitespace-nowrap">
                Вхід
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-rail-800"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-rail-700/80 py-4 space-y-2">
            <nav className="flex flex-col gap-1">
              {visibleNavItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === href
                      ? "bg-rail-700 text-amber-signal"
                      : "text-gray-400 hover:text-white hover:bg-rail-800"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-2 border-t border-rail-700/50">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary text-sm text-center"
                  >
                    Додати адміна
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-ghost text-sm"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-sm text-center"
                >
                  Вхід
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
