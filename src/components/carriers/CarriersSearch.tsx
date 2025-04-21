
import { Input } from "@/components/ui/input";

interface CarriersSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function CarriersSearch({ searchTerm, onSearch }: CarriersSearchProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Buscar transportadoras..."
          className="pl-2"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
