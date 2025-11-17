import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { easterEggsCategory } from '@/lib/category-data'

export default function EasterEggsPage() {
  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...easterEggsCategory.hero} />
      <CategoryGrid submissions={easterEggsCategory.submissions} theme={easterEggsCategory.theme} cta={easterEggsCategory.cta} />
      {easterEggsCategory.nextCategory && <CategoryLink nextCategory={easterEggsCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={easterEggsCategory.theme} />
    </main>
  )
}
