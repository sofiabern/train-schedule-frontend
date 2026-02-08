import type { Schedule } from "./types";

export const DAY_LABELS = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeOnly(iso: string): string {
  return new Date(iso).toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDaysOfWeek(days: number[] | undefined): string {
  if (!days?.length) return "—";
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length === 7) return "Щодня";
  return sorted.map((d) => DAY_LABELS[d]).join(", ");
}

export function getLastArrivalTime(s: Schedule): string {
  const stops = s.route.routeStations?.sort((a, b) => a.order - b.order) ?? [];
  const last = stops[stops.length - 1];
  if (!last?.arrivalTime) return "—";
  if (s.daysOfWeek?.length) return last.arrivalTime;
  const dateStr = s.departureTime.slice(0, 10);
  const d = new Date(`${dateStr}T${last.arrivalTime}:00`);
  return d.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
