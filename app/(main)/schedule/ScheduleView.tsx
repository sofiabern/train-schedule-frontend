"use client";

import { useCallback, useEffect, useState } from "react";
import {
  schedulesList,
  scheduleCreate,
  scheduleUpdate,
  scheduleDelete,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Schedule as ScheduleType, ScheduleSortBy, SortOrder } from "@/lib/types";
import { ScheduleFormModal } from "@/app/(main)/schedule/ScheduleFormModal";
import { ScheduleFilters } from "@/app/(main)/schedule/ScheduleFilters";
import { ScheduleTable } from "@/app/(main)/schedule/ScheduleTable";
import { ScheduleDetailModal } from "@/app/(main)/schedule/ScheduleDetailModal";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { LoadingState, EmptyState } from "@/components/ui/LoadingEmpty";

export function ScheduleView() {
  const [items, setItems] = useState<ScheduleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<ScheduleSortBy>("departureTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [dayFilter, setDayFilter] = useState<number | "">("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailSchedule, setDetailSchedule] = useState<ScheduleType | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await schedulesList({
        search: search || undefined,
        sortBy,
        sortOrder,
        dayOfWeek: dayFilter === "" ? undefined : dayFilter,
      });
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалося завантажити");
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder, dayFilter]);

  useEffect(() => {
    const t = setTimeout(() => fetchSchedules(), 300);
    return () => clearTimeout(t);
  }, [fetchSchedules]);

  async function handleCreate(p: {
    trainId: string;
    routeId: string;
    departureTime: string;
    daysOfWeek: number[];
  }) {
    await scheduleCreate(p);
    setModal(null);
    fetchSchedules();
  }

  async function handleUpdate(p: {
    trainId: string;
    routeId: string;
    departureTime: string;
    daysOfWeek: number[];
  }) {
    if (!editingId) return;
    await scheduleUpdate(editingId, p);
    setModal(null);
    setEditingId(null);
    fetchSchedules();
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити цей рейс з розкладу?")) return;
    try {
      await scheduleDelete(id);
      fetchSchedules();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Помилка видалення");
    }
  }

  function openEdit(s: ScheduleType) {
    setEditingId(s.id);
    setModal("edit");
  }

  return (
    <>
      <div className="space-y-4">
        <ScheduleFilters
          search={search}
          onSearchChange={setSearch}
          dayFilter={dayFilter}
          onDayFilterChange={setDayFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          showAddButton={isAuthenticated}
          onAddClick={() => {
            setEditingId(null);
            setModal("add");
          }}
        />

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState message="Немає рейсів за вашим пошуком." />
        ) : (
          <ScheduleTable
            items={items}
            isAuthenticated={isAuthenticated}
            onDetail={setDetailSchedule}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modal === "add" && (
        <ScheduleFormModal
          onClose={() => setModal(null)}
          onSubmit={handleCreate}
        />
      )}
      {modal === "edit" && editingId && (
        <ScheduleFormModal
          onClose={() => {
            setModal(null);
            setEditingId(null);
          }}
          onSubmit={handleUpdate}
          initial={items.find((s) => s.id === editingId) ?? null}
        />
      )}

      {detailSchedule && (
        <ScheduleDetailModal
          schedule={detailSchedule}
          onClose={() => setDetailSchedule(null)}
        />
      )}
    </>
  );
}
