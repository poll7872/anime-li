import { supabase } from "@/lib/supabase";
import type { Collection } from "@/types";

export interface CreateCollectionData {
  name: string;
  description: string;
  preview_images: string[];
}

export async function getCollections(): Promise<Collection[]> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching collections:", error.message);
    throw error;
  }

  return data || [];
}

export async function createCollection(collectionData: CreateCollectionData): Promise<any> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("collections")
    .insert({ ...collectionData, user_id: user.id });

  if (error) {
    console.error("Error creating collection:", error.message);
    throw error;
  }

  return data;
}

export async function updateCollection(id: string, collectionData: CreateCollectionData): Promise<any> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("collections")
    .update(collectionData)
    .eq("id", id)
    .eq("user_id", user.id); // Asegurarse de que el usuario solo pueda actualizar sus propias colecciones

  if (error) {
    console.error("Error updating collection:", error.message);
    throw error;
  }

  return data;
}

export async function deleteCollection(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // Asegurarse de que el usuario solo pueda eliminar sus propias colecciones

  if (error) {
    console.error("Error deleting collection:", error.message);
    throw error;
  }
}