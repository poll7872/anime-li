'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Collection } from "@/types";
import { EditCollectionModal } from "./EditCollection";
import { DeleteCollectionModal } from "./DeleteCollectionModal";

interface CollectionCardProps {
  collection: Collection;
  onCollectionUpdated: () => void; // Función para refrescar la lista en el padre
}

export function CollectionCard({ collection, onCollectionUpdated }: CollectionCardProps) {
  return (
    <div
      key={collection.id}
      className={cn(
        "group relative rounded-xl overflow-hidden shadow-xl h-96 flex flex-col justify-end bg-zinc-900",
        "transition-all duration-500 ease-in-out transform hover:scale-[1.05]"
      )}
    >
      <div className="absolute inset-0 w-full h-full">
        {(collection.preview_images || []).map((src: string, i: number) => (
          <img
            key={i}
            src={src}
            alt={`preview ${i + 1} for ${collection.name}`}
            className={cn(
              "absolute w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:brightness-50",
              i === 0 && "z-10",
              i === 1 && "z-20 scale-110 group-hover:scale-125",
              i === 2 && "z-30 scale-125 group-hover:scale-150 opacity-0 group-hover:opacity-100"
            )}
          />
        ))}
        <div className="absolute inset-0 z-40 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>

      <div className="relative z-50 p-5 text-white">
        <Badge className="mb-3 bg-pink-700/90 text-white text-xs border-pink-400 shadow-lg backdrop-blur-md">
          {collection.animes_count || 0} animes
        </Badge>
        <h2 className="text-2xl font-extrabold text-white drop-shadow-lg mb-2">{collection.name}</h2>
        <p className="text-zinc-300 text-sm mb-4 line-clamp-2">{collection.description}</p>
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a href={`/mylist/${collection.id}`} className="flex-1">
            <Button className="w-full gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-lg text-white">
              Ver Lista <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <EditCollectionModal collection={collection} onCollectionUpdated={onCollectionUpdated} />
          <DeleteCollectionModal collection={collection} onCollectionDeleted={onCollectionUpdated} />
        </div>
      </div>
    </div>
  )
}