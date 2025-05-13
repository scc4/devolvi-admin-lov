
import { TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export function EstablishmentsTableLoading() {
  const { isMobile } = useIsMobile();
  
  if (isMobile) {
    // Criar um array de 3 elementos para representar cards de estabelecimentos em loading state
    const skeletonCards = Array(3).fill(0);
    
    return (
      <div className="space-y-4">
        {skeletonCards.map((_, index) => (
          <div 
            key={`skeleton-card-${index}`}
            className="border rounded-md p-4 space-y-3 bg-card"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t mt-1">
              <Skeleton className="h-4 w-16" />
              <div className="flex space-x-2">
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-7 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Criar um array de 5 elementos para representar 5 linhas de esqueleto para desktop
  const skeletonRows = Array(5).fill(0);
  
  return (
    <>
      {skeletonRows.map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-4 w-8 ml-auto" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-20 rounded-md ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
