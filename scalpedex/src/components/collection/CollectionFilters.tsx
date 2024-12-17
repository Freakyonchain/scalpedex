// src/components/collection/CollectionFilters.tsx
'use client'

import { Search, PlusCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function CollectionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search')
    const condition = searchParams.get('condition')
    
    const params = new URLSearchParams()
    if (search) params.set('search', search.toString())
    if (condition) params.set('condition', condition)
    
    router.push(`/collection?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-2">
        
          href="/collection"
          className={`px-4 py-2 rounded-lg transition-colors ${
            !searchParams.get('condition')
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
          }`}
        >
          Tous
        </a>
        
          href="/collection?condition=FACTORY_SEALED"
          className={`px-4 py-2 rounded-lg transition-colors ${
            searchParams.get('condition') === 'FACTORY_SEALED'
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
          }`}
        >
          Sealed
        </a>
        
          href="/collection?condition=MINT,NEAR_MINT"
          className={`px-4 py-2 rounded-lg transition-colors ${
            searchParams.get('condition') === 'MINT,NEAR_MINT'
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
          }`}
        >
          Singles
        </a>
      </div>

      <div className="flex gap-2">
        <form onSubmit={handleSearch} className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
          <input 
            type="text"
            name="search"
            defaultValue={searchParams.get('search') || ''}
            placeholder="Rechercher dans la collection..."
            className="pl-10 pr-4 py-2 bg-violet-900/20 border border-violet-800/50 rounded-lg text-white placeholder-violet-400 w-64"
          />
        </form>

        <button 
          onClick={() => alert('Fonctionnalité à venir')}
          className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          title="Ajouter un item"
        >
          <PlusCircle size={24} />
        </button>
      </div>
    </div>
  )
}