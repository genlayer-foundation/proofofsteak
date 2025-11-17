import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { gauchoCategory } from '@/lib/category-data'

export default function GauchoPage() {
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...gauchoCategory.hero} />
      <CategoryGrid submissions={gauchoCategory.submissions} theme={gauchoCategory.theme} cta={gauchoCategory.cta} />
      {gauchoCategory.nextCategory && <CategoryLink nextCategory={gauchoCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={gauchoCategory.theme} />
    </main>
  )
}
