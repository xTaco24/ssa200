import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium',
          {
            'bg-gray-900 text-gray-50': variant === 'default',
            'border border-gray-200 text-gray-900': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';