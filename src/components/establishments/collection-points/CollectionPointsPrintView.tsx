
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

  return (
    <div className="p-4 print:p-4 bg-white text-[#403E43] text-sm">
      <style type="text/css" media="print">
        {`
          @page { 
            size: portrait;
            margin: 15mm;
          }
          @media print {
            body { 
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: white;
              color: #403E43;
              font-size: 11pt;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
      
      <div className="mb-4 border-b pb-3 print:mb-4">
        <h1 className="text-2xl font-bold mb-2 text-primary">Relatório de Pontos de Coleta</h1>
        <div className="flex justify-between items-end text-xs text-muted-foreground">
          <p>Total de pontos: {collectionPoints.length}</p>
          <p>Gerado em: {formatDateTime(new Date().toISOString())}</p>
        </div>
      </div>

      <div className="grid gap-3 print:gap-2">
        {collectionPoints.map((point, index) => (
          <div 
            key={point.id} 
            className={cn(
              "border rounded p-3 print:p-2 print:break-inside-avoid bg-white shadow-sm",
              "hover:shadow-md transition-shadow duration-200"
            )}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-base font-semibold text-primary">{point.name}</h2>
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Endereço: </span>
                    <span>{point.address}</span>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Estabelecimento: </span>
                    <span>{point.establishment?.name || "Não associado"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Cidade/Estado: </span>
                    <span>{point.city || "Não informado"}/{point.state || "Não informado"}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Telefone: </span>
                    <span>{point.phone || "Não informado"}</span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-muted-foreground">Horário: </span>
                    <span>{formatOperatingHours(point)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t text-center text-xs text-muted-foreground print:fixed print:bottom-0 print:left-0 print:right-0 print:mt-0">
        <p>Fim do Relatório • Página {`{{pageNumber}}`}</p>
      </div>
    </div>
  );
}
