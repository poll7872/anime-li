'use client'

import { useEffect, useState } from "react"
import { LayoutGrid } from "lucide-react"
import { CreateCollectionModal } from "@/components/collections/CreateCollectionModal"
import { CollectionCard } from "@/components/collections/CollectionCard"
import { getCollections, type Collection } from "@/api/collections"

export function Collections() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCollections = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getCollections()
      setCollections(data)
    } catch (err) {
      setError("Error al cargar las colecciones.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Mis Colecciones</h1>
          <p className="text-zinc-400 mt-1">Organiza y presume tus animes favoritos.</p>
        </div>
        <CreateCollectionModal onCollectionCreated={fetchCollections} />
      </div>

      {loading && <p className="text-white text-center">Cargando colecciones...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && collections.length === 0 && (
        <div className="text-center text-zinc-500 mt-24 flex flex-col items-center">
          <LayoutGrid className="w-20 h-20 mb-4 text-pink-600/30" />
          <h2 className="text-2xl font-bold text-white mb-2">Aún no tienes colecciones</h2>
          <p className="max-w-md">Parece que este lugar está un poco vacío. ¡Empieza a crear tu primera lista de animes para llenarlo!</p>
        </div>
      )}

      {!loading && !error && collections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} onCollectionUpdated={fetchCollections} />
          ))}
        </div>
      )}
    </section>
  )
}
