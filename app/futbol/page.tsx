import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { futbolCategory } from '@/lib/category-data'

export default function FutbolPage() {
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...futbolCategory.hero} />
      <CategoryGrid submissions={futbolCategory.submissions} theme={futbolCategory.theme} cta={futbolCategory.cta} />
      {futbolCategory.nextCategory && <CategoryLink nextCategory={futbolCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={futbolCategory.theme} />
    </main>
  )
}
