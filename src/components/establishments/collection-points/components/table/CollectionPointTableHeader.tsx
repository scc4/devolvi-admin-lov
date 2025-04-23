
import {
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export function CollectionPointTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Endereço</TableHead>
        <TableHead>Cidade/UF</TableHead>
        <TableHead>Transportadora</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Ações</TableHead>
      </TableRow>
    </TableHeader>
  );
}
