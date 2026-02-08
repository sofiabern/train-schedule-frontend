import { RoutesView } from "./RoutesView";

export const metadata = {
  title: "Маршрути | Train Schedule",
  description: "Керування маршрутами",
};

export default function RoutesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Маршрути</h1>
      <RoutesView />
    </div>
  );
}
