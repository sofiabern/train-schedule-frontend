import type { User, Schedule, Train, Station, Route } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export function authLogin(username: string, password: string) {
  return api<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function authRegister(username: string, password: string) {
  return api<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// Schedules
export function schedulesList(params?: {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  dayOfWeek?: number;
}) {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.sortBy) q.set("sortBy", params.sortBy);
  if (params?.sortOrder) q.set("sortOrder", params.sortOrder);
  if (params?.dayOfWeek !== undefined && params.dayOfWeek !== null) q.set("dayOfWeek", String(params.dayOfWeek));
  const query = q.toString();
  return api<Schedule[]>(`/schedules${query ? `?${query}` : ""}`);
}

export function scheduleGet(id: string) {
  return api<Schedule>(`/schedules/${id}`);
}

export function scheduleCreate(data: {
  trainId: string;
  routeId: string;
  departureTime: string;
  daysOfWeek?: number[];
}) {
  return api<Schedule>("/schedules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function scheduleUpdate(
  id: string,
  data: { trainId?: string; routeId?: string; departureTime?: string; daysOfWeek?: number[] }
) {
  return api<Schedule>(`/schedules/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function schedulePatch(
  id: string,
  data: { trainId?: string; routeId?: string; departureTime?: string; daysOfWeek?: number[] }
) {
  return api<Schedule>(`/schedules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function scheduleDelete(id: string) {
  return api<void>(`/schedules/${id}`, { method: "DELETE" });
}

// Trains
export function trainsList(name?: string) {
  const q = name ? `?name=${encodeURIComponent(name)}` : "";
  return api<Train[]>(`/trains${q}`);
}

export function trainGet(id: string) {
  return api<Train>(`/trains/${id}`);
}

export function trainCreate(data: { name: string }) {
  return api<Train>("/trains", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function trainUpdate(id: string, data: { name?: string }) {
  return api<Train>(`/trains/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function trainDelete(id: string) {
  return api<void>(`/trains/${id}`, { method: "DELETE" });
}

// Stations
export function stationsList(name?: string) {
  const q = name ? `?name=${encodeURIComponent(name)}` : "";
  return api<Station[]>(`/stations${q}`);
}

export function stationCreate(data: { name: string }) {
  return api<Station>("/stations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function stationUpdate(id: string, data: { name: string }) {
  return api<Station>(`/stations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function stationDelete(id: string) {
  return api<void>(`/stations/${id}`, { method: "DELETE" });
}

// Routes
export function routesList(name?: string) {
  const q = name ? `?name=${encodeURIComponent(name)}` : "";
  return api<Route[]>(`/routes${q}`);
}

export function routeGet(id: string) {
  return api<Route>(`/routes/${id}`);
}

export function routeCreate(data: {
  name: string;
  routeStations: { stationId: string; order: number; arrivalTime: string; departureTime: string }[];
}) {
  return api<Route>("/routes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function routeUpdate(
  id: string,
  data: {
    name?: string;
    routeStations?: { stationId: string; order: number; arrivalTime: string; departureTime: string }[];
  }
) {
  return api<Route>(`/routes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function routeDelete(id: string) {
  return api<void>(`/routes/${id}`, { method: "DELETE" });
}
