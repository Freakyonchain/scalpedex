// /src/shared/components/ui/Modal.tsx
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Handle Escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 200);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const modalRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 200);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-md bg-gradient-to-b from-violet-950 to-black rounded-xl border border-violet-800/50 p-6 shadow-xl",
          { "animate-in fade-in zoom-in-95": !isClosing },
          { "animate-out fade-out zoom-out-95": isClosing },
          className
        )}
      >
        <div className="flex items-start justify-between mb-4">
          {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
          {showCloseButton && (
            <button
              onClick={() => {
                setIsClosing(true);
                setTimeout(() => {
                  onClose();
                  setIsClosing(false);
                }, 200);
              }}
              className="text-violet-400 hover:text-white transition-colors"
            >
              <X size={24} />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}