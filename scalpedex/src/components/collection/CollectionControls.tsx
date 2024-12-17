'use client'

import Link from 'next/link'  // Ajoutez cet import
import { Search, PlusCircle } from 'lucide-react'
import { AddItemModal } from './ItemModal'  // Ajoutez cet import


interface CollectionControlsProps {
  search?: string
  condition?: string
}

export function CollectionControls({ search, condition }: CollectionControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-violet-600 scrollbar-track-violet-900/20">
        <Link 
          href="/collection"
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            !condition 
              ? 'bg-violet-600 text-white' 
              : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
          }`}
        >
          Tous
        </Link>
        
        <Link 
          href="/collection?condition=FACTORY_SEALED"
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            condition === 'FACTORY_SEALED'
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
          }`}
        >
          Sealed
        </Link>
        
        <Link 
          href="/collection?condition=MINT,NEAR_MINT"
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            condition === 'MINT,NEAR_MINT'
              ? 'bg-violet-600 text-white'
              : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
          }`}
        >
          Singles
        </Link>
      </div>

      {/* Le reste du code reste identique */}
      <div className="flex gap-2">
        <form className="relative" action="/collection" method="GET">
          {condition && <input type="hidden" name="condition" value={condition} />}
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
          <input 
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Rechercher dans la collection..."
            className="pl-10 pr-4 py-2 bg-violet-900/20 border border-violet-800/50 rounded-lg text-white placeholder-violet-400 w-64"
          />
        </form>

        <AddItemModal />
      </div>
    </div>
  )
}