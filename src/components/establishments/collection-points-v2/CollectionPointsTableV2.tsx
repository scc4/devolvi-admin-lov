
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CollectionPointActionsDropdownV2 } from "./CollectionPointActionsDropdownV2";
import { MapPin, Search, Phone } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface CollectionPointsTableV2Props {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (id: string) => void;
}

export function CollectionPointsTableV2({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete
}: CollectionPointsTableV2Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile } = useIsMobile();

  // Filter points based on search query
  const filteredPoints = collectionPoints.filter(point =>
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (point.address || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (point.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingTable />;
  }

  if (collectionPoints.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum ponto de coleta</h3>
        <p className="mt-1 text-gray-500">
          Não há pontos de coleta cadastrados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            className="pl-10"
            placeholder="Buscar pontos de coleta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isMobile ? (
        <MobileView
          points={filteredPoints}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <DesktopView
          points={filteredPoints}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

function LoadingTable() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

function DesktopView({
  points,
  onEdit,
  onDelete
}: {
  points: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {points.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          ) : (
            points.map((point) => (
              <TableRow key={point.id}>
                <TableCell className="font-medium">{point.name}</TableCell>
                <TableCell className="max-w-md truncate">{point.address || "Sem endereço"}</TableCell>
                <TableCell>{point.phone || "—"}</TableCell>
                <TableCell>
                  <StatusBadge isActive={point.is_active} />
                </TableCell>
                <TableCell>
                  <CollectionPointActionsDropdownV2
                    point={point}
                    onEdit={() => onEdit(point)}
                    onDelete={() => onDelete(point.id)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function MobileView({
  points,
  onEdit,
  onDelete
}: {
  points: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {points.length === 0 ? (
        <div className="text-center border rounded-lg py-6 px-4">
          Nenhum resultado encontrado
        </div>
      ) : (
        points.map((point) => (
          <div key={point.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{point.name}</h3>
              <StatusBadge isActive={point.is_active} />
            </div>
            <div className="text-sm text-gray-500 mt-2 flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <span className="flex-1">{point.address || "Sem endereço"}</span>
            </div>
            {point.phone && (
              <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>{point.phone}</span>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <CollectionPointActionsDropdownV2
                point={point}
                onEdit={() => onEdit(point)}
                onDelete={() => onDelete(point.id)}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StatusBadge({ isActive }: { isActive?: boolean | null }) {
  return isActive ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Ativo</Badge>
  ) : (
    <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inativo</Badge>
  );
}
