// app/api/reddit/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const searchParams = request.nextUrl.searchParams
  
  try {
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
        'Authorization': `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })

    let headers: Record<string, string> = {
      'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
      'Accept': 'application/json',
    }

    // Add OAuth token if available
    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json()
      headers['Authorization'] = `Bearer ${tokenData.access_token}`
    }

    const pathString = path.join('/').replace(/\.json$/, '.json')
    const queryString = searchParams.toString()
    const apiUrl = `https://www.reddit.com/${pathString}${queryString ? '?' + queryString : ''}`
    
    console.log('Making authenticated request to Reddit:', apiUrl)
    
    const response = await fetch(apiUrl, { headers })
    
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