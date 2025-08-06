'use client';

import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAnimeSearch } from '@/hooks/useAnimes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export function AnimeSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { results, isLoading, error } = useAnimeSearch(debouncedQuery);

  return (
    <div className="relative w-full">
      {/* Input Container */}
      <div className="relative mb-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <input
          placeholder="Buscar anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-md pl-10 border-none bg-zinc-700 h-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
        />
      </div>

      {/* Resultados */}
      <div className="absolute top-full left-0 right-0 z-50 mt-1 shadow-xl max-h-[28rem]">
        {isLoading && (
          <div className="bg-zinc-800 p-4 rounded-xl">
            <p className="text-sm text-center">Buscando...</p>
          </div>
        )}

        {error && (
          <div className="bg-zinc-800 p-4 rounded-xl">
            <p className="text-sm text-red-500 text-center">{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <ScrollArea className="w-md h-96 rounded-xl border border-zinc-600 bg-zinc-800">
            <ul className="divide-y w-full divide-zinc-700">
              {results.map((anime) => (
                <li key={anime.mal_id}>
                  <a
                    href={`/anime/${anime.mal_id}`}
                    rel="noopener noreferrer"
                    className="flex gap-4 items-center p-3 hover:bg-pink-700/30 transition rounded-xl group"
                  >
                    {/* Imagen con borde y sombra */}
                    <div className="flex-shrink-0 w-16 h-24 overflow-hidden rounded-lg border-2 border-pink-600/40 shadow-lg bg-zinc-900">
                      <picture>
                        <source srcSet={anime.images.webp?.large_image_url} type="image/webp" />
                        <img
                          src={anime.images.jpg?.large_image_url}
                          alt={anime.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </picture>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white truncate group-hover:text-pink-200 transition w-40">{anime.title}</h3>
                        <Badge className="bg-pink-600/80 text-xs">{anime.type || 'N/A'}</Badge>
                        {typeof anime.score === "number" && (
                          <Badge variant="outline" className="flex items-center gap-1 border-pink-400 text-xs">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {anime.score.toFixed(1)}
                          </Badge>
                        )}
                        {anime.episodes ? (
                          <Badge variant="outline" className="text-xs border-pink-400">
                            {anime.episodes} eps
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-2 mb-1 w-80">{anime.synopsis}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {anime.genres?.slice(0, 3).map((g) => (
                          <Badge
                            key={g.mal_id}
                            variant="outline"
                            className="text-xs bg-pink-500/30 text-white border-pink-400"
                          >
                            {g.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}

        {debouncedQuery && !isLoading && results.length === 0 && (
          <div className="bg-zinc-800 p-4 rounded-xl">
            <p className="text-sm text-center">No se encontraron resultados</p>
          </div>
        )}
      </div>
    </div>
  );
}
