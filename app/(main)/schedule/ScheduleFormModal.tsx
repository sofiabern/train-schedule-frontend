"use client";

import { useEffect, useState } from "react";
import { trainsList, routesList, stationsList, routeCreate } from "@/lib/api";
import type { Train, Route, Schedule, Station } from "@/lib/types";
import type { RouteStationRow } from "@/components/RouteStationsEditor";
import { RouteStationsEditor } from "@/components/RouteStationsEditor";
import { DaysOfWeekPicker } from "@/components/DaysOfWeekPicker";
import { Modal } from "@/components/ui/Modal";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

type FormState = {
  trainId: string;
  routeId: string;
  daysOfWeek: number[];
};

type Props = {
  onClose: () => void;
  onSubmit: (p: {
    trainId: string;
    routeId: string;
    departureTime: string;
    daysOfWeek: number[];
  }) => Promise<void>;
  initial?: Schedule | null;
};

function toDateString(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ScheduleFormModal({ onClose, onSubmit, initial }: Props) {
  const [trains, setTrains] = useState<Train[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [form, setForm] = useState<FormState>({
    trainId: "",
    routeId: "",
    daysOfWeek: [1, 2, 3, 4, 5],
  });
  const [routeMode, setRouteMode] = useState<"existing" | "new">("existing");
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteStations, setNewRouteStations] = useState<RouteStationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([trainsList(), routesList(), stationsList()]).then(
      ([t, r, s]) => {
        setTrains(t);
        setRoutes(r);
        setStations(s);
        if (initial) {
          setForm({
            trainId: initial.trainId,
            routeId: initial.routeId,
            daysOfWeek: initial.daysOfWeek?.length
              ? [...initial.daysOfWeek]
              : [1, 2, 3, 4, 5, 6, 0],
          });
        } else {
          if (newRouteStations.length === 0 && s.length > 0) {
            setNewRouteStations([
              {
                stationId: "",
                order: 0,
                arrivalTime: "00:00",
                departureTime: "00:00",
              },
            ]);
          }
        }
      }
    );
  }, [initial]);

  function addNewStop() {
    setNewRouteStations((p) => [
      ...p,
      {
        stationId: "",
        order: p.length,
        arrivalTime: "00:00",
        departureTime: "00:00",
      },
    ]);
  }

  function updateNewStop(
    index: number,
    field: keyof RouteStationRow,
    value: string | number
  ) {
    setNewRouteStations((prev) =>
      prev
        .map((rs, i) => (i === index ? { ...rs, [field]: value } : rs))
        .map((rs, i) => ({ ...rs, order: i }))
    );
  }

  function removeNewStop(index: number) {
    setNewRouteStations((prev) =>
      prev.filter((_, i) => i !== index).map((rs, i) => ({ ...rs, order: i }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.daysOfWeek.length === 0) {
      setError("Оберіть хоча б один день тижня");
      return;
    }
    setError("");
    setLoading(true);
    try {
      let routeId = form.routeId;
      let timeStr = "00:00";

      if (routeMode === "new") {
        if (!newRouteName.trim()) {
          setError("Вкажіть назву маршруту");
          setLoading(false);
          return;
        }
        if (newRouteStations.length === 0) {
          setError("Додайте хоча б одну зупинку до маршруту");
          setLoading(false);
          return;
        }
        if (newRouteStations.some((rs) => !rs.stationId?.trim())) {
          setError("Оберіть станцію для кожної зупинки");
          setLoading(false);
          return;
        }
        const created = await routeCreate({
          name: newRouteName.trim(),
          routeStations: newRouteStations.map((rs, i) => ({
            stationId: rs.stationId,
            order: i,
            arrivalTime: rs.arrivalTime,
            departureTime: rs.departureTime,
          })),
        });
        routeId = created.id;
        const firstStop = created.routeStations?.sort(
          (a, b) => a.order - b.order
        )[0];
        timeStr = firstStop?.departureTime ?? "00:00";
      } else {
        const route = routes.find((r) => r.id === form.routeId);
        const firstStop = route?.routeStations?.sort(
          (a, b) => a.order - b.order
        )[0];
        timeStr = firstStop?.departureTime ?? "00:00";
      }

      const dateStr = initial
        ? toDateString(initial.departureTime)
        : new Date().toISOString().slice(0, 10);
      const departureTime = new Date(
        `${dateStr}T${timeStr}:00`
      ).toISOString();
      await onSubmit({
        trainId: form.trainId,
        routeId,
        departureTime,
        daysOfWeek: form.daysOfWeek,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    form.daysOfWeek.length > 0 &&
    (routeMode === "existing"
      ? !!form.routeId
      : !!newRouteName.trim() && newRouteStations.length > 0);

  return (
    <Modal onClose={onClose}>
      <div
        className={`card p-3 sm:p-4 md:p-6 w-full my-4 sm:my-6 md:my-8 mx-2 sm:mx-4 ${
          routeMode === "new" ? "max-w-full sm:max-w-xl md:max-w-2xl" : "max-w-full sm:max-w-md"
        }`}
      >
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
          {initial ? "Редагувати рейс" : "Додати рейс"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <ErrorMessage message={error} className="text-sm" />
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
              Поїзд
            </label>
            <select
              className="input text-sm sm:text-base"
              value={form.trainId}
              onChange={(e) =>
                setForm((f) => ({ ...f, trainId: e.target.value }))
              }
              required
            >
              <option value="">Оберіть поїзд</option>
              {trains.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {initial ? (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                Маршрут
              </label>
              <select
                className="input text-sm sm:text-base"
                value={form.routeId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, routeId: e.target.value }))
                }
                required
              >
                <option value="">Оберіть маршрут</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                  Маршрут
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="routeMode"
                      checked={routeMode === "existing"}
                      onChange={() => setRouteMode("existing")}
                      className="text-amber-signal focus:ring-amber-signal"
                    />
                    <span className="text-xs sm:text-sm text-gray-300">
                      Обрати існуючий маршрут
                    </span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="routeMode"
                      checked={routeMode === "new"}
                      onChange={() => {
                        setRouteMode("new");
                        if (
                          newRouteStations.length === 0 &&
                          stations.length > 0
                        ) {
                          setNewRouteStations([
                            {
                              stationId: "",
                              order: 0,
                              arrivalTime: "00:00",
                              departureTime: "00:00",
                            },
                          ]);
                        }
                      }}
                      className="text-amber-signal focus:ring-amber-signal"
                    />
                    <span className="text-xs sm:text-sm text-gray-300">
                      Створити новий маршрут
                    </span>
                  </label>
                </div>
              </div>

              {routeMode === "existing" ? (
                <div>
                  <select
                    className="input text-sm sm:text-base"
                    value={form.routeId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, routeId: e.target.value }))
                    }
                    required
                  >
                    <option value="">Оберіть маршрут</option>
                    {routes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-3 rounded-lg border border-rail-700/80 p-3 sm:p-4 bg-rail-900/30">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">
                      Назва маршруту
                    </label>
                    <input
                      type="text"
                      className="input text-sm sm:text-base"
                      value={newRouteName}
                      onChange={(e) => setNewRouteName(e.target.value)}
                      placeholder="Наприклад: Київ — Львів"
                    />
                  </div>
                  <RouteStationsEditor
                    stations={stations}
                    rows={newRouteStations}
                    onAdd={addNewStop}
                    onUpdate={updateNewStop}
                    onRemove={removeNewStop}
                    maxHeight="max-h-48 sm:max-h-64"
                  />
                </div>
              )}
            </>
          )}

          <DaysOfWeekPicker
            selected={form.daysOfWeek}
            onChange={(days) =>
              setForm((f) => ({ ...f, daysOfWeek: days }))
            }
            error={
              form.daysOfWeek.length === 0
                ? "Оберіть хоча б один день або позначте «Щодня»"
                : undefined
            }
          />

          <div className="flex flex-col sm:flex-row gap-2 justify-end pt-2">
            <button type="button" className="btn-secondary text-sm sm:text-base w-full sm:w-auto" onClick={onClose}>
              Скасувати
            </button>
            <button
              type="submit"
              className="btn-primary text-sm sm:text-base w-full sm:w-auto"
              disabled={loading || !canSubmit}
            >
              {loading ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
