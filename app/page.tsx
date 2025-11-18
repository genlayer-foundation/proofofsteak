'use client'

import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { steakCategory } from '@/lib/category-data'
import { useCategoryData } from '@/lib/hooks/use-category-data'

export default function HomePage() {
  const { records, hasMore, isLoading, loadMore } = useCategoryData('steak')

  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...steakCategory.hero} />
      <CategoryGrid
        submissions={records}
        theme={steakCategory.theme}
        cta={steakCategory.cta}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      {steakCategory.nextCategory && <CategoryLink nextCategory={steakCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={steakCategory.theme} />
    </main>
  )
}
