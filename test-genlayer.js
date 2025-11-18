// Test script for GenLayer communication
// Run with: node test-genlayer.js

import dotenv from 'dotenv'
import { getAnalysisByCategory } from './lib/genlayer.js'

dotenv.config()

async function testGenLayerCommunication() {
  try {
    console.log('Testing GenLayer communication...')

    const result = await getAnalysisByCategory('steak', 0, 5)
    console.log('✅ Success:', result.total_count, 'records')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testGenLayerCommunication()