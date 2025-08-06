'use client';

import { useState, useEffect } from "react";
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
import { X, Pencil } from "lucide-react";
import { updateCollection, type Collection } from "@/api/collections";

interface EditCollectionModalProps {
  collection: Collection;
  onCollectionUpdated: () => void;
}

export function EditCollectionModal({ collection, onCollectionUpdated }: EditCollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description);
  const [previewImages, setPreviewImages] = useState<string[]>(collection.preview_images || ['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(collection.name);
    setDescription(collection.description);
    setPreviewImages(collection.preview_images || ['']);
  }, [collection]);

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...previewImages];
    newImages[index] = value;
    setPreviewImages(newImages);
  };

  const addImageInput = () => {
    if (previewImages.length < 3) {
      setPreviewImages([...previewImages, '']);
    }
  };

  const removeImageInput = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
  };

  const handleUpdateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateCollection(collection.id, {
        name,
        description,
        preview_images: previewImages.filter((url) => url.trim() !== ""),
      });

      setLoading(false);
      setIsOpen(false); // Cierra el modal al guardar
      onCollectionUpdated(); // Llama a la función para refrescar la lista de colecciones
    } catch (err) {
      setError("Error al actualizar la colección.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-lg">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900/80 border-pink-600/30 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            Editar Colección: {collection.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateCollection} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection-name" className="text-zinc-300">Nombre de la colección</Label>
            <Input
              id="collection-name"
              type="text"
              placeholder="Ej: Animes que me cambiaron la vida"
              className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-description" className="text-zinc-300">Descripción</Label>
            <Textarea
              id="collection-description"
              placeholder="Una breve descripción de qué trata tu colección..."
              className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Imágenes de vista previa (URLs)</Label>
            {previewImages.map((url, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="bg-zinc-800/60 border-zinc-700 focus:ring-pink-500"
                  value={url}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                />
                {previewImages.length > 1 && (
                  <Button type="button" size="icon" variant="ghost" onClick={() => removeImageInput(index)} className="text-red-400 hover:bg-red-500/20 hover:text-red-300">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {previewImages.length < 3 && (
              <Button type="button" variant="outline" onClick={addImageInput} className="text-xs h-8 mt-2 border-zinc-700 hover:bg-zinc-800 hover:text-pink-400">
                Añadir otra imagen
              </Button>
            )}
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            variant="gradient-pink"
            disabled={loading}
            className="w-full inline-flex items-center gap-2 px-6 py-3 rounded-xl mt-4 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Actualizando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
