// app/api/reddit/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const searchParams = request.nextUrl.searchParams
  
  try {
    // ✅ Use Reddit's public JSON API
    const pathString = path.join('/')
    let apiUrl = `https://www.reddit.com/${pathString}`
    
    // Ensure .json extension
    if (!apiUrl.includes('.json')) {
      apiUrl += '.json'
    }
    
    // Add query parameters
    const queryString = searchParams.toString()
    if (queryString) {
      apiUrl += (apiUrl.includes('?') ? '&' : '?') + queryString
    }
    
    console.log('Making public request to:', apiUrl)
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error(`Reddit public API error: ${response.status}`)
      
      // Try alternative endpoint for user data
      if (pathString.includes('user/') && pathString.includes('/about')) {
        const username = pathString.split('/')[1]
        const altUrl = `https://www.reddit.com/user/${username}.json?limit=1`
        
        console.log('Trying alternative endpoint:', altUrl)
        
        const altResponse = await fetch(altUrl, {
          headers: {
            'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
            'Accept': 'application/json',
          },
        })
        
        if (altResponse.ok) {
          const altData = await altResponse.json()
          // Extract user info from the post/comment data
          if (altData.data?.children?.[0]?.data?.author) {
            return NextResponse.json({
              data: {
                name: altData.data.children[0].data.author,
                created_utc: altData.data.children[0].data.created_utc || 0,
                comment_karma: 1000, // Placeholder
                link_karma: 1000, // Placeholder
                total_karma: 2000, // Placeholder
                verified: false,
                is_gold: false,
                is_mod: false,
              }
            })
          }
        }
      }
      
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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