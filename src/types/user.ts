
export const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

export type RoleValue = typeof ROLES[number]["value"];
export type StatusType = "Ativo" | "Inativo" | "Convidado";

export type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string; // This corresponds to createdAt in UserDTO
  role: RoleValue;
  status: StatusType;
};
