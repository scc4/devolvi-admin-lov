
import { TableHead, TableRow, TableHeader as TableHeaderBase } from "@/components/ui/table";

interface CollectionPointTableHeaderProps {
  showCarrier?: boolean;
}

export function CollectionPointTableHeader({ showCarrier = true }: CollectionPointTableHeaderProps) {
  return (
    <TableHead>
      <TableRow>
        <TableHeaderBase>Nome</TableHeaderBase>
        <TableHeaderBase>Endereço</TableHeaderBase>
        <TableHeaderBase>Localização</TableHeaderBase>
        {showCarrier && <TableHeaderBase>Transportadora</TableHeaderBase>}
        <TableHeaderBase>Horário</TableHeaderBase>
        <TableHeaderBase className="text-right">Ações</TableHeaderBase>
      </TableRow>
    </TableHead>
  );
}
