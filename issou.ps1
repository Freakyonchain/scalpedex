# =============================================================================
# ScalpeDex - COMPLETE MIGRATION SCRIPT (One-Shot) - FIXED VERSION
# =============================================================================
# Ce script fait TOUT:
#   1. Resout le probleme d'imbrication scalpedex/scalpedex
#   2. Migre Feature-Sliced -> Clean & Flat
#   3. Met a jour TOUS les imports automatiquement
#   4. Supprime les anciens dossiers (features/, shared/)
#   5. Cree le button.tsx manquant si necessaire
#   6. Prepare le build
# =============================================================================
# Usage: .\scalpedex-complete-migration.ps1 -ProjectPath "C:\Users\404_n\Desktop\DEV\scalpedex"
# =============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectPath
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Couleurs pour le output
function Write-Step { param($msg) Write-Host "`n[STEP] $msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Info { param($msg) Write-Host "     $msg" -ForegroundColor Gray }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

Write-Host @"
================================================================
     ScalpeDex - COMPLETE MIGRATION SCRIPT (FIXED)
     Feature-Sliced Design -> Clean & Flat Architecture
================================================================
"@ -ForegroundColor Magenta

# =============================================================================
# ETAPE 0: Resoudre l'imbrication scalpedex/scalpedex
# =============================================================================
Write-Step "Resolution de l'imbrication des dossiers..."

$nestedPath = Join-Path $ProjectPath "scalpedex"
$hasNesting = $false

# Detecter si on a une imbrication
if (Test-Path $nestedPath) {
    $nestedSrc = Join-Path $nestedPath "src"
    $nestedPackage = Join-Path $nestedPath "package.json"
    
    if ((Test-Path $nestedSrc) -or (Test-Path $nestedPackage)) {
        $hasNesting = $true
        Write-Warn "Imbrication detectee: $nestedPath contient le vrai projet"
        
        # Le vrai projet est dans scalpedex/scalpedex, on travaille dedans
        $ProjectPath = $nestedPath
        Write-Info "Chemin de travail ajuste: $ProjectPath"
    }
}

# Verifier que src/ existe
$srcPath = Join-Path $ProjectPath "src"
if (-not (Test-Path $srcPath)) {
    Write-Err "Dossier src/ introuvable dans $ProjectPath"
    Write-Err "Structure attendue: $ProjectPath\src\"
    exit 1
}

Write-Success "Dossier source trouve: $srcPath"

# Creer un backup
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = Join-Path $ProjectPath "backup_$timestamp"
Write-Step "Creation du backup..."
Copy-Item -Path $srcPath -Destination $backupPath -Recurse -Force
Write-Success "Backup cree: $backupPath"

# =============================================================================
# ETAPE 1: Creer la nouvelle structure de dossiers
# =============================================================================
Write-Step "Creation de la nouvelle structure de dossiers..."

$newDirs = @(
    "components/ui",
    "components/domain/auth",
    "components/domain/collection",
    "components/domain/market",
    "components/domain/news",
    "components/domain/profile",
    "components/domain/scanner",
    "components/layout",
    "components/providers",
    "hooks",
    "lib/supabase",
    "lib/utils",
    "lib/validators",
    "lib/context",
    "types",
    "app/actions"
)

foreach ($dir in $newDirs) {
    $fullPath = Join-Path $srcPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Info "Cree: $dir"
    }
}
Write-Success "Structure de dossiers creee"

# =============================================================================
# ETAPE 2: Migration des composants UI (shared/components/ui -> components/ui)
# =============================================================================
Write-Step "Migration des composants UI..."

$uiSource = Join-Path $srcPath "shared/components/ui"
$uiDest = Join-Path $srcPath "components/ui"

if (Test-Path $uiSource) {
    Get-ChildItem -Path $uiSource -File -Recurse | ForEach-Object {
        Copy-Item $_.FullName -Destination $uiDest -Force
        Write-Info "Migre: $($_.Name) -> components/ui/"
    }
}
Write-Success "Composants UI migres"

