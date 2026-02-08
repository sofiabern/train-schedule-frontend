"use client";

import type { Schedule as ScheduleType } from "@/lib/types";
import {
  formatTime,
  formatTimeOnly,
  formatDaysOfWeek,
  getLastArrivalTime,
} from "@/lib/format";

type Props = {
  items: ScheduleType[];
  isAuthenticated: boolean;
  onDetail: (s: ScheduleType) => void;
  onEdit: (s: ScheduleType) => void;
  onDelete: (id: string) => void;
};

export function ScheduleTable({
  items,
  isAuthenticated,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-rail-700 bg-rail-800/60">
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                Поїзд
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                Маршрут
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                Час відправлення
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                Час прибуття
              </th>
              <th className="text-left py-3 px-4 text-gray-400 font-medium">
                Дні
              </th>
              <th className="text-right py-3 px-4 text-gray-400 font-medium w-40">
                Дії
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr
                key={s.id}
                className="border-b border-rail-700/50 hover:bg-rail-800/30"
              >
                <td className="py-3 px-4">
                    <span className="font-medium">{s.train.name}</span>
                </td>
                <td className="py-3 px-4">
                  {s.route.name}
                  {s.route.routeStations?.length ? (
                    <span className="text-gray-500 text-sm block mt-0.5">
                      {s.route.routeStations
                        .map((rs) => rs.station.name)
                        .join(" → ")}
                    </span>
                  ) : null}
                </td>
                <td className="py-3 px-4 text-amber-signal/90">
                  {s.daysOfWeek?.length
                    ? formatTimeOnly(s.departureTime)
                    : formatTime(s.departureTime)}
                </td>
                <td className="py-3 px-4 text-amber-signal/80">
                  {getLastArrivalTime(s)}
                </td>
                <td className="py-3 px-4 text-gray-400 text-sm">
                  {formatDaysOfWeek(s.daysOfWeek)}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    className="btn-ghost text-sm mr-1"
                    onClick={() => onDetail(s)}
                  >
                    Деталі
                  </button>
                  {isAuthenticated && (
                    <>
                      <button
                        type="button"
                        className="btn-ghost text-sm mr-1"
                        onClick={() => onEdit(s)}
                      >
                        Змінити
                      </button>
                      <button
                        type="button"
                        className="btn-ghost text-sm text-red-400 hover:text-red-300"
                        onClick={() => onDelete(s.id)}
                      >
                        Видалити
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
