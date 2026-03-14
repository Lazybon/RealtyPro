import { Info } from 'lucide-react';

interface FilterRowProps {
  label: string;
  children: React.ReactNode;
  info?: boolean;
}

export function FilterRow({ label, children, info }: FilterRowProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
      <div className="flex shrink-0 items-center gap-1 sm:w-44 sm:pt-2">
        <span className="text-sm font-medium">{label}</span>
        {info && <Info className="h-3.5 w-3.5 text-muted-foreground" />}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
