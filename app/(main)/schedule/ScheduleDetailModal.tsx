"use client";

import type { Schedule } from "@/lib/types";
import { formatDaysOfWeek } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";

type Props = {
  schedule: Schedule;
  onClose: () => void;
};

export function ScheduleDetailModal({ schedule, onClose }: Props) {
  const stops = (schedule.route.routeStations ?? []).sort(
    (a, b) => a.order - b.order
  );

  return (
    <Modal onClose={onClose}>
      <div className="card p-6 w-full max-w-md max-h-[80vh] overflow-y-auto scrollbar-amber">
        <h2 className="text-xl font-bold text-white mb-2">
          {schedule.train.name} — {schedule.route.name}
        </h2>
        {schedule.daysOfWeek?.length ? (
          <p className="text-gray-400 text-sm mb-4">
            Дні: {formatDaysOfWeek(schedule.daysOfWeek)}
          </p>
        ) : null}
        <ul className="space-y-2 text-gray-200">
          {stops.map((rs, i, arr) => {
            const isFirst = i === 0;
            const isLast = i === arr.length - 1;
            return (
              <li key={rs.id} className="text-sm">
                <span className="font-medium text-white">
                  {rs.station?.name ?? "—"}
                </span>
                {isFirst && !isLast && (
                  <span className="text-gray-400 ml-2">
                    відправлення {rs.departureTime}
                  </span>
                )}
                {!isFirst && isLast && (
                  <span className="text-gray-400 ml-2">
                    прибуття {rs.arrivalTime}
                  </span>
                )}
                {!isFirst && !isLast && (
                  <span className="text-gray-400 ml-2">
                    прибуття {rs.arrivalTime}, відправлення {rs.departureTime}
                  </span>
                )}
                {isFirst && isLast && (
                  <span className="text-gray-400 ml-2">
                    відправлення {rs.departureTime}, прибуття {rs.arrivalTime}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
          >
            Закрити
          </button>
        </div>
      </div>
    </Modal>
  );
}
