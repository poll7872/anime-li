import { supabase } from "@/lib/supabase";
import type { AnimeList } from "@/types";

export async function getAnimesFromCollection(
  collectionId: string
): Promise<AnimeList[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("collection_animes")
    .select("*")
    .eq("collection_id", collectionId);

  if (error) {
    console.error("Error fetching animes from collection:", error.message);
    throw error;
  }

  return data || [];
}

export async function addAnimeToCollection(
  collectionId: string,
  animeData: Omit<AnimeList, "collection_id">
): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("collection_animes").insert([
    {
      ...animeData,
      collection_id: collectionId,
    },
  ]);

  if (error) {
    console.error("Error adding anime to collection:", error.message);
    throw error;
  }
}
