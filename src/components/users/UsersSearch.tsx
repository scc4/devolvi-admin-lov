
import { Input } from "@/components/ui/input";

interface UsersSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export function UsersSearch({ searchTerm, onSearch }: UsersSearchProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder="Buscar usuários..."
          className="pl-2"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
