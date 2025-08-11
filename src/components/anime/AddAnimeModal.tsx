'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Star } from "lucide-react";
import type { Anime, AnimeList, Collection } from '@/types';
import { getCollections } from '@/api/collections';
import { addAnimeToCollection } from '@/api/animes';

// Props para el componente del modal
interface AddAnimeModalProps {
  anime: Pick<Anime, 'mal_id' | 'title' | 'images' | 'episodes' | 'type' | 'year' | 'score' | 'url' | 'airing' | 'synopsis' | 'season' | 'genres'>;
}

// Componente para el selector de estrellas
function StarRating({ rating, setRating }: { rating: number; setRating: (rating: number) => void; }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(10)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              starValue <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'
            }`}
            onClick={() => setRating(starValue)}
          />
        );
      })}
    </div>
  );
}

export function AddAnimeModal({ anime }: AddAnimeModalProps) {
  const [open, setOpen] = React.useState(false);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [selectedScore, setSelectedScore] = React.useState(Math.round(anime.score || 0));
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Cargar las colecciones del usuario cuando el modal se monta
  React.useEffect(() => {
    if (!open) return;
    const fetchCollections = async () => {
      try {
        const userCollections = await getCollections();
        setCollections(userCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        // Opcional: mostrar un error en la UI
      }
    };
    fetchCollections();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const collectionId = formData.get("collection_id") as string;

    if (!collectionId) {
      setError("Por favor, selecciona una colección.");
      setIsSubmitting(false);
      return;
    }

    const dataToInsert: Omit<AnimeList, "collection_id"> = {
      mal_id: anime.mal_id,
      title: anime.title,
      url: anime.url,
      image_jpg: anime.images.jpg.image_url,
      image_webp: anime.images.webp.image_url,
      episodes: anime.episodes,
      type: anime.type,
      year: anime.year,
      season: anime.season,
      airing: anime.airing,
      synopsis: anime.synopsis,
      genres: anime.genres,
      status: formData.get("status") as "watching" | "completed" | "plan_to_watch",
      score: Number(formData.get("score")),
      progress: Number(formData.get("progress")),
      started_at: (formData.get("started_at") as string) || undefined,
      finished_at: (formData.get("finished_at") as string) || undefined,
      notes: formData.get("notes") as string,
    };

    try {
      await addAnimeToCollection(collectionId, dataToInsert);
      setIsSubmitting(false);
      setOpen(false);
    } catch (err) {
      console.error("Error adding anime:", err);
      setError("Hubo un error al añadir el anime. Por favor, inténtalo de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setError(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="gradient-pink" className="px-6 py-3 rounded-xl w-full md:w-auto">
          <Plus className="w-5 h-5 mr-2" />
          Añadir a mi lista
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900/80 border-pink-600/30 text-white backdrop-blur-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            Añadir "{anime.title}" a tu lista
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Columna del Formulario */}
          <div className="space-y-4">
            {/* Estado y Colección */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select name="status">
                  <SelectTrigger id="status" className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500">
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                    <SelectItem value="watching">Viendo</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="plan_to_watch">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="collection">Colección</Label>
                <Select name="collection_id">
                  <SelectTrigger id="collection" className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500">
                    <SelectValue placeholder="Selecciona una colección" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 text-white border-zinc-700">
                    {collections.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Puntuación con Estrellas */}
            <div className="space-y-2">
              <Label>Puntuación</Label>
              <StarRating rating={selectedScore} setRating={setSelectedScore} />
              <Input type="hidden" name="score" value={selectedScore} />
            </div>

            {/* Progreso de Episodios */}
            <div className="space-y-2">
              <Label htmlFor="progress">Episodios vistos</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="progress"
                  name="progress"
                  type="number"
                  placeholder="0"
                  className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500 w-24"
                />
                <span className="text-zinc-400">/ {anime.episodes || '??'}</span>
              </div>
            </div>

            {/* Fechas de Visionado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="started_at">Empezado el</Label>
                <Input id="started_at" name="started_at" type="date" className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="finished_at">Terminado el</Label>
                <Input id="finished_at" name="finished_at" type="date" className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500" />
              </div>
            </div>

            {/* Notas Personales */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Escribe tus notas, opiniones o recordatorios aquí..."
                className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500"
              />
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="gradient-pink"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl mt-4"
            >
              {isSubmitting ? "Guardando..." : "Guardar en mi lista"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
