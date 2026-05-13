import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TableSkeletonProps = Readonly<{
  columns?: number;
  rows?: number;
  className?: string;
}>;

export function TableSkeleton({
  className,
  columns = 5,
  rows = 8,
}: TableSkeletonProps) {
  const skeletonColumns = Array.from({ length: columns }, (_, index) => index);
  const skeletonRows = Array.from({ length: rows }, (_, index) => index);

  return (
    <div aria-busy="true" className={cn("animate-pulse", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {skeletonColumns.map((column) => (
              <TableHead key={column}>
                <span className="block h-3 w-20 rounded bg-slate-200" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((row) => (
            <TableRow key={row}>
              {skeletonColumns.map((column) => (
                <TableCell key={`${row}-${column}`}>
                  <span
                    className={cn(
                      "block h-4 rounded bg-slate-200",
                      column === 0 && "w-8",
                      column === 1 && "w-44",
                      column > 1 && "w-24",
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
