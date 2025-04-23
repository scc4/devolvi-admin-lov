
import type { CollectionPoint } from "@/types/collection-point";

export const getSimpleAddress = (point: CollectionPoint) => {
  const parts = [];
  if (point.street) parts.push(point.street);
  if (point.number) parts.push(point.number);
  return parts.length > 0 ? parts.join(', ') : 'Não informado';
};

export const getLocation = (point: CollectionPoint) => {
  const parts = [];
  if (point.city) parts.push(point.city);
  if (point.state) parts.push(point.state);
  return parts.length > 0 ? parts.join('/') : 'Não informado';
};
