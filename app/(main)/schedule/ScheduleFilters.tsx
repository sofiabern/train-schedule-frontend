"use client";

import type { ScheduleSortBy, SortOrder } from "@/lib/types";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  dayFilter: number | "";
  onDayFilterChange: (v: number | "") => void;
  sortBy: ScheduleSortBy;
  onSortByChange: (v: ScheduleSortBy) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (v: SortOrder) => void;
  onAddClick?: () => void;
  showAddButton?: boolean;
};

export function ScheduleFilters({
  search,
  onSearchChange,
  dayFilter,
  onDayFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onAddClick,
  showAddButton,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex-1 w-full sm:min-w-[200px]">
        <input
          type="search"
          placeholder="Пошук за поїздом, маршрутом або станцією..."
          className="input text-sm sm:text-base"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">День рейсу:</span>
        <select
          className="input w-auto min-w-[100px] text-sm sm:text-base"
          value={dayFilter === "" ? "" : String(dayFilter)}
          onChange={(e) =>
            onDayFilterChange(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Усі дні</option>
          <option value="0">Нд</option>
          <option value="1">Пн</option>
          <option value="2">Вт</option>
          <option value="3">Ср</option>
          <option value="4">Чт</option>
          <option value="5">Пт</option>
          <option value="6">Сб</option>
        </select>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Сортувати:</span>
        <select
          className="input w-auto min-w-[140px] sm:min-w-[160px] text-sm sm:text-base"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as ScheduleSortBy)}
        >
          <option value="departureTime">Час відправлення</option>
          <option value="arrivalTime">Час прибуття</option>
        </select>
        <select
          className="input w-auto min-w-[120px] sm:min-w-[140px] text-sm sm:text-base"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        >
          <option value="asc">Спочатку ранні</option>
          <option value="desc">Спочатку пізні</option>
        </select>
      </div>
      {showAddButton && onAddClick && (
        <button type="button" className="btn-primary text-sm sm:text-base whitespace-nowrap w-full sm:w-auto" onClick={onAddClick}>
          + Додати рейс
        </button>
      )}
    </div>
  );
}
