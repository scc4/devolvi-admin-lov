
import { type CollectionPoint } from "@/types/collection-point";
import { daysOfWeekPtBr } from "@/types/collection-point";

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

  return (
    <div className="p-8 print:p-4">
      <style type="text/css" media="print">
        {`
          @page { size: portrait; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        `}
      </style>
      
      <div className="mb-8 print:mb-4">
        <h1 className="text-2xl font-bold mb-2">Relatório de Pontos de Coleta</h1>
        <p className="text-muted-foreground">Data de geração: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8 print:space-y-4">
        {collectionPoints.map((point) => (
          <div key={point.id} className="border rounded-lg p-6 print:p-4 print:break-inside-avoid">
            <h2 className="text-xl font-semibold mb-4">{point.name}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-medium">Endereço</p>
                <p>{point.address}</p>
              </div>
              <div>
                <p className="font-medium">Telefone</p>
                <p>{point.phone || "Não informado"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="font-medium">Cidade</p>
                <p>{point.city || "Não informado"}</p>
              </div>
              <div>
                <p className="font-medium">Estado</p>
                <p>{point.state || "Não informado"}</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Estabelecimento</p>
              <p>{point.establishment?.name || "Não associado"}</p>
            </div>

            <div className="mt-4">
              <p className="font-medium mb-2">Horário de Funcionamento</p>
              <pre className="whitespace-pre-line">{formatOperatingHours(point)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
