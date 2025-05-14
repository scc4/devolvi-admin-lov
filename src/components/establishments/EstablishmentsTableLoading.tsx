
import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

export function EstablishmentsTableLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
      
      {/* Desktop skeleton loading state */}
      <div className="hidden md:block">
        {[1, 2, 3].map((idx) => (
          <TableRow key={idx} className="border-b">
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-10 ml-auto" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
          </TableRow>
        ))}
      </div>
      
      {/* Mobile skeleton loading state */}
      <div className="block md:hidden space-y-4">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="border rounded-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <Skeleton className="h-4 w-16" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-6 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
