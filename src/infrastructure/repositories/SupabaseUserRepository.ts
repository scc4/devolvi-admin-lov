
import { User, UserRole, UserStatus } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Supabase implementation of the User repository interface
 */
export class SupabaseUserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    try {
      // Get all users from auth.users via our edge function
      const { data: usersData, error: usersErr } = await supabase.functions.invoke('admin-list-users');
      
      if (usersErr) {
        console.error("Error fetching users:", usersErr);
        throw usersErr;
      }

      if (!usersData || !usersData.users) {
        throw new Error("Invalid response from admin-list-users function");
      }

      // Fetch profiles and roles
      let profiles = [];
      try {
        const { data: profilesData, error: pfErr } = await supabase
          .from("profiles")
          .select("id, name, created_at, phone");
        
        if (!pfErr) {
          profiles = profilesData || [];
        }
      } catch (err) {
        console.error("Exception fetching profiles:", err);
      }
      
      let roleData = [];
      try {
        const { data: rolesData, error: rlErr } = await supabase
          .from("user_roles")
          .select("user_id, role");
        
        if (!rlErr) {
          roleData = rolesData || [];
        }
      } catch (err) {
        console.error("Exception fetching roles:", err);
      }

      // Map to domain entities
      return usersData.users.map((authUser: any) => {
        const profile = profiles?.find((p: any) => p.id === authUser.id);
        const roleRow = roleData?.find((r: any) => r.user_id === authUser.id);
        
        let status: UserStatus = "Ativo";
        if (authUser.user_metadata?.disabled) {
          status = "Inativo";
        } else if (!authUser.email_confirmed_at) {
          status = "Convidado";
        }

        const role = (roleRow?.role ?? "user") as UserRole;

        return new User({
          id: authUser.id,
          name: profile?.name || authUser.user_metadata?.name || null,
          email: authUser.email || null,
          phone: profile?.phone || null,
          role,
          status,
          createdAt: new Date(profile?.created_at || authUser.created_at || new Date())
        });
      });
    } catch (error) {
      console.error("Error in getAll users:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<User | null> {
    // Implementation would be similar to getAll but filtered to a specific user
    throw new Error("Method not implemented.");
  }

  async create(user: User): Promise<User> {
    // Implementation for creating a user via admin functions
    throw new Error("Method not implemented.");
  }

  async update(user: User): Promise<User> {
    // Implementation for updating a user
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: id }
      });

      if (error) {
        throw new Error(error.message || 'Erro na função de excluir usuário');
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Erro desconhecido ao excluir usuário');
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  async deactivate(id: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-deactivate-user', {
        body: { userId: id }
      });

      if (error) {
        throw new Error(error.message || 'Erro na função de inativar usuário');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro desconhecido ao inativar usuário');
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { userId: id, password }
      });

      if (error) {
        throw new Error(error.message || 'Erro ao redefinir senha do usuário');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro desconhecido ao redefinir senha');
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }
}
