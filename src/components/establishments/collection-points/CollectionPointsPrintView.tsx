
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
        return `${daysOfWeekPtBr[day as keyof typeof daysOfWeekPtBr]}: ${open} - ${close}`;
      })
      .join("\n");
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
    <div className="p-8 print:p-6 bg-white text-[#403E43]">
      <style type="text/css" media="print">
        {`
          @page { 
            size: portrait;
            margin: 20mm;
          }
          @media print {
            body { 
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              background: white;
              color: #403E43;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
      
      <div className="mb-8 border-b pb-6 print:mb-6">
        <h1 className="text-3xl font-bold mb-4 text-primary">Relatório de Pontos de Coleta</h1>
        <div className="flex justify-between items-end text-sm text-muted-foreground">
          <p>Total de pontos: {collectionPoints.length}</p>
          <p>Gerado em: {formatDateTime(new Date().toISOString())}</p>
        </div>
      </div>

      <div className="grid gap-6 print:gap-4">
        {collectionPoints.map((point, index) => (
          <div 
            key={point.id} 
            className={cn(
              "border rounded-lg p-6 print:p-4 print:break-inside-avoid bg-white shadow-sm",
              "hover:shadow-md transition-shadow duration-200"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-primary">{point.name}</h2>
              <span className="text-sm text-muted-foreground">#{index + 1}</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 print:gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 text-muted-foreground">Endereço Completo</h3>
                  <p className="text-sm">{point.address}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1 text-muted-foreground">Cidade</h3>
                    <p className="text-sm">{point.city || "Não informado"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1 text-muted-foreground">Estado</h3>
                    <p className="text-sm">{point.state || "Não informado"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1 text-muted-foreground">Telefone</h3>
                  <p className="text-sm">{point.phone || "Não informado"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1 text-muted-foreground">Estabelecimento</h3>
                  <p className="text-sm">{point.establishment?.name || "Não associado"}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 text-muted-foreground">Horário de Funcionamento</h3>
                  <pre className="whitespace-pre-line text-sm font-normal">{formatOperatingHours(point)}</pre>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground print:fixed print:bottom-0 print:left-0 print:right-0 print:mt-0">
        <p>Fim do Relatório • Página {`{{pageNumber}}`}</p>
      </div>
    </div>
  );
}
