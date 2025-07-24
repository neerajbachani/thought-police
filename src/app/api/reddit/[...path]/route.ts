// app/api/reddit/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const searchParams = request.nextUrl.searchParams
  
  try {
    let apiUrl: string
    
    // ✅ Better path handling
    if (path.includes('pushshift')) {
      const author = searchParams.get('author')
      const size = searchParams.get('size') || '100'
      const before = searchParams.get('before')
      
      apiUrl = `https://www.reddit.com/user/${author}/comments.json?limit=${size}&sort=new`
      if (before) {
        apiUrl += `&before=${before}`
      }
    } else {
      // ✅ Handle .json extension properly
      const pathString = path.join('/').replace(/\.json$/, '.json')
      const queryString = searchParams.toString()
      apiUrl = `https://www.reddit.com/${pathString}${queryString ? '?' + queryString : ''}`
    }
    
    console.log('Making request to Reddit:', apiUrl) // ✅ Debug log
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
        // ✅ Add Accept header
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} ${response.statusText}`)
      
      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      } else if (response.status === 403) {
        return NextResponse.json({ error: 'Access forbidden' }, { status: 403 })
      } else if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
      }
      
      throw new Error(`Reddit API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Reddit API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Reddit' },
      { status: 500 }
    )
  }
}