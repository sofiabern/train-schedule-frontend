type LoadingProps = {
  message?: string;
};

export function LoadingState({ message = "Завантаження..." }: LoadingProps) {
  return (
    <div className="card p-12 text-center text-gray-400">{message}</div>
  );
}

type EmptyProps = {
  message: string;
};

export function EmptyState({ message }: EmptyProps) {
  return (
    <div className="card p-12 text-center text-gray-400">{message}</div>
  );
}