# =============================================================================
# ETAPE 3: Migration des composants Layout
# =============================================================================
Write-Step "Migration des composants Layout..."

$layoutSource = Join-Path $srcPath "shared/components/layout"
$layoutDest = Join-Path $srcPath "components/layout"

if (Test-Path $layoutSource) {
    Get-ChildItem -Path $layoutSource -File | ForEach-Object {
        Copy-Item $_.FullName -Destination $layoutDest -Force
        Write-Info "Migre: $($_.Name) -> components/layout/"
    }
}
Write-Success "Composants Layout migres"

# =============================================================================
# ETAPE 4: Migration AuthProvider
# =============================================================================
Write-Step "Migration AuthProvider..."

$authProviderSource = Join-Path $srcPath "shared/components/auth/AuthProvider.tsx"
$providersDest = Join-Path $srcPath "components/providers"

if (Test-Path $authProviderSource) {
    Copy-Item $authProviderSource -Destination $providersDest -Force
    Write-Info "Migre: AuthProvider.tsx"
}
Write-Success "AuthProvider migre"

# =============================================================================
# ETAPE 5: Migration des composants de features -> components/domain
# =============================================================================
Write-Step "Migration des composants de features..."

$features = @("auth", "collection", "market", "news", "profile", "scanner")

foreach ($feature in $features) {
    $featureCompSource = Join-Path $srcPath "features/$feature/components"
    $featureCompDest = Join-Path $srcPath "components/domain/$feature"
    
    if (Test-Path $featureCompSource) {
        Get-ChildItem -Path $featureCompSource -File | ForEach-Object {
            Copy-Item $_.FullName -Destination $featureCompDest -Force
            Write-Info "Migre: $($_.Name) -> components/domain/$feature/"
        }
    }
}
Write-Success "Composants domain migres"

# =============================================================================
# ETAPE 6: Migration des hooks
# =============================================================================
Write-Step "Migration des hooks..."

$hooksDest = Join-Path $srcPath "hooks"

# Hooks de shared
$sharedHooks = Join-Path $srcPath "shared/hooks"
if (Test-Path $sharedHooks) {
    Get-ChildItem -Path $sharedHooks -File | ForEach-Object {
        Copy-Item $_.FullName -Destination $hooksDest -Force
        Write-Info "Migre: $($_.Name) (shared)"
    }
}

# Hooks de chaque feature
foreach ($feature in $features) {
    $featureHooks = Join-Path $srcPath "features/$feature/hooks"
    if (Test-Path $featureHooks) {
        Get-ChildItem -Path $featureHooks -File | ForEach-Object {
            Copy-Item $_.FullName -Destination $hooksDest -Force
            Write-Info "Migre: $($_.Name) ($feature)"
        }
    }
}
Write-Success "Hooks migres"

# =============================================================================
# ETAPE 7: Migration des types
# =============================================================================
Write-Step "Migration des types..."

$typesDest = Join-Path $srcPath "types"

# Types de shared
$sharedTypes = Join-Path $srcPath "shared/types"
if (Test-Path $sharedTypes) {
    Get-ChildItem -Path $sharedTypes -File | ForEach-Object {
        Copy-Item $_.FullName -Destination $typesDest -Force
        Write-Info "Migre: $($_.Name) (shared)"
    }
}

# Types de chaque feature
foreach ($feature in $features) {
    $featureTypes = Join-Path $srcPath "features/$feature/types"
    if (Test-Path $featureTypes) {
        Get-ChildItem -Path $featureTypes -File | ForEach-Object {
            # Renommer en convention .types.ts
            $baseName = $_.BaseName -replace '-types$', '' -replace 'Types$', ''
            $destName = "$feature.types.ts"
            Copy-Item $_.FullName -Destination (Join-Path $typesDest $destName) -Force
            Write-Info "Migre: $($_.Name) -> $destName"
        }
    }
}
Write-Success "Types migres"

