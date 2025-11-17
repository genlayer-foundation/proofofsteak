import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { veggiesCategory } from '@/lib/category-data'

export default function VeggiesPage() {
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...veggiesCategory.hero} />
      <CategoryGrid submissions={veggiesCategory.submissions} theme={veggiesCategory.theme} cta={veggiesCategory.cta} />
      {veggiesCategory.nextCategory && <CategoryLink nextCategory={veggiesCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={veggiesCategory.theme} />
    </main>
  )
}
