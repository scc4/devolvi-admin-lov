
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users as UsersIcon, Edit, Trash, Ban, Mail, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Lista de perfis permitidos
const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

type RoleValue = typeof ROLES[number]["value"];
type StatusType = "Ativo" | "Inativo" | "Convidado";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  role: RoleValue;
  status: StatusType;
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais e ações
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: string, user: UserRow }>(null);
  const { toast } = useToast();

  // Buscar usuários do Supabase
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      // Perfis
      const { data: profiles, error: pfErr } = await supabase
        .from("profiles")
        .select("id, name, created_at");

      // E-mails e roles
      const { data: roles, error: rlErr } = await supabase
        .from("user_roles")
        .select("user_id, role");

      // Vamos buscar a coluna de email e telefone do usuário pela API de auth
      const { data: authList, error: auErr } = await supabase.auth.admin.listUsers();

      // status: se excluído, será Inativo, se criado e sem convite aceito, será "Convidado"
      let userList: UserRow[] = [];
      if (profiles && roles && authList?.users) {
        for (const profile of profiles) {
          const roleRow = roles.find(r => r.user_id === profile.id);
          const userAuth = authList.users.find(u => u.id === profile.id);
          const email = userAuth?.email ?? null;
          // Exemplo de lógica simplificada de status:
          let status: StatusType = "Convidado";
          if (userAuth) {
            if (userAuth.banned_until) {
              status = "Inativo";
            } else if (userAuth.email_confirmed_at) {
              status = "Ativo";
            }
          }
          
          userList.push({
            id: profile.id,
            name: profile.name,
            email,
            phone: userAuth?.phone ?? null,
            created_at: profile.created_at,
            role: roleRow?.role ?? "user",
            status,
          });
        }
      }
      setUsers(userList);
      setLoading(false);
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  // Funções de ações
  const handleInvite = async (form: { name: string, email: string, phone?: string, role: RoleValue }) => {
    // Registrar usuário via signUp
    const { name, email, phone, role } = form;
    const { error, data } = await supabase.auth.admin.createUser({
      email,
      phone,
      email_confirm: false,
      user_metadata: { name, phone },
    });
    if (error) {
      toast({ title: "Erro ao convidar", description: error.message, variant: "destructive" });
      return;
    }
    // Atualizar perfil
    if (data.user) {
      await supabase.from("profiles").update({ name }).eq("id", data.user.id);
      // Atribuir role
      await supabase.from("user_roles").insert({ user_id: data.user.id, role });
      toast({ title: "Convite enviado!", description: "O usuário foi convidado para a equipe." });
    }
    setInviteOpen(false);
  };

  const handleEdit = async (userId: string, updates: { name: string, phone: string | null, role: RoleValue }) => {
    await supabase.from("profiles").update({ name: updates.name }).eq("id", userId);
    await supabase.from("user_roles").update({ role: updates.role }).eq("user_id", userId);
    // A API de Auth não aceita update de phone diretamente no frontend
    toast({ title: "Usuário atualizado!", description: "Dados do usuário alterados." });
    setEditUser(null);
  };

  const handleDelete = async (user: UserRow) => {
    if (user.status === "Inativo") {
      toast({ title: "Ação inválida", description: "Não é possível excluir um usuário inativo.", variant: "destructive" });
      setConfirmModal(null);
      return;
    }
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (!error) {
      toast({ title: "Usuário excluído", description: "Usuário removido da equipe." });
    } else {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    }
    setConfirmModal(null);
  };

  const handleDeactivate = async (user: UserRow) => {
    if (user.status === "Inativo") {
      toast({ title: "Usuário já está inativo.", variant: "destructive" });
      setConfirmModal(null);
      return;
    }
    
    // O correto é usar banned_until com uma data futura distante para inativar
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      banned_until: '2099-12-31'
    });
    
    if (!error) {
      toast({ title: "Usuário inativado", description: "O usuário foi marcado como inativo." });
    } else {
      toast({ title: "Erro ao inativar", description: error.message, variant: "destructive" });
    }
    setConfirmModal(null);
  };

  const handleResendInvite = async (user: UserRow) => {
    const { error } = await supabase.auth.admin.inviteUserByEmail(user.email!);
    if (!error) {
      toast({ title: "Convite reenviado", description: "Novo convite enviado para o e-mail." });
    } else {
      toast({ title: "Erro ao reenviar convite", description: error.message, variant: "destructive" });
    }
    setConfirmModal(null);
  };

  // Renderização dos modais de confirmação
  function renderConfirmModal() {
    if (!confirmModal) return null;
    const { action, user } = confirmModal;
    let message = "";
    switch (action) {
      case "delete":
        message = `Deseja realmente excluir o usuário "${user.name}"? Esta ação é irreversível.`;
        break;
      case "deactivate":
        message = `Deseja inativar o usuário "${user.name}"?`;
        break;
      case "invite":
        message = `Deseja reenviar o convite para "${user.name}" (${user.email})?`;
        break;
      default:
        break;
    }
    return (
      <Dialog open onOpenChange={() => setConfirmModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirme a ação</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmModal(null)}
            >
              Cancelar
            </Button>
            {action === "delete" && (
              <Button variant="destructive" onClick={() => handleDelete(user)}>
                Excluir
              </Button>
            )}
            {action === "deactivate" && (
              <Button variant="outline" onClick={() => handleDeactivate(user)}>
                Inativar
              </Button>
            )}
            {action === "invite" && (
              <Button variant="outline" onClick={() => handleResendInvite(user)}>
                Reenviar convite
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal de convite de usuário
  function InviteDialog({ open, onOpenChange, onInvite }: { open: boolean, onOpenChange: (v: boolean) => void, onInvite: (args: any) => void }) {
    const [form, setForm] = useState({ name: "", email: "", phone: "", role: "user" as RoleValue });
    const [submitting, setSubmitting] = useState(false);
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convidar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="E-mail" value={form.email} type="email" onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input placeholder="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as RoleValue }))}
            >
              {ROLES.map(r => <option value={r.value} key={r.value}>{r.label}</option>)}
            </select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button
              onClick={async () => {
                setSubmitting(true);
                await onInvite(form);
                setForm({ name: "", email: "", phone: "", role: "user" });
                setSubmitting(false);
              }}
              disabled={submitting || !form.email || !form.name}
            >
              Convidar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal de edição de usuário
  function EditDialog({ user, onClose }: { user: UserRow, onClose: () => void }) {
    const [form, setForm] = useState({ name: user.name ?? "", phone: user.phone ?? "", role: user.role });
    const [submitting, setSubmitting] = useState(false);

    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as RoleValue }))}
            >
              {ROLES.map(r => <option value={r.value} key={r.value}>{r.label}</option>)}
            </select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button
              onClick={async () => {
                setSubmitting(true);
                await handleEdit(user.id, form);
                setSubmitting(false);
              }}
              disabled={submitting || !form.name}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <UsersIcon className="mr-1 h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">Gerenciar Equipes</CardTitle>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Convidar Usuários
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Buscar usuários..."
                className="pl-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Data de Inclusão</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">Carregando...</TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell className="">{user.name || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{ROLES.find(r => r.value === user.role)?.label ?? user.role}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${user.status === "Ativo" && "bg-green-100 text-green-800"}
                          ${user.status === "Inativo" && "bg-gray-100 text-gray-800"}
                          ${user.status === "Convidado" && "bg-yellow-100 text-yellow-800"}
                        `}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={user.status === "Inativo"}
                            onClick={() => setEditUser(user)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={user.status === "Inativo"}
                            onClick={() => setConfirmModal({ action: "delete", user })}
                            title="Excluir"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={user.status === "Inativo"}
                            onClick={() => setConfirmModal({ action: "deactivate", user })}
                            title="Inativar"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          {user.status === "Convidado" && (
                            <Button
                              variant="secondary"
                              size="icon"
                              onClick={() => setConfirmModal({ action: "invite", user })}
                              title="Reenviar convite"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">Nenhum usuário encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Modais */}
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={handleInvite} />
      {editUser && <EditDialog user={editUser} onClose={() => setEditUser(null)} />}
      {renderConfirmModal()}
    </div>
  );
}
