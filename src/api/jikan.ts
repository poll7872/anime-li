import type { AxiosResponse } from 'axios';
import axios from 'axios';
import type { Anime } from '@/types';

const jikan = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 2000,
});

//Buscar animes por nombre
export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const response: AxiosResponse<{ data: Anime[] }> = await jikan.get('/anime?sfw', {
      params: {
        q: query,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching anime data:', error);
    throw error;
  }
}

//Obtener animes recientes
export async function getRecentAnimes(): Promise<Anime[]> {
  try {
    const response: AxiosResponse<{ data: Anime[] }> = await jikan.get('/seasons/now?sfw', {
      params: {
        limit: 12,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching recent animes:', error);
    throw error;
  }
}

export async function searchAnimeById(id: string): Promise<Anime> {
  try {
    const response: AxiosResponse<{ data: Anime }> = await jikan.get(`/anime/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching anime by ID:', error);
    throw error;
  }
}