# Script de suppression des fichiers obsolètes pour ScalpeDex

# 1. Composants obsolètes
$obsoleteComponents = @(
    "components/product/ProductCard.tsx",
    "components/ui/card.tsx",
    "components/scanner/ScalpingScore.tsx",
    "components/collection/CollectionGrid.tsx",
    "components/ui/floating-tip.tsx",
    "components/ui/input.tsx",
    "components/ui/button.tsx",
    "components/collection/SmartImage.tsx",
    "components/collection/CollectionControls.tsx",
    "components/collection/ItemModal.tsx",
    "components/scanner/ManualEntry.tsx",
    "components/providers/AuthProvider.tsx",
    "components/layout/BottomNav.tsx",
    "components/product/ProductEditForm.tsx",
    "components/scanner/QuickAddForm.tsx"
)

# 2. Types et interfaces obsolètes
$obsoleteTypes = @(
    "types/supabase.ts",
    "types/collection.ts",
    "types/database.types.ts"
)

# 3. Utilitaires et hooks obsolètes
$obsoleteUtils = @(
    "lib/db.ts",
    "lib/utils.ts",
    "lib/hooks/user-sync.ts",
    "lib/actions/items.ts",
    "lib/supabase/client.ts",
    "lib/supabase/server.ts",
    "lib/actions/collection.ts"
)

# 4. Routes API obsolètes
$obsoleteApi = @(
    "app/api/products/[barcode]/route.ts",
    "app/api/products/route.ts",
    "app/api/collection/route.ts"
)

# 5. Middleware obsolète
$obsoleteMiddleware = @(
    "middleware.ts"
)

# Combinaison de tous les fichiers obsolètes
$allObsoleteFiles = $obsoleteComponents + $obsoleteTypes + $obsoleteUtils + $obsoleteApi + $obsoleteMiddleware

# Afficher les fichiers à supprimer et demander confirmation
Write-Host "Les fichiers suivants vont être supprimés :" -ForegroundColor Yellow
foreach ($file in $allObsoleteFiles) {
    if (Test-Path $file) {
        Write-Host "- $file" -ForegroundColor Red
    } else {
        Write-Host "- $file (non trouvé)" -ForegroundColor Gray
    }
}

$confirmation = Read-Host "Voulez-vous continuer? (O/N)"
if ($confirmation -ne "O") {
    Write-Host "Opération annulée." -ForegroundColor Cyan
    exit
}

# Supprimer les fichiers
$deletedCount = 0
foreach ($file in $allObsoleteFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Supprimé: $file" -ForegroundColor Green
        $deletedCount++
    }
}

Write-Host "$deletedCount fichiers ont été supprimés." -ForegroundColor Green
Write-Host "Nettoyage terminé!" -ForegroundColor Cyan