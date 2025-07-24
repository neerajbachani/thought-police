// app/api/reddit/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const searchParams = request.nextUrl.searchParams
  
  console.log('=== REDDIT API DEBUG ===')
  console.log('Path:', path)
  console.log('Search params:', searchParams.toString())
  console.log('Environment check:', {
    hasClientId: !!process.env.REDDIT_CLIENT_ID,
    hasClientSecret: !!process.env.REDDIT_CLIENT_SECRET,
    clientIdLength: process.env.REDDIT_CLIENT_ID?.length || 0
  })
  
  try {
    // ✅ Step 1: Get Reddit OAuth token
    let redditToken = null;
    
    try {
      console.log('Attempting Reddit OAuth...')
      
      const authString = Buffer.from(
        `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
      ).toString('base64')
      
      const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
          'Authorization': `Basic ${authString}`
        },
        body: 'grant_type=client_credentials'
      })
      
      console.log('Token response status:', tokenResponse.status)
      
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json()
        redditToken = tokenData.access_token
        console.log('OAuth token obtained successfully')
      } else {
        const errorText = await tokenResponse.text()
        console.error('OAuth failed:', tokenResponse.status, errorText)
      }
    } catch (authError) {
      console.error('OAuth error:', authError)
    }

    // ✅ Step 2: Make request to Reddit
    const pathString = path.join('/')
    const queryString = searchParams.toString()
    const apiUrl = `https://www.reddit.com/${pathString}${queryString ? '?' + queryString : ''}`
    
    console.log('Making request to:', apiUrl)
    
    const headers: Record<string, string> = {
      'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
      'Accept': 'application/json',
    }
    
    if (redditToken) {
      headers['Authorization'] = `Bearer ${redditToken}`
      console.log('Using OAuth token')
    } else {
      console.log('No OAuth token - making unauthenticated request')
    }
    
    const response = await fetch(apiUrl, { headers })
    
    console.log('Reddit response status:', response.status)
    console.log('Reddit response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Reddit API error: ${response.status} ${response.statusText}`)
      console.error('Error body:', errorText)
      
      if (response.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      } else if (response.status === 403) {
        return NextResponse.json({ 
          error: 'Access forbidden - Reddit API authentication failed',
          details: errorText
        }, { status: 403 })
      } else if (response.status === 429) {
        return NextResponse.json({ error: 'Rate limited' }, { status: 429 })
      }
      
      return NextResponse.json({ 
        error: `Reddit API error: ${response.status}`,
        details: errorText
      }, { status: response.status })
    }
    
    const data = await response.json()
    console.log('Reddit response successful, data keys:', Object.keys(data))
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Reddit API route error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch from Reddit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}