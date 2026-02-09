"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { TrainsView } from "./TrainsView";

export default function TrainsPage() {
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
      <h1 className="text-2xl font-bold text-white mb-6">Поїзди</h1>
      <TrainsView />
    </div>
  );
}
