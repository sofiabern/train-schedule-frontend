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
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                Поїзд
              </th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                Маршрут
              </th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                <span className="hidden sm:inline">Час відправлення</span>
                <span className="sm:hidden">Відправ.</span>
              </th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                <span className="hidden sm:inline">Час прибуття</span>
                <span className="sm:hidden">Прибуття</span>
              </th>
              <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm hidden md:table-cell">
                Дні
              </th>
              <th className="text-right py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm w-32 sm:w-40">
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
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                    <span className="font-medium text-sm sm:text-base">{s.train.name}</span>
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4">
                  <span className="text-sm sm:text-base">{s.route.name}</span>
                  {s.route.routeStations?.length ? (
                    <span className="text-gray-500 text-xs sm:text-sm block mt-0.5">
                      {s.route.routeStations
                        .map((rs) => rs.station.name)
                        .join(" → ")}
                    </span>
                  ) : null}
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-amber-signal/90 text-xs sm:text-sm">
                  {s.daysOfWeek?.length
                    ? formatTimeOnly(s.departureTime)
                    : formatTime(s.departureTime)}
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-amber-signal/80 text-xs sm:text-sm">
                  {getLastArrivalTime(s)}
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-400 text-xs sm:text-sm hidden md:table-cell">
                  {formatDaysOfWeek(s.daysOfWeek)}
                </td>
                <td className="py-2 px-2 sm:py-3 sm:px-4 text-right">
                  <div className="flex flex-wrap gap-1 justify-end">
                    <button
                      type="button"
                      className="btn-ghost text-xs sm:text-sm px-2 sm:px-3"
                      onClick={() => onDetail(s)}
                    >
                      Деталі
                    </button>
                    {isAuthenticated && (
                      <>
                        <button
                          type="button"
                          className="btn-ghost text-xs sm:text-sm px-2 sm:px-3"
                          onClick={() => onEdit(s)}
                        >
                          <span className="hidden sm:inline">Змінити</span>
                          <span className="sm:hidden">✏️</span>
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs sm:text-sm text-red-400 hover:text-red-300 px-2 sm:px-3"
                          onClick={() => onDelete(s.id)}
                        >
                          <span className="hidden sm:inline">Видалити</span>
                          <span className="sm:hidden">🗑️</span>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
