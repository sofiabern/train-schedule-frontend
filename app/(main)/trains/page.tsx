import { TrainsView } from "./TrainsView";

export const metadata = {
  title: "Поїзди | Train Schedule",
  description: "Керування поїздами",
};

export default function TrainsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Поїзди</h1>
      <TrainsView />
    </div>
  );
}