# =============================================================================
# ETAPE 8: Migration des utils
# =============================================================================
Write-Step "Migration des utils..."

$utilsDest = Join-Path $srcPath "lib/utils"

# Utils de shared
$sharedUtils = Join-Path $srcPath "shared/utils"
if (Test-Path $sharedUtils) {
    Get-ChildItem -Path $sharedUtils -File | ForEach-Object {
        Copy-Item $_.FullName -Destination $utilsDest -Force
        Write-Info "Migre: $($_.Name)"
    }
}

# Utils de chaque feature
foreach ($feature in $features) {
    $featureUtils = Join-Path $srcPath "features/$feature/utils"
    if (Test-Path $featureUtils) {
        Get-ChildItem -Path $featureUtils -File | ForEach-Object {
            Copy-Item $_.FullName -Destination $utilsDest -Force
            Write-Info "Migre: $($_.Name) ($feature)"
        }
    }
}
Write-Success "Utils migres"

# =============================================================================
# ETAPE 9: Migration des Server Actions -> app/actions
# =============================================================================
Write-Step "Migration des Server Actions..."

$actionsDest = Join-Path $srcPath "app/actions"

foreach ($feature in $features) {
    $featureActions = Join-Path $srcPath "features/$feature/server-actions"
    if (Test-Path $featureActions) {
        Get-ChildItem -Path $featureActions -File | ForEach-Object {
            Copy-Item $_.FullName -Destination $actionsDest -Force
            Write-Info "Migre: $($_.Name)"
        }
    }
}
Write-Success "Server Actions migres"

# =============================================================================
# ETAPE 10: Migration Supabase
# =============================================================================
Write-Step "Migration config Supabase..."

$supabaseDest = Join-Path $srcPath "lib/supabase"

# Client
$clientSource = Join-Path $srcPath "shared/client/supabase.ts"
if (Test-Path $clientSource) {
    Copy-Item $clientSource -Destination (Join-Path $supabaseDest "client.ts") -Force
    Write-Info "Migre: supabase client"
}

# Server
$serverSource = Join-Path $srcPath "shared/server/supabase.ts"
if (Test-Path $serverSource) {
    Copy-Item $serverSource -Destination (Join-Path $supabaseDest "server.ts") -Force
    Write-Info "Migre: supabase server"
}
Write-Success "Supabase config migree"

# =============================================================================
# ETAPE 11: Migration Context
# =============================================================================
Write-Step "Migration Context..."

$contextSource = Join-Path $srcPath "shared/context"
$contextDest = Join-Path $srcPath "lib/context"

if (Test-Path $contextSource) {
    Get-ChildItem -Path $contextSource -File | ForEach-Object {
        Copy-Item $_.FullName -Destination $contextDest -Force
        Write-Info "Migre: $($_.Name)"
    }
}
Write-Success "Context migre"

# =============================================================================
# ETAPE 12: MISE A JOUR DE TOUS LES IMPORTS (CRITIQUE!)
# =============================================================================
Write-Step "Mise a jour de TOUS les imports..."

$filesUpdated = 0

