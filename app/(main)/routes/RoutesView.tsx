"use client";

import { useCallback, useEffect, useState } from "react";
import {
  routesList,
  routeCreate,
  routeUpdate,
  routeDelete,
  stationsList,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Route, Station } from "@/lib/types";
import type { RouteStationRow } from "@/components/RouteStationsEditor";
import { RouteStationsEditor } from "@/components/RouteStationsEditor";
import { Modal } from "@/components/ui/Modal";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState, EmptyState } from "@/components/ui/LoadingEmpty";

export function RoutesView() {
  const [items, setItems] = useState<Route[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Route | null>(null);
  const [name, setName] = useState("");
  const [routeStations, setRouteStations] = useState<RouteStationRow[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await routesList();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  useEffect(() => {
    stationsList().then(setStations);
  }, []);

  function openAdd() {
    setEditing(null);
    setName("");
    setRouteStations([
      {
        stationId: "",
        order: 0,
        arrivalTime: "00:00",
        departureTime: "00:00",
      },
    ]);
    setModal("add");
  }

  function openEdit(r: Route) {
    setEditing(r);
    setName(r.name);
    setRouteStations(
      (r.routeStations ?? []).map((rs) => ({
        stationId: rs.stationId,
        order: rs.order,
        arrivalTime: rs.arrivalTime ?? "00:00",
        departureTime: rs.departureTime ?? "00:00",
      }))
    );
    setModal("edit");
  }

  function addStop() {
    setRouteStations((p) => [
      ...p,
      {
        stationId: "",
        order: p.length,
        arrivalTime: "00:00",
        departureTime: "00:00",
      },
    ]);
  }

  function updateStop(
    index: number,
    field: keyof RouteStationRow,
    value: number | string
  ) {
    setRouteStations((prev) =>
      prev
        .map((rs, i) => (i === index ? { ...rs, [field]: value } : rs))
        .map((rs, i) => (rs.order !== i ? { ...rs, order: i } : rs))
    );
  }

  function removeStop(index: number) {
    setRouteStations((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((rs, i) => ({ ...rs, order: i }))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hasEmptyStation = routeStations.some((rs) => !rs.stationId?.trim());
    if (hasEmptyStation) {
      setError("Оберіть станцію для кожної зупинки");
      return;
    }
    setSaveLoading(true);
    setError("");
    try {
      const payload = {
        name,
        routeStations: routeStations.map((rs, i) => ({
          stationId: rs.stationId,
          order: i,
          arrivalTime: rs.arrivalTime,
          departureTime: rs.departureTime,
        })),
      };
      if (editing) {
        await routeUpdate(editing.id, payload);
      } else {
        await routeCreate(payload);
      }
      setModal(null);
      setEditing(null);
      fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDelete(r: Route) {
    if (!confirm(`Видалити маршрут "${r.name}"?`)) return;
    try {
      await routeDelete(r.id);
      fetchRoutes();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Помилка видалення");
    }
  }

  return (
    <>
      <div className="space-y-4">
        {isAuthenticated && (
          <button type="button" className="btn-primary text-sm sm:text-base w-full sm:w-auto" onClick={openAdd}>
            + Додати маршрут
          </button>
        )}

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState message="Немає маршрутів." />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rail-700 bg-rail-800/60">
                    <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                      Назва
                    </th>
                    <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                      Станції
                    </th>
                    {isAuthenticated && (
                      <th className="text-right py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm w-24 sm:w-32">
                        Дії
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-rail-700/50 hover:bg-rail-800/30"
                    >
                      <td className="py-2 px-2 sm:py-3 sm:px-4 font-medium text-sm sm:text-base">{r.name}</td>
                      <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-400 text-xs sm:text-sm">
                        {(r.routeStations ?? [])
                          .sort((a, b) => a.order - b.order)
                          .map((rs) => rs.station?.name ?? "—")
                          .join(" → ") || "—"}
                      </td>
                      {isAuthenticated && (
                        <td className="py-2 px-2 sm:py-3 sm:px-4 text-right">
                          <div className="flex flex-wrap gap-1 justify-end">
                            <button
                              type="button"
                              className="btn-ghost text-xs sm:text-sm px-2 sm:px-3"
                              onClick={() => openEdit(r)}
                            >
                              <span className="hidden sm:inline">Змінити</span>
                              <span className="sm:hidden">✏️</span>
                            </button>
                            <button
                              type="button"
                              className="btn-ghost text-xs sm:text-sm text-red-400 hover:text-red-300 px-2 sm:px-3"
                              onClick={() => handleDelete(r)}
                            >
                              <span className="hidden sm:inline">Видалити</span>
                              <span className="sm:hidden">🗑️</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          <div className="card p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editing ? "Редагувати маршрут" : "Додати маршрут"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Назва маршруту
                </label>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <RouteStationsEditor
                stations={stations}
                rows={routeStations}
                onAdd={addStop}
                onUpdate={updateStop}
                onRemove={removeStop}
                maxHeight="max-h-60"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setModal(null)}
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={saveLoading}
                >
                  {saveLoading ? "Збереження..." : "Зберегти"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
