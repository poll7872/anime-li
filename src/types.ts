export interface Anime {
  mal_id: number;
  url: string;
  title: string;

  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  type: string;
  episodes: number;
  status: string;
  airing: boolean;
  score: number;
  synopsis: string;
  season: string;
  year: number;
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  preview_images: string[];
  animes_count: number;
  user_id: string;
}

export interface AnimeList {
  mal_id: number; // ID del anime en Jikan
  title: string; // Título del anime
  url: string; // URL en MyAnimeList
  image_jpg: string; // Solo la imagen grande JPG
  image_webp: string; // Solo la imagen grande WEBP
  status: "watching" | "completed" | "plan_to_watch"; // Tracker del usuario
  type: string;
  episodes: number; // Total de episodios del anime
  progress: number; // Episodios vistos por el usuario
  score: number; // Puntuación asignada por el usuario
  airing: boolean; // ¿Está en emisión?
  synopsis: string; // Descripción
  season: string; // spring, summer, etc
  year: number; // Año de emisión
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  collection_id: string; // Relación con la colección
}
