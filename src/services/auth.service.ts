import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env.config';
import { LoginInput } from '../utils/validation';
import {supabase} from '../middleware/auth.middleware';
export class AuthService {
  async login(data: LoginInput) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return {
      user: authData.user,
      session: authData.session,
    };
  }

  async logout(token: string) {
    const supabaseWithToken = createClient(
      config.supabase.url,
      config.supabase.anonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { error } = await supabaseWithToken.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Logged out successfully' };
  }
}