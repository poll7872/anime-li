'use client';

import { useAuth } from "@/context/AuthContext";
import { LoginModal } from "@/components/auth/LoginModal";
import { Button } from "@/components/ui/button";
import { AnimeSearch } from '@/components/anime/AnimeSearch';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Star } from "lucide-react";

// Función para obtener las iniciales del usuario
const getInitials = (name: string) => {
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.toUpperCase().slice(0, 2);
};

export function NavBar() {
  const { user, signOut } = useAuth();

  const userName = user?.user_metadata?.user_name || user?.email?.split('@')[0] || 'Usuario';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <header className="relative z-50 w-full bg-background/95 py-3 mt-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        {/* Logo y Navegación Principal */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Animeli Logo" className="w-40" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-lg font-medium text-zinc-300">
            <a href="/anime/topanime" className="transition-colors hover:text-pink-400">
              Top Anime
            </a>
            <a href="/mylist/collections" className="transition-colors hover:text-pink-400">
              Mis Listas
            </a>
          </nav>
        </div>

        {/* Búsqueda y Perfil de Usuario */}
        <div className="flex items-center gap-4">
          <div>
            <AnimeSearch />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-transparent hover:border-pink-500 transition-colors">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-zinc-800 text-pink-400 font-bold">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-zinc-900/90 border-zinc-700 text-white backdrop-blur-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-zinc-400">{userEmail}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem className="cursor-pointer hover:!bg-zinc-800/80 focus:!bg-zinc-800/80">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:!bg-zinc-800/80 focus:!bg-zinc-800/80">
                  <Star className="mr-2 h-4 w-4" />
                  <span>Mis Colecciones</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-pink-400 hover:!text-pink-300 hover:!bg-zinc-800/80 focus:!bg-zinc-800/80">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginModal />
          )}
        </div>
      </div>
    </header>
  );
}