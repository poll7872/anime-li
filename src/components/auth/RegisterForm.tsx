"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_name: username, // Puedes guardar metadata extra así
                },
            },
        });

        if (error) {
            setError(error.message);
        } else if (data.user) {
            if (data.user.identities?.length === 0) {
                 // Si la confirmación por email está activada
                setMessage("¡Registro exitoso! Revisa tu email para confirmar tu cuenta.");
            } else {
                // Si la confirmación no es necesaria, el usuario ya está logueado
                setMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
                setTimeout(onSuccess, 2000); // Cierra el modal después de un momento
            }
        }
        setLoading(false);
    };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center">{message}</p>}
        <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
                id="username" type="text" placeholder="Elige un nombre de usuario" required
                className="pl-10 bg-zinc-800/60 border-zinc-700 focus:ring-pink-500 h-12"
                value={username} onChange={(e) => setUsername(e.target.value)}
            />
        </div>
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
                id="password" type="password" placeholder="Crea una contraseña (mín. 6 caracteres)" required
                className="pl-10 bg-zinc-800/60 border-zinc-700 focus:ring-pink-500 h-12"
                value={password} onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <Button
            type="submit" disabled={loading}
            className="w-full text-base font-bold h-12 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-pink-400 text-white shadow-lg hover:scale-105 hover:from-pink-700 hover:to-pink-500 transition-all duration-200 disabled:opacity-50 disabled:scale-100"
        >
            {loading ? 'Creando...' : 'Crear Cuenta'}
        </Button>
    </form>
  );
};
