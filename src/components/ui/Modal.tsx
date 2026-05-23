import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useClickOutside } from '../../hooks/useClickOutside';
import { lightColors, darkColors, borderRadius, spacing, shadows, zIndex } from '../../styles/tokens';

type ModalTheme = 'light' | 'dark';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
  theme?: ModalTheme;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  theme = 'dark',
}: ModalProps) {
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`).current;
  const modalRef = useFocusTrap<HTMLDivElement>({ active: isOpen });
  const triggerRef = useRef<HTMLElement | null>(null);

  // Store trigger element before opening
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Close on click outside
  useClickOutside(modalRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  if (!isOpen) return null;

  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: parseInt(zIndex.modal),
      }}
      data-theme={theme}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: isLight
            ? 'rgba(28, 18, 9, 0.50)'
            : 'rgba(0, 0, 0, 0.70)',
        }}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          'relative w-full max-w-lg mx-4',
          'outline-none',
          className,
        ].join(' ')}
        style={{
          backgroundColor: isLight ? lightColors.bg : darkColors.card,
          borderRadius: borderRadius['2xl'],
          padding: spacing[6],
          boxShadow: shadows['2xl'],
          color: isLight ? lightColors.text : darkColors.text,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2
            id={titleId}
            className="text-lg font-semibold"
            style={{
              color: isLight ? lightColors.text : darkColors['text-primary'],
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: isLight ? lightColors.secondary : darkColors.secondary,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = isLight
                ? lightColors.elevated
                : darkColors.elevated;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
            }}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
