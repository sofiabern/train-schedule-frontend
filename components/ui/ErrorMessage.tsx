type Props = {
  message: string;
  className?: string;
};

export function ErrorMessage({ message, className = "" }: Props) {
  return (
    <div
      className={`rounded-lg bg-red-900/40 border border-red-600 text-red-200 px-4 py-2 ${className}`}
      role="alert"
    >
      {message}
    </div>
  );
}
