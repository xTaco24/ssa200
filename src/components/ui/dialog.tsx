import React from 'react';
import { cn } from '../../lib/utils';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleOpenChange = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

const DialogContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {},
});

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const { onOpenChange } = React.useContext(DialogContext);

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => onOpenChange(true),
    });
  }

  return (
    <button onClick={() => onOpenChange(true)}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className, ...props }: DialogContentProps) {
  const { open, onOpenChange } = React.useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-lg w-full max-w-md p-6",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  );
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    />
  );
}