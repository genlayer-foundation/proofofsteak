'use client'

import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { gauchoCategory } from '@/lib/category-data'
import { useCategoryData } from '@/lib/hooks/use-category-data'

export default function GauchoPage() {
  const { records, hasMore, isLoading, loadMore } = useCategoryData('gaucho')

  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...gauchoCategory.hero} />
      <CategoryGrid
        submissions={records}
        theme={gauchoCategory.theme}
        cta={gauchoCategory.cta}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      {gauchoCategory.nextCategory && <CategoryLink nextCategory={gauchoCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={gauchoCategory.theme} />
    </main>
  )
}
