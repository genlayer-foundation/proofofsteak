'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAnalysisByCategory } from '../genlayer/genlayer.js'

export function useCategoryData(category, pageSize = 10) {
  const [records, setRecords] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const loadData = useCallback(async (isLoadMore = false) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const currentStartIndex = isLoadMore ? startIndex : 0
      const result = await getAnalysisByCategory(category, currentStartIndex, pageSize)


      if (isLoadMore) {
        setRecords(prev => [...prev, ...(result.records || [])])
      } else {
        setRecords(result.records || [])
      }

      setStartIndex(currentStartIndex + (result.returned_count || 0))
      setHasMore(result.has_more || false)
      setTotalCount(result.total_count || 0)
    } catch (error) {
      console.error('Failed to load category data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [category, startIndex, pageSize, isLoading])

  const loadMore = useCallback(() => {
    loadData(true)
  }, [loadData])

  const refresh = useCallback(() => {
    setStartIndex(0)
    loadData(false)
  }, [loadData])

  useEffect(() => {
    refresh()
  }, [category])

  return {
    records,
    hasMore,
    isLoading,
    totalCount,
    loadMore,
    refresh
  }
}