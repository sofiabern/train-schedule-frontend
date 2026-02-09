"use client";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
  /** Click on backdrop closes modal. Default true. */
  closeOnBackdrop?: boolean;
};

export function Modal({ onClose, children, closeOnBackdrop = true }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
