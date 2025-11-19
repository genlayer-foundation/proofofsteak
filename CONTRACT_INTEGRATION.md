# Contract Integration Guide

## Environment Setup
Add contract address to `.env`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## Contract Methods

### Write Methods

#### `analyze_image`
**Purpose**: Submit new image for analysis
**Used in**: Upload flow (`components/upload-dialog.tsx`)
**Parameters**:
```
id, originalUrl, leaderboardUrl, analysisUrl, defense, name, location
```
**Returns**: Transaction hash + receipt
**Flow**: User uploads → generate UUID → call method → redirect to waiting page

### Read Methods

#### `get_analysis_by_category`
**Purpose**: Fetch submissions by category (leaderboard)
**Used in**: Category pages (`lib/hooks/use-category-data.js`)
**Parameters**:
```
category: string, startIndex: number, count: number
```
**Expected Return**:
```javascript
{
  records: Array[{
    id, url, consensus_output, defense, caller_address, ...
  }],
  has_more: boolean,
  returned_count: number,
  start_index: number,
  total_count: number
}
```

#### `get_analysis_by_id`
**Purpose**: Fetch single submission by ID
**Used in**: Submission detail pages (`app/submission/[id]/page.tsx`)
**Parameters**:
```
category: string, id: string
```
**Expected Return**: Single record object (same structure as records array item)

#### `get_analyses_by_wallet`
**Purpose**: Fetch user's submissions
**Used in**: Profile page (`app/profile/page.tsx`)
**Parameters**:
```
userAddress: string, startIndex: number, count: number
```
**Expected Return**: Same structure as `get_analysis_by_category`

## Data Processing Notes

- **GenLayer Returns**: Map objects with BigInt values
- **Frontend Converts**: Maps → Objects, BigInt → Numbers (see `lib/genlayer/genlayer.js`)
- **consensus_output**: JSON string containing `{ category, score, reasoning, has_match }`
- **Pagination**: Uses `has_more` + `returned_count` for Load More functionality

## Testing Checklist

1. Verify contract methods exist with exact names
2. Check parameter order matches function calls
3. Test return data structure (especially pagination metadata)
4. Verify `consensus_output` JSON format
5. Test upload flow: UUID generation → contract call → waiting page polling
6. Test all read methods return expected data types (no Map/BigInt issues)