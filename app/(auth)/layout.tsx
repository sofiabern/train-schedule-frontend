export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-rail-950 via-rail-900/30 to-rail-950">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
