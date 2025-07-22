import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // Await the params since they're now wrapped in a Promise
  const { path } = await context.params
  const pathString = path.join('/')
  const searchParams = request.nextUrl.searchParams
  
  try {
    // Handle different Reddit endpoints
    let apiUrl: string
    
    if (pathString.includes('pushshift')) {
      // Handle Pushshift requests (though it's deprecated)
      const author = searchParams.get('author')
      const size = searchParams.get('size') || '100'
      const before = searchParams.get('before')
      
      // Use Reddit's official API instead of Pushshift
      apiUrl = `https://www.reddit.com/user/${author}/comments.json?limit=${size}&sort=new`
      if (before) {
        // Convert timestamp to Reddit's after parameter logic
        apiUrl += `&before=${before}`
      }
    } else {
      // Regular Reddit API
      apiUrl = `https://www.reddit.com/${pathString}?${searchParams.toString()}`
    }
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
      },
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
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