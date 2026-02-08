import { StationsView } from "./StationsView";

export const metadata = {
  title: "Станції | Train Schedule",
  description: "Керування станціями",
};

export default function StationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Станції</h1>
      <StationsView />
    </div>
  );
}
