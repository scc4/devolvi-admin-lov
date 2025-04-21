
import { TableCell, TableRow } from "@/components/ui/table";

export function EstablishmentsTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center">
        Nenhum estabelecimento encontrado
      </TableCell>
    </TableRow>
  );
}
