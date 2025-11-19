'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAnalysesByWallet } from '../genlayer/genlayer.js'

export function useUserContributions(userAddress, pageSize = 10) {
  const [records, setRecords] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const loadData = useCallback(async (isLoadMore = false) => {
    if (isLoading || !userAddress) return

    setIsLoading(true)
    try {
      const currentStartIndex = isLoadMore ? startIndex : 0
      const result = await getAnalysesByWallet(userAddress, currentStartIndex, pageSize)


      if (isLoadMore) {
        setRecords(prev => [...prev, ...(result.records || [])])
      } else {
        setRecords(result.records || [])
      }

      setStartIndex(currentStartIndex + (result.returned_count || 0))
      setHasMore(result.has_more || false)
      setTotalCount(result.total_count || 0)
    } catch (error) {
      console.error('Failed to load user contributions:', error)
      // Reset on error
      setRecords([])
      setHasMore(false)
      setTotalCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [userAddress, startIndex, pageSize, isLoading])

  const loadMore = useCallback(() => {
    loadData(true)
  }, [loadData])

  const refresh = useCallback(() => {
    setStartIndex(0)
    loadData(false)
  }, [loadData])

  useEffect(() => {
    if (userAddress) {
      refresh()
    } else {
      // Clear data if no user address
      setRecords([])
      setHasMore(false)
      setTotalCount(0)
      setStartIndex(0)
    }
  }, [userAddress, refresh])

  return {
    records,
    hasMore,
    isLoading,
    totalCount,
    loadMore,
    refresh
  }
}