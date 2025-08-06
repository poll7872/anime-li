"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock } from 'lucide-react';

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onSuccess(); // Cierra el modal al tener éxito
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <Input
          id="email" type="email" placeholder="tuemail@correo.com" required
          className="pl-10 bg-zinc-800/60 border-zinc-700 focus:ring-pink-500 h-12"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
        <Input
          id="password" type="password" placeholder="Tu contraseña" required
          className="pl-10 bg-zinc-800/60 border-zinc-700 focus:ring-pink-500 h-12"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="text-right text-sm">
        <a href="#" className="text-zinc-400 hover:text-pink-400 hover:underline transition-colors">
            ¿Olvidaste tu contraseña?
        </a>
      </div>
      <Button
        type="submit" disabled={loading}
        className="w-full text-base font-bold h-12 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-400 text-white shadow-lg hover:scale-105 hover:from-pink-700 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
      >
        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
};
