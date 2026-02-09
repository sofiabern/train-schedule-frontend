"use client";

import type { Station } from "@/lib/types";

export type RouteStationRow = {
  stationId: string;
  order: number;
  arrivalTime: string;
  departureTime: string;
};

type Props = {
  stations: Station[];
  rows: RouteStationRow[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof RouteStationRow, value: string | number) => void;
  onRemove: (index: number) => void;
  addButtonLabel?: string;
  maxHeight?: string;
};

export function RouteStationsEditor({
  stations,
  rows,
  onAdd,
  onUpdate,
  onRemove,
  addButtonLabel = "+ Додати зупинку",
  maxHeight = "max-h-48",
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          Зупинки маршруту
        </label>
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={onAdd}
        >
          {addButtonLabel}
        </button>
      </div>
      <div className={`space-y-2 overflow-y-auto scrollbar-amber ${maxHeight}`}>
        <div className="grid gap-2 p-2 text-xs text-gray-500 font-medium grid-cols-[minmax(8rem,14rem)_7.5rem_7.5rem_auto] items-center">
          <span>Станція</span>
          <span>Прибуття</span>
          <span>Відправлення</span>
          <span aria-hidden />
        </div>
        {rows.map((rs, i) => {
          const isFirst = i === 0;
          const isLast = i === rows.length - 1;
          return (
            <div
              key={i}
              className="grid gap-2 p-2 rounded-lg bg-rail-800/50 items-center grid-cols-[minmax(8rem,14rem)_7.5rem_7.5rem_auto]"
            >
              <select
                className="input min-w-0"
                value={rs.stationId}
                onChange={(e) => onUpdate(i, "stationId", e.target.value)}
                aria-label="Станція"
              >
                <option value="">Оберіть станцію</option>
                {stations.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {isFirst ? (
                <span
                  className="block w-full text-gray-500 text-sm text-center"
                  title="На початковій станції вказується лише час відправлення"
                >
                  Початок
                </span>
              ) : (
                <input
                  type="time"
                  className="input w-full min-w-0 cursor-pointer"
                  value={rs.arrivalTime}
                  onChange={(e) => onUpdate(i, "arrivalTime", e.target.value)}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.focus();
                    if ('showPicker' in target && typeof target.showPicker === 'function') {
                      target.showPicker();
                    }
                  }}
                  aria-label="Час прибуття"
                  title="Клікніть для вибору часу"
                />
              )}
              {isLast && !isFirst ? (
                <span
                  className="block w-full text-gray-500 text-sm text-center"
                  title="На кінцевій станції вказується лише час прибуття"
                >
                  Кінцева
                </span>
              ) : (
                <input
                  type="time"
                  className="input w-full min-w-0 cursor-pointer"
                  value={rs.departureTime}
                  onChange={(e) => onUpdate(i, "departureTime", e.target.value)}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.focus();
                    if ('showPicker' in target && typeof target.showPicker === 'function') {
                      target.showPicker();
                    }
                  }}
                  aria-label="Час відправлення"
                  title="Клікніть для вибору часу"
                />
              )}
              <button
                type="button"
                className="btn-ghost text-red-400 text-sm"
                onClick={() => onRemove(i)}
                aria-label="Видалити зупинку"
              >
                Видалити
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
