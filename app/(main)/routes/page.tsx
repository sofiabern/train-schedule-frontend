"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { RoutesView } from "./RoutesView";

export default function RoutesPage() {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push("/schedule");
    }
  }, [isAuthenticated, isReady, router]);

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Маршрути</h1>
      <RoutesView />
    </div>
  );
}
