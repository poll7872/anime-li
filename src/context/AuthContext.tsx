// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase'; // Tu cliente de supabase

// 1. Definimos el tipo de datos que nuestro contexto manejará
interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
}

// 2. Creamos el Contexto con un valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Creamos el componente Proveedor (Provider)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Obtenemos la sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Escuchamos cambios en la autenticación (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  // Proveemos el valor a todos los componentes hijos
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 4. Creamos un hook personalizado para usar el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
