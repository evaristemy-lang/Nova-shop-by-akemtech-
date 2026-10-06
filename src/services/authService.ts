import { User } from '../types';

export const authService = {
  async adminLogin(identifier: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Identifiants administrateur invalides.' };
    } catch (e) {
      return { success: false, error: 'Erreur de connexion au serveur d\'authentification.' };
    }
  }
};
