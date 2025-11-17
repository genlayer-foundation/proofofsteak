import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { steakCategory } from '@/lib/category-data'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...steakCategory.hero} />
      <CategoryGrid submissions={steakCategory.submissions} theme={steakCategory.theme} cta={steakCategory.cta} />
      {steakCategory.nextCategory && <CategoryLink nextCategory={steakCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={steakCategory.theme} />
    </main>
  )
}
