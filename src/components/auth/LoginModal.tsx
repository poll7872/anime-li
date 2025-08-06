"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRound, Github } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);

export function LoginModal() {
  const [isRegisterView, setIsRegisterView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      console.error(`${provider} login error:`, error.message);
      // Aquí podrías mostrar un toast o mensaje de error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-pink-500/20 transition-colors duration-200">
          <UserRound />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900/80 border-pink-600/30 text-white backdrop-blur-xl max-w-md shadow-2xl shadow-pink-500/10">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-white mb-2">
            {isRegisterView ? "Crea tu Cuenta" : "Bienvenido a AnimeLi"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isRegisterView
              ? "Únete a la comunidad de AnimeLi. ¡Es rápido y fácil!"
              : "Inicia sesión para guardar y organizar tu anime favorito."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => handleOAuthLogin('google')} variant="outline" className="bg-zinc-800/60 border-zinc-700 hover:bg-zinc-700/80 hover:text-white">
              <GoogleIcon className="mr-2" />
              Google
            </Button>
            <Button onClick={() => handleOAuthLogin('github')} variant="outline" className="bg-zinc-800/60 border-zinc-700 hover:bg-zinc-700/80 hover:text-white">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">
                {isRegisterView ? "O regístrate con tu email" : "O continúa con"}
              </span>
            </div>
          </div>

          {isRegisterView ? <RegisterForm onSuccess={() => setIsOpen(false)} /> : <LoginForm onSuccess={() => setIsOpen(false)} />}
        </div>

        <p className="mt-4 text-center text-sm text-zinc-400">
          {isRegisterView ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{' '}
          <button
            onClick={() => setIsRegisterView(!isRegisterView)}
            className="font-semibold text-pink-400 hover:underline focus:outline-none"
          >
            {isRegisterView ? "Inicia sesión" : "Regístrate aquí"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}