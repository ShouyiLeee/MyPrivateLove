export const dynamic = 'force-dynamic'

import Navbar from '@/components/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      <main className="pb-20 max-w-lg mx-auto">
        {children}
      </main>
      <Navbar />
    </div>
  )
}
