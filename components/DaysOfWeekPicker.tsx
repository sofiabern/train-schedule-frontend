"use client";

const DAYS = [
  { value: 1, label: "Пн" },
  { value: 2, label: "Вт" },
  { value: 3, label: "Ср" },
  { value: 4, label: "Чт" },
  { value: 5, label: "Пт" },
  { value: 6, label: "Сб" },
  { value: 0, label: "Нд" },
] as const;

type Props = {
  selected: number[];
  onChange: (days: number[]) => void;
  showEveryDayToggle?: boolean;
  error?: string;
};

export function DaysOfWeekPicker({
  selected,
  onChange,
  showEveryDayToggle = true,
  error,
}: Props) {
  const isEveryDay = selected.length === 7;
  const hasNoDays = selected.length === 0;
  const ALL_DAYS = [1, 2, 3, 4, 5, 6, 0];

  function toggleDay(day: number) {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day].sort((a, b) => a - b));
    }
  }

  function toggleEveryDay() {
    onChange(isEveryDay ? [] : [...ALL_DAYS]);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Дні тижня (коли є рейс)
      </label>
      <div className="flex flex-wrap gap-2 items-center">
        {showEveryDayToggle && (
          <>
            <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-amber-signal/90">
              <input
                type="checkbox"
                checked={isEveryDay}
                onChange={toggleEveryDay}
                className="rounded border-rail-600 bg-rail-900/50 text-amber-signal focus:ring-amber-signal"
              />
              <span className="text-sm">Щодня</span>
            </label>
            <span className="text-gray-500 text-sm">|</span>
          </>
        )}
        {DAYS.map(({ value, label }) => (
          <label
            key={value}
            className="inline-flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(value)}
              onChange={() => toggleDay(value)}
              className="rounded border-rail-600 bg-rail-900/50 text-amber-signal focus:ring-amber-signal"
            />
            <span className="text-sm text-gray-300">{label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-amber-signal/90 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
