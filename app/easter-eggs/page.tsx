'use client'

import { CategoryHero } from '@/components/category-hero'
import { CategoryGrid } from '@/components/category-grid'
import { CategoryLink } from '@/components/category-link'
import { FloatingActions } from '@/components/floating-actions'
import { Footer } from '@/components/footer'
import { easterEggsCategory } from '@/lib/category-data'
import { useCategoryData } from '@/lib/hooks/use-category-data'

export default function EasterEggsPage() {
  const { records, hasMore, isLoading, loadMore } = useCategoryData('easter_eggs')

  return (
    <main className="min-h-screen bg-black">
      <CategoryHero {...easterEggsCategory.hero} />
      <CategoryGrid
        submissions={records}
        theme={easterEggsCategory.theme}
        cta={easterEggsCategory.cta}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
      />
      {easterEggsCategory.nextCategory && <CategoryLink nextCategory={easterEggsCategory.nextCategory} />}
      <Footer />
      <FloatingActions theme={easterEggsCategory.theme} />
    </main>
  )
}
