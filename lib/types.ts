export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface Station {
  id: string;
  name: string;
}

export interface Train {
  id: string;
  name: string;
}

export interface RouteStation {
  id: string;
  stationId: string;
  order: number;
  arrivalTime: string; // "HH:mm"
  departureTime: string; // "HH:mm"
  station: Station;
}

export interface Route {
  id: string;
  name: string;
  routeStations?: RouteStation[];
}

export interface Schedule {
  id: string;
  trainId: string;
  routeId: string;
  departureTime: string;
  daysOfWeek?: number[]; // 0=Нд, 1=Пн, ..., 6=Сб
  train: Train;
  route: Route;
}

export interface RouteStationItem {
  stationId: string;
  order: number;
  arrivalTime: string; // "HH:mm"
  departureTime: string; // "HH:mm"
}

export type ScheduleSortBy = "departureTime" | "arrivalTime" | "trainName" | "routeName";
export type SortOrder = "asc" | "desc";
