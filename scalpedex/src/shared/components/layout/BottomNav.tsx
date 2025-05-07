// src/shared/components/layout/BottomNav.tsx
'use client'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full h-16 bg-violet-900 text-white flex items-center justify-around">
      <span>Scan</span>
      <span>Market</span>
      <span>Profil</span>
    </nav>
  )
}