Get-ChildItem -Path $srcPath -Recurse -Include "*.ts", "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = [System.IO.File]::ReadAllText($filePath)
    
    if ([string]::IsNullOrEmpty($content)) { return }
    
    $originalContent = $content
    
    # Features -> Nouveaux chemins (components)
    $content = $content -replace "from '@/features/auth/components/", "from '@/components/domain/auth/"
    $content = $content -replace "from '@/features/collection/components/", "from '@/components/domain/collection/"
    $content = $content -replace "from '@/features/market/components/", "from '@/components/domain/market/"
    $content = $content -replace "from '@/features/news/components/", "from '@/components/domain/news/"
    $content = $content -replace "from '@/features/profile/components/", "from '@/components/domain/profile/"
    $content = $content -replace "from '@/features/scanner/components/", "from '@/components/domain/scanner/"
    
    # Hooks
    $content = $content -replace "from '@/features/auth/hooks/", "from '@/hooks/"
    $content = $content -replace "from '@/features/collection/hooks/", "from '@/hooks/"
    $content = $content -replace "from '@/features/market/hooks/", "from '@/hooks/"
    $content = $content -replace "from '@/features/news/hooks/", "from '@/hooks/"
    $content = $content -replace "from '@/features/profile/hooks/", "from '@/hooks/"
    $content = $content -replace "from '@/features/scanner/hooks/", "from '@/hooks/"
    $content = $content -replace "from '@/shared/hooks/", "from '@/hooks/"
    
    # Types
    $content = $content -replace "from '@/features/auth/types/", "from '@/types/"
    $content = $content -replace "from '@/features/collection/types/", "from '@/types/"
    $content = $content -replace "from '@/features/market/types/", "from '@/types/"
    $content = $content -replace "from '@/features/news/types/", "from '@/types/"
    $content = $content -replace "from '@/features/profile/types/", "from '@/types/"
    $content = $content -replace "from '@/features/scanner/types/", "from '@/types/"
    $content = $content -replace "from '@/shared/types/", "from '@/types/"
    
    # Server Actions
    $content = $content -replace "from '@/features/auth/server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '@/features/collection/server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '@/features/market/server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '@/features/news/server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '@/features/profile/server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '@/features/scanner/server-actions/", "from '@/app/actions/"
    
    # Utils
    $content = $content -replace "from '@/features/auth/utils/", "from '@/lib/utils/"
    $content = $content -replace "from '@/features/collection/utils/", "from '@/lib/utils/"
    $content = $content -replace "from '@/features/market/utils/", "from '@/lib/utils/"
    $content = $content -replace "from '@/features/news/utils/", "from '@/lib/utils/"
    $content = $content -replace "from '@/features/profile/utils/", "from '@/lib/utils/"
    $content = $content -replace "from '@/features/scanner/utils/", "from '@/lib/utils/"
    $content = $content -replace "from '@/shared/utils/", "from '@/lib/utils/"
    
    # Shared Components
    $content = $content -replace "from '@/shared/components/ui/", "from '@/components/ui/"
    $content = $content -replace "from '@/shared/components/layout/", "from '@/components/layout/"
    $content = $content -replace "from '@/shared/components/auth/", "from '@/components/providers/"
    
    # Supabase
    $content = $content -replace "from '@/shared/client/supabase'", "from '@/lib/supabase/client'"
    $content = $content -replace "from '@/shared/server/supabase'", "from '@/lib/supabase/server'"
    
    # Context
    $content = $content -replace "from '@/shared/context/", "from '@/lib/context/"
    
    # Imports relatifs (../hooks, ./hooks, etc.) - CRITIQUE!
    $content = $content -replace "from '\.\./hooks/", "from '@/hooks/"
    $content = $content -replace "from '\./hooks/", "from '@/hooks/"
    $content = $content -replace "from '\.\./types/", "from '@/types/"
    $content = $content -replace "from '\./types/", "from '@/types/"
    $content = $content -replace "from '\.\./server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '\./server-actions/", "from '@/app/actions/"
    $content = $content -replace "from '\.\./utils/", "from '@/lib/utils/"
    $content = $content -replace "from '\./utils/", "from '@/lib/utils/"
    
    # Correction noms de fichiers types (avec quotes simples et doubles)
    $content = $content -replace "collection-types", "collection.types"
    $content = $content -replace "auth-types", "auth.types"
    $content = $content -replace "market-types", "market.types"
    $content = $content -replace "news-types", "news.types"
    $content = $content -replace "profile-types", "profile.types"
    $content = $content -replace "scanner-types", "scanner.types"
    
    if ($content -ne $originalContent) {
        [System.IO.File]::WriteAllText($filePath, $content)
        Write-Info "MAJ: $($_.Name)"
        $script:filesUpdated++
    }
}

