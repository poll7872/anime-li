'use client';

import { useState } from "react";
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
import { Plus, X } from "lucide-react";
import { createCollection } from "@/api/collections";

interface CreateCollectionModalProps {
  onCollectionCreated: () => void;
}

export function CreateCollectionModal({ onCollectionCreated }: CreateCollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [previewImages, setPreviewImages] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCollection({
        name,
        description,
        preview_images: previewImages.filter((url) => url.trim() !== ""),
      });

      setLoading(false);
      setIsOpen(false);
      onCollectionCreated();

      // Resetear el formulario
      setName('');
      setDescription('');
      setPreviewImages(['']);
    } catch (err) {
      setError("Error al crear la colección.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="gradient-pink"
          className="px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Crear nueva lista
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900/80 border-pink-600/30 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            Crear Nueva Colección
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateCollection} className="space-y-4">
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
            {loading ? 'Guardando...' : 'Guardar Colección'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}