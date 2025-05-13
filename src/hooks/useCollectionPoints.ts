
// Fix the type conversion issue in useCollectionPoints.ts
// We need to properly convert the data types

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CollectionPoint } from "@/domain/entities/CollectionPoint";
import { CollectionPointDTO } from "@/application/dto/CollectionPointDTO";
import { collectionPointAdapter } from "@/adapters/collectionPoints/collectionPointAdapter";

export function useCollectionPoints(establishmentId?: string) {
  const [collectionPoints, setCollectionPoints] = useState<(CollectionPoint & { establishment: { name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCollectionPoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching collection points for establishment:", establishmentId);
      let query = supabase
        .from("collection_points")
        .select(`
          *,
          establishment:establishments(name)
        `)
        .order("name");

      if (establishmentId) {
        query = query.eq("establishment_id", establishmentId);
      } else {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Convert database records to domain entities
      const mappedData = data.map(item => {
        // Create a DTO from the raw data
        const dto: CollectionPointDTO = {
          id: item.id,
          name: item.name,
          code: item.code,
          address: item.address,
          district: item.district,
          city: item.city,
          state: item.state,
          zipcode: item.zipcode,
          coordinates: {
            latitude: item.latitude,
            longitude: item.longitude
          },
          status: item.status,
          operatingHours: item.operating_hours ? JSON.parse(JSON.stringify(item.operating_hours)) : {},
          establishmentId: item.establishment_id,
          carrierId: item.carrier_id,
          // Add other fields as necessary
        };

        // Convert DTO to domain entity
        const domainEntity = collectionPointAdapter.toDomainEntity(dto);
        
        // Add the establishment info
        return {
          ...domainEntity,
          establishment: { 
            name: item.establishment?.name || '' 
          }
        };
      });

      console.log("Mapped collection points:", mappedData);
      setCollectionPoints(mappedData);
    } catch (err) {
      console.error("Error fetching collection points:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load collection points"
      );
      toast({
        title: "Error loading collection points",
        description:
          "There was an error loading the collection points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [establishmentId, toast]);

  useEffect(() => {
    fetchCollectionPoints();
  }, [fetchCollectionPoints]);

  return {
    collectionPoints,
    loading,
    error,
    refreshCollectionPoints: fetchCollectionPoints,
  };
}