Write-Success "$filesUpdated fichiers mis a jour"

# =============================================================================
# ETAPE 13: Creer le button.tsx s'il n'existe pas
# =============================================================================
Write-Step "Verification du composant Button..."

$buttonPath = Join-Path $srcPath "components/ui/button.tsx"
$ButtonExists = Test-Path $buttonPath

# Verifier aussi Button.tsx (majuscule)
$ButtonPathUpper = Join-Path $srcPath "components/ui/Button.tsx"
if (Test-Path $ButtonPathUpper) {
    $ButtonExists = $true
}

if (-not $ButtonExists) {
    Write-Warn "button.tsx manquant, creation..."
    
    $buttonContent = @'
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-violet-600 hover:bg-violet-700 text-white',
      outline: 'border border-violet-600 text-violet-400 hover:bg-violet-600/10',
      ghost: 'text-violet-400 hover:bg-violet-600/10',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin mr-2">...</span>
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
'@
    
    [System.IO.File]::WriteAllText($buttonPath, $buttonContent)
    Write-Success "button.tsx cree"
} else {
    Write-Success "Button.tsx existe deja"
}

# =============================================================================
# ETAPE 14: Verifier/Creer le cn() dans lib/utils.ts
# =============================================================================
Write-Step "Verification de lib/utils.ts..."

$cnPath = Join-Path $srcPath "lib/utils.ts"

# Si lib/utils.ts n'existe pas, le creer
if (-not (Test-Path $cnPath)) {
    $cnContent = @'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
'@
    [System.IO.File]::WriteAllText($cnPath, $cnContent)
    Write-Info "Cree: lib/utils.ts avec cn()"
}
Write-Success "lib/utils.ts verifie"

# =============================================================================
# ETAPE 15: Supprimer les anciens dossiers
# =============================================================================
Write-Step "Suppression des anciens dossiers..."

$oldDirs = @(
    (Join-Path $srcPath "features"),
    (Join-Path $srcPath "shared")
)

foreach ($dir in $oldDirs) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force
        Write-Info "Supprime: $dir"
    }
}
Write-Success "Anciens dossiers supprimes"

# =============================================================================
# ETAPE 16: Nettoyer .next cache
# =============================================================================
Write-Step "Nettoyage du cache Next.js..."

$nextCache = Join-Path $ProjectPath ".next"
if (Test-Path $nextCache) {
    Remove-Item -Path $nextCache -Recurse -Force
    Write-Info "Cache .next supprime"
}
Write-Success "Cache nettoye"

# =============================================================================
# RESUME FINAL
# =============================================================================
Write-Host @"

================================================================
           MIGRATION COMPLETE!
================================================================
"@ -ForegroundColor Green

Write-Host @"

Dossier de travail: $ProjectPath
Backup cree: $backupPath

Structure finale:
  src/
    app/          <- Pages + API Routes + Server Actions
    components/
      ui/         <- Composants UI reutilisables
      domain/     <- Composants metier (auth, collection, etc.)
      layout/     <- Layout components
      providers/  <- AuthProvider, etc.
    hooks/        <- Tous les hooks
    lib/          <- Utils, Supabase, validators
    types/        <- Tous les types TypeScript

PROCHAINES ETAPES:
  1. cd $ProjectPath
  2. npm install (si necessaire)
  3. npm run build

Si le build echoue, verifiez les imports manquants
et consultez le backup: $backupPath

"@ -ForegroundColor Cyan

# Proposer de lancer le build
$runBuild = Read-Host "Voulez-vous lancer 'npm run build' maintenant? (o/n)"
if ($runBuild -eq "o" -or $runBuild -eq "O" -or $runBuild -eq "oui") {
    Set-Location $ProjectPath
    Write-Host "`nLancement du build..." -ForegroundColor Yellow
    npm run build
}