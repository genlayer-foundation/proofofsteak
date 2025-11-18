'use client'

import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { veggiesCategory } from '@/lib/category-data'
import { useCategoryData } from '@/lib/hooks/use-category-data'

export default function VeggiesPage() {
  const { records, hasMore, isLoading, loadMore } = useCategoryData('veggies')

  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...veggiesCategory.hero} />
      <CategoryGrid
        submissions={records}
        theme={veggiesCategory.theme}
        cta={veggiesCategory.cta}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      {veggiesCategory.nextCategory && <CategoryLink nextCategory={veggiesCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={veggiesCategory.theme} />
    </main>
  )
}
