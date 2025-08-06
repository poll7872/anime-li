import { useState, useEffect } from 'react';
import { searchAnime, searchAnimeById } from '@/api/jikan';
import type { Anime } from '@/types';

export function useAnimeSearch(query: string) {
  const [results, setResults] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchAnime = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchAnime(query);
        setResults(data);
      } catch (err) {
        setError('Error al buscar anime');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, [query]);

  return { results, isLoading, error };
}

export function useAnimeDetail(id: string) {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAnime() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchAnimeById(id);
        setAnime(data);
      } catch (err) {
        setError("No se pudo cargar el anime.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnime();
  }, [id]);

  return { anime, isLoading, error };
}
