'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToggleChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  'data-testid'?: string;
}

export function ToggleChip({
  label,
  active,
  onClick,
  'data-testid': testId,
}: ToggleChipProps) {
  return (
    <Button
      variant={active ? 'outline' : 'ghost'}
      size="sm"
      className={cn(
        'rounded-full border',
        active ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'
      )}
      onClick={onClick}
      data-testid={testId}
    >
      {label}
    </Button>
  );
}
