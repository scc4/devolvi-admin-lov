
import { type CollectionPoint } from "@/types/collection-point";
import { daysOfWeekPtBr } from "@/types/collection-point";
import { cn } from "@/lib/utils";

interface CollectionPointsPrintViewProps {
  collectionPoints: CollectionPoint[];
}

export function CollectionPointsPrintView({ collectionPoints }: CollectionPointsPrintViewProps) {
  const formatOperatingHours = (point: CollectionPoint) => {
    if (!point.operating_hours) return "Não configurado";
    
    return Object.entries(point.operating_hours)
      .filter(([_, periods]) => periods.length > 0)
      .map(([day, periods]) => {
        const { open, close } = periods[0];
        return `${daysOfWeekPtBr[day as keyof typeof daysOfWeekPtBr]}: ${open}-${close}`;
      })
      .join(" | ");
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate total pages based on items and items per page
  const itemsPerPage = 10;
  const totalPages = Math.ceil(collectionPoints.length / itemsPerPage);

  return (
    <div className="p-4 print:p-4 bg-white text-[#403E43] text-sm">
      <style type="text/css" media="print">
        {`
          @page { 
            size: portrait;
            margin: 10mm;
          }
          @media print {
            body { 
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: white;
              color: #403E43;
              font-size: 9pt;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Critical print CSS */
            .grid {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .print\\:break-inside-avoid {
              break-inside: avoid !important;
            }
            .print\\:p-2 {
              padding: 0.5rem !important;
            }
          }
        `}
      </style>
      
      <div className="mb-3 border-b pb-2 print:mb-3">
        <h1 className="text-xl font-bold mb-1 text-primary">Relatório de Pontos de Coleta</h1>
        <div className="flex justify-between items-end text-xs text-muted-foreground">
          <p>Total de pontos: {collectionPoints.length}</p>
          <p>Gerado em: {formatDateTime(new Date().toISOString())}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 print:gap-2 print:grid-cols-2">
        {collectionPoints.map((point, index) => (
          <div 
            key={point.id} 
            className={cn(
              "border rounded p-2 print:p-2 print:break-inside-avoid bg-white shadow-sm",
              "text-xs"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="text-sm font-semibold text-primary">{point.name}</h2>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div>
                    <span className="text-muted-foreground">End: </span>
                    <span>{point.address}</span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Local: </span>
                    <span>{point.establishment?.name || "Não associado"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Cidade/UF: </span>
                    <span>{point.address_obj?.city || "N/I"}/{point.address_obj?.state || "N/I"}</span>
                    <span className="ml-2 text-muted-foreground">Tel: </span>
                    <span>{point.phone || "N/I"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Horário: </span>
                    <span className="text-xs">{formatOperatingHours(point)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t text-center text-xs text-muted-foreground print:fixed print:bottom-0 print:left-0 print:right-0 print:mt-0">
        <p>Fim do Relatório • Página 1 de {totalPages}</p>
      </div>
    </div>
  );
}
