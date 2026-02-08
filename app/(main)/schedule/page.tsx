import { ScheduleView } from "@/app/(main)/schedule/ScheduleView";

export const metadata = {
  title: "Розклад | Train Schedule",
  description: "Розклад поїздів з пошуком та сортуванням",
};

export default function SchedulePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Розклад поїздів</h1>
      <ScheduleView />
    </div>
  );
}
