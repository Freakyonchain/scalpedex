'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, ExternalLink, Edit, CreditCard, LayoutGrid, Calendar } from 'lucide-react'
import { createClientBrowser } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'

interface UserStats {
  collectionCount: number
  totalValue: number
  memberSince: string
}

interface CollectionItem {
  purchase_price: number
  quantity: number
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClientBrowser()
  const [user, setUser] = useState<any>(null)
  const [userStats, setUserStats] = useState<UserStats>({
    collectionCount: 0,
    totalValue: 0,
    memberSince: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      try {
        // 1. Vérification de l'utilisateur
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('Erreur d\'authentification:', userError.message)
          toast.error("Erreur d'authentification")
          router.push('/auth/sign-in')
          return
        }

        if (!user) {
          router.push('/auth/sign-in')
          return
        }

        setUser(user)

        // 2. Vérification de l'existence de la table
        const { data: tableInfo, error: tableError } = await supabase
          .from('items')
          .select('count')
          .limit(0)

        if (tableError) {
          if (tableError.message.includes('relation "items" does not exist')) {
            toast.error("La table 'items' n'existe pas encore")
            setUserStats({
              collectionCount: 0,
              totalValue: 0,
              memberSince: new Date(user.created_at).toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric'
              })
            })
            setLoading(false)
            return
          }
        }

        // 3. Récupération du nombre d'items
        const { count, error: countError } = await supabase
          .from('items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        if (countError) {
          console.error('Erreur du comptage:', countError.message)
          toast.error("Erreur lors du comptage des items")
          throw countError
        }

        // 4. Récupération des valeurs
        let totalValue = 0
        try {
          const { data: items, error: itemsError } = await supabase
            .from('items')
            .select('purchase_price, quantity')
            .eq('user_id', user.id)

          if (itemsError) throw itemsError

          if (items) {
            totalValue = items.reduce(
              (sum: number, item: CollectionItem) => 
                sum + (Number(item.purchase_price) * Number(item.quantity)), 
              0
            )
          }
        } catch (error: any) {
          console.error('Erreur de calcul de la valeur totale:', error.message)
          toast.error("Erreur lors du calcul de la valeur totale")
        }

        // 5. Mise à jour des stats
        setUserStats({
          collectionCount: count || 0,
          totalValue: totalValue,
          memberSince: new Date(user.created_at).toLocaleDateString('fr-FR', {
            month: 'long',
            year: 'numeric'
          })
        })

      } catch (error: any) {
        console.error('Erreur générale:', error.message)
        toast.error("Impossible de charger les données du profil")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, supabase])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Déconnexion réussie')
      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      toast.error("Une erreur s'est produite lors de la déconnexion")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-violet-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-gradient-to-b from-black to-violet-950">
      {/* En-tête du profil */}
      <div className="rounded-xl border border-violet-800/30 bg-violet-900/20 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-medium text-white">
                {user?.email?.split('@')[0] || 'Utilisateur'}
              </h1>
              <p className="text-sm text-violet-300">
                {user?.email || 'Compte standard'}
              </p>
            </div>
          </div>
          <Link 
            href="/profile/edit"
            className="p-2 rounded-full hover:bg-violet-900/30 transition-colors"
          >
            <Edit className="h-5 w-5 text-violet-400" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              label: 'Collection', 
              value: `${userStats.collectionCount} cartes`,
              icon: <LayoutGrid className="h-5 w-5 text-violet-400" />
            },
            { 
              label: 'Valeur totale', 
              value: `${userStats.totalValue.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}`,
              icon: <CreditCard className="h-5 w-5 text-green-400" />
            },
            { 
              label: 'Membre depuis', 
              value: userStats.memberSince,
              icon: <Calendar className="h-5 w-5 text-blue-400" />
            }
          ].map((stat) => (
            <div 
              key={stat.label} 
              className="rounded-lg bg-black/20 p-3 text-center flex flex-col items-center gap-2"
            >
              {stat.icon}
              <div className="text-lg font-medium text-white">{stat.value}</div>
              <div className="text-sm text-violet-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="space-y-4">
        <div className="bg-violet-900/20 border border-violet-800/30 rounded-lg">
          <Link
            href="/settings"
            className="flex w-full items-center justify-between p-4 text-white hover:bg-violet-900/30 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-violet-400" />
              <span>Paramètres</span>
            </div>
            <ExternalLink className="h-5 w-5 text-violet-400" />
          </Link>
        </div>

        <div className="bg-red-900/20 border border-red-800/30 rounded-lg">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-between p-4 text-white hover:bg-red-900/30 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-400" />
              <span>Se déconnecter</span>
            </div>
            <ExternalLink className="h-5 w-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}