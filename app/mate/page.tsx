'use client'

import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { mateCategory } from '@/lib/category-data'
import { useCategoryData } from '@/lib/hooks/use-category-data'

export default function MatePage() {
  const { records, hasMore, isLoading, loadMore } = useCategoryData('mate')

  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...mateCategory.hero} />
      <CategoryGrid
        submissions={records}
        theme={mateCategory.theme}
        cta={mateCategory.cta}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      {mateCategory.nextCategory && <CategoryLink nextCategory={mateCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={mateCategory.theme} />
    </main>
  )
}
