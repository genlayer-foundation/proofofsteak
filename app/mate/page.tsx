import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { mateCategory } from '@/lib/category-data'

export default function MatePage() {
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...mateCategory.hero} />
      <CategoryGrid submissions={mateCategory.submissions} theme={mateCategory.theme} cta={mateCategory.cta} />
      {mateCategory.nextCategory && <CategoryLink nextCategory={mateCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={mateCategory.theme} />
    </main>
  )
}
