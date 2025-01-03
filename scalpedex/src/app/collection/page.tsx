// app/collection/page.tsx
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { TrendingUp, Package, DollarSign, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCollectionStats, getCollectionItems } from '@/lib/actions/collection';
import { CollectionFilters } from '@/components/collection/CollectionFilters';
import { CollectionGrid } from '@/components/collection/CollectionGrid';

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Types
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  subtitle?: string;
  subtitleIcon?: any;
  subtitleColor?: string;
}

// Composant StatsCard
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  subtitle, 
  subtitleIcon: SubIcon, 
  subtitleColor = "text-violet-400" 
}: StatsCardProps) {
  return (
    <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-violet-300">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
          {subtitle && (
            <div className={`flex items-center gap-1 ${subtitleColor} text-sm mt-2`}>
              {SubIcon && <SubIcon size={16} />}
              <span>{subtitle}</span>
            </div>
          )}
        </div>
        <div className="p-2 bg-violet-600/20 rounded-lg">
          <Icon size={24} className="text-violet-400" />
        </div>
      </div>
    </div>
  );
}

// État de chargement
function LoadingState() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
      <div className="h-12 bg-violet-900/20 rounded-lg w-full max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-80 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// État vide
function EmptyState({ userName }: { userName: string }) {
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-violet-950 to-black flex items-center justify-center">
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-violet-400 mb-4" />
        <h3 className="text-2xl font-medium text-white mb-2">
          Salut {userName} 👋
        </h3>
        <p className="text-xl text-violet-300 mb-4">
          Ta collection est encore vide
        </p>
        <p className="text-violet-400 mb-6">
          Prêt à commencer ta première collection ?
        </p>
        
        <Link 
          href="/scan" 
          className="mt-4 inline-flex items-center justify-center px-6 py-3 
            bg-violet-600 text-white font-semibold 
            rounded-xl 
            hover:bg-violet-700 
            transition-colors 
            duration-300 
            shadow-lg 
            shadow-violet-500/50 
            hover:shadow-xl 
            hover:scale-105"
        >
          <Plus size={24} className="mr-2" />
          Ajoutez votre premier Item
        </Link>
      </div>
    </div>
  );
}

// Page principale
export default async function CollectionPage({
  searchParams
}: {
  searchParams: { search?: string; condition?: string; page?: string }
}) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      redirect('/auth/sign-in');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user || authError) {
      redirect('/auth/sign-in');
    }

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Collectionneur';
    const page = Number(searchParams?.page) || 1;
    const search = searchParams?.search || '';
    const condition = searchParams?.condition || '';

    // Récupération des données en parallèle
    const [stats, collectionData] = await Promise.all([
      getCollectionStats(supabase, user.id).catch(() => ({
        totalValue: 0,
        totalItems: 0,
        sealedCount: 0
      })),
      getCollectionItems({ 
        search, 
        condition, 
        page,
        limit: 12,
        supabase, 
        userId: user.id 
      })
    ]);

    // Extraire les items et le total de manière sécurisée
    const items = collectionData?.items || [];
    const total = collectionData?.total || 0;

    // Si la collection est vide (sans filtres actifs)
    if (items.length === 0 && !search && !condition) {
      return <EmptyState userName={userName} />;
    }

    // Affichage principal
    return (
      <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-violet-950 to-black">
        <Suspense fallback={<LoadingState />}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Valeur Totale"
              value={stats.totalValue.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              })}
              icon={DollarSign}
            />

            <StatsCard
              title="Items"
              value={stats.totalItems || 0}
              icon={Package}
              subtitle={`${stats.sealedCount || 0} sealed`}
              subtitleIcon={Package}
            />

            <StatsCard
              title="Meilleur ROI"
              value="-"
              icon={TrendingUp}
              subtitle="À venir"
              subtitleIcon={TrendingUp}
            />

            <StatsCard
              title="Alertes Prix"
              value="-"
              icon={AlertCircle}
              subtitle="À venir"
              subtitleIcon={AlertCircle}
              subtitleColor="text-yellow-400"
            />
          </div>

          {/* Filtres et Recherche */}
          <CollectionFilters 
            search={search} 
            condition={condition} 
          />

          {/* Message pour les résultats filtrés */}
          {(search || condition) && (
            <div className="text-violet-300 mb-4">
              {total === 0 ? (
                <p>Aucun résultat trouvé pour votre recherche</p>
              ) : (
                <p>{total} résultat(s) trouvé(s)</p>
              )}
            </div>
          )}

          {/* Grille de la Collection */}
          <CollectionGrid items={items} />

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/collection?page=${page - 1}${search ? `&search=${search}` : ''}${condition ? `&condition=${condition}` : ''}`}
                  className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors"
                >
                  Précédent
                </Link>
              )}
              
              {[...Array(Math.ceil(total / 12))].map((_, i) => {
                if (i + 1 === page || i + 1 === 1 || i + 1 === Math.ceil(total / 12) || 
                    (i + 1 >= page - 1 && i + 1 <= page + 1)) {
                  return (
                    <Link
                      key={i}
                      href={`/collection?page=${i + 1}${search ? `&search=${search}` : ''}${condition ? `&condition=${condition}` : ''}`}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        page === i + 1
                          ? 'bg-violet-600 text-white'
                          : 'bg-violet-900/50 text-violet-300 hover:bg-violet-800/50'
                      }`}
                    >
                      {i + 1}
                    </Link>
                  );
                } else if (i === 1 || i === Math.ceil(total / 12) - 2) {
                  return <span key={i} className="px-2 text-violet-400">...</span>;
                }
                return null;
              })}
              
              {page < Math.ceil(total / 12) && (
                <Link
                  href={`/collection?page=${page + 1}${search ? `&search=${search}` : ''}${condition ? `&condition=${condition}` : ''}`}
                  className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors"
                >
                  Suivant
                </Link>
              )}
            </div>
          )}
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('Erreur dans CollectionDashboard:', error);
    return (
      <div className="p-6 text-red-400">
        Une erreur est survenue lors du chargement de la collection.
      </div>
    );
  }
}