'use client'

import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { futbolCategory } from '@/lib/category-data'
import { useCategoryData } from '@/lib/hooks/use-category-data'

export default function FutbolPage() {
  const { records, hasMore, isLoading, loadMore } = useCategoryData('futbol')

  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...futbolCategory.hero} />
      <CategoryGrid
        submissions={records}
        theme={futbolCategory.theme}
        cta={futbolCategory.cta}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      {futbolCategory.nextCategory && <CategoryLink nextCategory={futbolCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={futbolCategory.theme} />
    </main>
  )
}
