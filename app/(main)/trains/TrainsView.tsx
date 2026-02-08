"use client";

import { useCallback, useEffect, useState } from "react";
import {
  trainsList,
  trainCreate,
  trainUpdate,
  trainDelete,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Train } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState, EmptyState } from "@/components/ui/LoadingEmpty";

export function TrainsView() {
  const [items, setItems] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Train | null>(null);
  const [name, setName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchTrains = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await trainsList();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrains();
  }, [fetchTrains]);

  function openAdd() {
    setEditing(null);
    setName("");
    setModal("add");
  }

  function openEdit(t: Train) {
    setEditing(t);
    setName(t.name);
    setModal("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveLoading(true);
    setError("");
    try {
      if (editing) {
        await trainUpdate(editing.id, { name });
      } else {
        await trainCreate({ name });
      }
      setModal(null);
      setEditing(null);
      fetchTrains();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка збереження");
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleDelete(t: Train) {
    if (!confirm(`Видалити поїзд "${t.name}"?`)) return;
    try {
      await trainDelete(t.id);
      fetchTrains();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Помилка видалення");
    }
  }

  return (
    <>
      <div className="space-y-4">
        {isAuthenticated && (
          <button type="button" className="btn-primary" onClick={openAdd}>
            + Додати поїзд
          </button>
        )}

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState message="Немає поїздів." />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rail-700 bg-rail-800/60">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">
                      Назва
                    </th>
                    {isAuthenticated && (
                      <th className="text-right py-3 px-4 text-gray-400 font-medium w-32">
                        Дії
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-rail-700/50 hover:bg-rail-800/30"
                    >
                      <td className="py-3 px-4 font-medium">{t.name}</td>
                      {isAuthenticated && (
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            className="btn-ghost text-sm mr-1"
                            onClick={() => openEdit(t)}
                          >
                            Змінити
                          </button>
                          <button
                            type="button"
                            className="btn-ghost text-sm text-red-400 hover:text-red-300"
                            onClick={() => handleDelete(t)}
                          >
                            Видалити
                          </button>
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
              {editing ? "Редагувати поїзд" : "Додати поїзд"}
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
