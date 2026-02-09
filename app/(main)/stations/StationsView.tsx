"use client";

import { useCallback, useEffect, useState } from "react";
import {
  stationsList,
  stationCreate,
  stationUpdate,
  stationDelete,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Station } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState, EmptyState } from "@/components/ui/LoadingEmpty";

export function StationsView() {
  const [items, setItems] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Station | null>(null);
  const [name, setName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await stationsList();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  function openAdd() {
    setEditing(null);
    setName("");
    setModal("add");
  }

  function openEdit(s: Station) {
    setEditing(s);
    setName(s.name);
    setModal("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    try {
      if (editing) {
        await stationUpdate(editing.id, { name });
      } else {
        await stationCreate({ name });
      }
      setModal(null);
      setEditing(null);
      fetchStations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDelete(s: Station) {
    if (!confirm(`Видалити станцію "${s.name}"?`)) return;
    try {
      await stationDelete(s.id);
      fetchStations();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Помилка видалення");
    }
  }

  return (
    <>
      <div className="space-y-4">
        {isAuthenticated && (
          <button type="button" className="btn-primary text-sm sm:text-base w-full sm:w-auto" onClick={openAdd}>
            + Додати станцію
          </button>
        )}

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState message="Немає станцій." />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rail-700 bg-rail-800/60">
                    <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm">
                      Назва
                    </th>
                    {isAuthenticated && (
                      <th className="text-right py-2 px-2 sm:py-3 sm:px-4 text-gray-400 font-medium text-xs sm:text-sm w-24 sm:w-32">
                        Дії
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-rail-700/50 hover:bg-rail-800/30"
                    >
                      <td className="py-2 px-2 sm:py-3 sm:px-4 font-medium text-sm sm:text-base">{s.name}</td>
                      {isAuthenticated && (
                        <td className="py-2 px-2 sm:py-3 sm:px-4 text-right">
                          <div className="flex flex-wrap gap-1 justify-end">
                            <button
                              type="button"
                              className="btn-ghost text-xs sm:text-sm px-2 sm:px-3"
                              onClick={() => openEdit(s)}
                            >
                              <span className="hidden sm:inline">Змінити</span>
                              <span className="sm:hidden">✏️</span>
                            </button>
                            <button
                              type="button"
                              className="btn-ghost text-xs sm:text-sm text-red-400 hover:text-red-300 px-2 sm:px-3"
                              onClick={() => handleDelete(s)}
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
          <div className="card p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-white mb-4">
              {editing ? "Редагувати станцію" : "Додати станцію"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Назва
                </label>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
