
import { Input } from "@/components/ui/input";

interface EstablishmentsSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function EstablishmentsSearch({ searchTerm, onSearch }: EstablishmentsSearchProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Buscar estabelecimentos..."
          className="pl-2"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
