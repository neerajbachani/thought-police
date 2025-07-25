// app/api/reddit/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

async function getRedditToken() {
  try {
    const authString = Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
    ).toString('base64')
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',  // ✅ Added User-Agent
      },
      body: 'grant_type=client_credentials'
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('OAuth failed:', response.status, errorText)
      throw new Error(`OAuth failed: ${response.status} - ${errorText}`)
    }
    
    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Failed to get Reddit token:', error)
    throw error
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // ✅ Add CORS headers for local testing
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  headers.set('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers })
  }

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
    const redditToken = await getRedditToken()
    console.log('OAuth token obtained successfully')

    const pathString = path.join('/')
    const queryString = searchParams.toString()
    const apiUrl = `https://oauth.reddit.com/${pathString}${queryString ? '?' + queryString : ''}`
    
    console.log('Making authenticated request to:', apiUrl)
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',  // ✅ Required
        'Accept': 'application/json',
        'Authorization': `Bearer ${redditToken}`
      }
    })
    
    console.log('Reddit response status:', response.status)
    console.log('Reddit response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Reddit API error: ${response.status} ${response.statusText}`)
      console.error('Error body:', errorText)
      
      return NextResponse.json({ 
        error: `Reddit API error: ${response.status}`,
        details: errorText
      }, { status: response.status, headers })
    }
    
    const data = await response.json()
    console.log('Reddit response successful, data keys:', Object.keys(data))
    
    return NextResponse.json(data, { headers })
  } catch (error) {
    console.error('Reddit API route error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch from Reddit',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers }
    )
  }
}