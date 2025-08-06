'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCollection, type Collection } from "@/api/collections";

interface DeleteCollectionModalProps {
  collection: Collection;
  onCollectionDeleted: () => void;
}

export function DeleteCollectionModal({ collection, onCollectionDeleted }: DeleteCollectionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteCollection(collection.id);
      setIsOpen(false);
      onCollectionDeleted();
    } catch (err) {
      setError("Error al eliminar la colección.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="bg-red-500/40 hover:bg-red-500/60 backdrop-blur-lg rounded-lg">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900/80 border-pink-600/30 text-white backdrop-blur-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-2">Confirmar Eliminación</DialogTitle>
          <DialogDescription className="text-zinc-400">
            ¿Estás seguro de que quieres eliminar la colección "{collection.name}"? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="bg-zinc-800/60 border-zinc-700 hover:bg-zinc-700/80 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
