'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  'data-testid'?: string;
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
  'data-testid': testId,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t pt-4">
      <Button
        variant="ghost"
        className="flex h-auto w-full items-center justify-between p-0 text-left"
        onClick={() => setOpen(!open)}
        data-testid={testId}
      >
        <span className="text-lg font-semibold">{title}</span>
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </Button>
      {open && <div className="mt-4 space-y-5">{children}</div>}
    </div>
  );
}
