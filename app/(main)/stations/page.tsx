"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { StationsView } from "./StationsView";

export default function StationsPage() {
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
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Станції</h1>
      <StationsView />
    </div>
  );
}
