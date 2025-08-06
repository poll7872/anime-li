'use client';

import { useAnimeDetail } from "@/hooks/useAnimes";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { AddAnimeModal } from "@/components/anime/AddAnimeModal";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AnimeDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { anime, isLoading, error } = useAnimeDetail(id);

  if (isLoading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!anime) return null;

  return (
    <section className="relative mt-10 mb-16 px-4">
      {/* Fondo glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-700/40 to-zinc-900/80 rounded-3xl blur-[2px] opacity-80 z-0" />
      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 rounded-3xl shadow-2xl bg-zinc-900/80 border border-pink-600/30 backdrop-blur-xl">
        {/* Imagen */}
        <div className="flex-shrink-0 w-full md:w-64 h-96 rounded-2xl overflow-hidden border-4 border-pink-600/40 shadow-lg bg-zinc-900 group relative">
          <picture>
            <source srcSet={anime.images.webp?.large_image_url} type="image/webp" />
            <img
              src={anime.images.jpg?.large_image_url}
              alt={anime.title}
            width={256} // w-64 = 256px
            height={384} // h-96 = 384px
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </picture>
          {/* Episodios badge */}
          <span className="absolute bottom-3 left-3 bg-pink-700/90 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold">
            {anime.episodes ? `${anime.episodes} episodios` : "Sin episodios"}
          </span>
        </div>
        {/* Info */}
        <div>
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">{anime.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres.map((genre) => (
                <Badge key={genre.mal_id} className="bg-pink-600/80 text-white text-xs border-pink-400 shadow">
                  {genre.name}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-pink-700/80 text-xs">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    <span className="font-bold">{typeof anime.score === "number" ? anime.score.toFixed(1) : "N/A"}</span>
                </Badge>
                <Badge className="bg-pink-700/80 text-xs">{anime.type || "N/A"}</Badge>
                <Badge className="bg-pink-700/80 text-xs">{anime.status}</Badge>
            </div>
            <ScrollArea className="h-28 mb-6 pr-4">
              <p className="text-zinc-300 text- mb-4">{anime.synopsis || "Sin sinopsis disponible."}</p>
            </ScrollArea>
          </div>
          {/* Botón para añadir a la lista */}
          <div>
            <AddAnimeModal anime={anime} />
          </div>
        </div>
      </div>
    </section>
  );
}
