'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Pencil,
  Trash2,
  ListFilter,
  Search,
  Loader,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { StatusSelect, type AnimeStatus } from '@/components/common/StatusSelect';
import { getAnimesFromCollection } from '@/api/animes';
import type { AnimeList } from '@/types';

interface AnimeListProps {
  collectionId: string;
  collectionTitle: string;
}

export function AnimeList({ collectionId, collectionTitle }: AnimeListProps) {
  const [animeList, setAnimeList] = React.useState<AnimeList[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const animes = await getAnimesFromCollection(collectionId);
        setAnimeList(animes);
        setError(null);
      } catch (err) {
        setError('Error al cargar los animes de la colección.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [collectionId]);

  const handleStatusChange = (mal_id: number, newStatus: AnimeStatus) => {
    setAnimeList((prevList) =>
      prevList.map((anime) =>
        anime.mal_id === mal_id ? { ...anime, status: newStatus } : anime
      )
    );
    // Aquí deberías llamar a una función API para actualizar el estado en la base de datos
    console.log(`Cambiando estado de ${mal_id} a ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-bold mt-10">{error}</div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-20">
      {/* --- Encabezado de la Colección --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            {collectionTitle}
          </h1>
          <p className="text-zinc-400 mt-1">
            {animeList.length} animes en tu lista. ¡Sigue así!
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Buscar en tu lista..."
              className="w-full pl-10 border-zinc-700 bg-zinc-800/60 h-11 rounded-xl focus:ring-pink-500"
            />
          </div>
          <Button
            variant="outline"
            className="h-11 bg-zinc-800/60 border-zinc-700 hover:bg-zinc-700/80"
          >
            <ListFilter className="w-5 h-5 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* --- Contenedor de la Tabla --- */}
      <div className="bg-zinc-900/80 border border-pink-600/30 rounded-2xl shadow-2xl shadow-pink-900/10 backdrop-blur-xl overflow-hidden px-3">
        <Table>
          <TableHeader>
            <TableRow className="border-b-zinc-800">
              <TableHead className="text-white font-semibold w-[30%]">
                Anime
              </TableHead>
              <TableHead className="text-center text-white font-semibold">
                Puntuación
              </TableHead>
              <TableHead className="text-center text-white font-semibold">
                Progreso
              </TableHead>
              <TableHead className="text-center text-white font-semibold">
                Estado
              </TableHead>
              <TableHead className="text-center text-white font-semibold">
                Inicio
              </TableHead>
              <TableHead className="text-center text-white font-semibold">
                Fin
              </TableHead>
              <TableHead className="text-right text-white font-semibold">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animeList.map((anime) => (
              <TableRow
                key={anime.mal_id}
                className="border-b-zinc-800 hover:bg-pink-500/5"
              >
                {/* Celda de Título e Imagen */}
                <TableCell>
                  <a
                    href={`/anime/${anime.mal_id}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-14 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 border-pink-600/40 shadow-lg">
                      <img
                        src={anime.image_webp}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-pink-300 transition-colors">
                        {anime.title}
                      </p>
                      <p className="text-sm text-zinc-400">
                        {anime.type} &bull; {anime.year}
                      </p>
                    </div>
                  </a>
                </TableCell>

                {/* Celda de Puntuación */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="border-yellow-400/50 text-yellow-300 font-bold text-sm"
                  >
                    <Star className="w-4 h-4 mr-1.5 fill-yellow-400 text-yellow-400" />
                    {anime.score.toFixed(2)}
                  </Badge>
                </TableCell>

                {/* Celda de Progreso */}
                <TableCell className="text-center font-mono text-zinc-300">
                  {anime.progress} / {anime.episodes}
                </TableCell>

                {/* Celda de Estado */}
                <TableCell className="text-center">
                  <StatusSelect
                    value={anime.status as AnimeStatus}
                    onChange={(newStatus) =>
                      handleStatusChange(anime.mal_id, newStatus)
                    }
                  />
                </TableCell>

                {/* Celda de Fecha de Inicio */}
                <TableCell className="text-center text-zinc-300">
                  {anime.started_at ? anime.started_at : <span className="text-zinc-500">—</span>}
                </TableCell>

                {/* Celda de Fecha de Fin */}
                <TableCell className="text-center text-zinc-300">
                  {anime.finished_at ? anime.finished_at : <span className="text-zinc-500">—</span>}
                </TableCell>

                {/* Celda de Acciones */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-zinc-400 hover:text-white hover:bg-red-500/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

