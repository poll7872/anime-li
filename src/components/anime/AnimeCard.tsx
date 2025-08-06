'use client';

import { Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Anime } from "@/types";

export function CardAnime({
  mal_id,
  title,
  images,
  score,
  type,
  synopsis,
  genres = [],
}: Pick<Anime, 'mal_id' | 'title' | 'images' | 'score' | 'type' | 'synopsis' | 'genres'>) {
  return (
    <div className={cn(
      "group rounded-xl relative flex flex-col h-full border-none bg-gradient-to-br from-pink-700/30 to-zinc-900/80 shadow-xl overflow-hidden",
      "transition-transform hover:scale-[1.025] hover:shadow-2xl"
    )}>
      {/* Contenedor de imagen con relación de aspecto fija */}
      <div className="relative w-full aspect-[2/3]">
        {/* Imagen optimizada manualmente */}
        <picture>
          <source
            srcSet={images?.webp?.large_image_url}
            type="image/webp"
          />
          <img
            src={images?.jpg?.large_image_url || ""}
            alt={title}
            width={225}
            height={338}
            className="w-full h-full object-cover rounded-xl border-4 border-pink-600/40 shadow-lg transition-all duration-300 group-hover:brightness-75"
            loading="lazy"
            decoding="async"
          />
        </picture>

        {/* Badges */}
        <Badge className="absolute top-3 left-3 z-20 flex items-center gap-1 bg-pink-700/90 shadow-md backdrop-blur-md">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span className="font-bold">{typeof score === "number" ? score.toFixed(1) : "N/A"}</span>
        </Badge>

        <Badge className="absolute top-3 right-3 z-20 bg-pink-700/90 shadow-md backdrop-blur-md">
          {type}
        </Badge>
      </div>

      {/* Overlay glassmorphism al hacer hover */}
      <div className={cn(
        "absolute inset-0 flex flex-col justify-end p-5",
        "bg-pink-700/80 bg-opacity-80 backdrop-blur-xl text-white",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        "rounded-xl z-30"
      )}>
        <div>
          <h3 className="text-2xl font-extrabold mb-2 drop-shadow-lg">{title}</h3>
          <p className="text-sm text-white/90 mb-4 line-clamp-5 drop-shadow">
            {synopsis}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {genres.map(genre => (
              <Badge
                key={genre.mal_id}
                variant="outline"
                className="text-xs bg-pink-500/30 text-white border-pink-400 shadow"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
          <a
            href={`/anime/${mal_id}`}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition"
          >
            Ver más <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Footer solo visible sin hover */}
      <div className="px-4 py-3 transition-opacity duration-300 group-hover:opacity-0">
        <p className="text-lg font-bold truncate text-white drop-shadow">{title}</p>
      </div>
    </div>
  );
}