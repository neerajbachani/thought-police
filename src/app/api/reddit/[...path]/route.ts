// app/api/reddit/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// ✅ In-memory cache for the token to avoid fetching it on every request
let cachedToken: { token: string | null; expiresAt: number } = {
  token: null,
  expiresAt: 0,
}

async function getRedditToken(): Promise<string | null> {
  // If we have a valid, non-expired token, use it
  if (cachedToken.token && Date.now() < cachedToken.expiresAt) {
    console.log('Using cached Reddit token.')
    return cachedToken.token
  }

  console.log('Fetching new Reddit token...')
  try {
    const authString = Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
    ).toString('base64')

    const response = await fetch(
      'https://www.reddit.com/api/v1/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
          Authorization: `Basic ${authString}`,
        },
        body: 'grant_type=client_credentials',
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OAuth failed:', response.status, errorText)
      return null
    }

    const tokenData = await response.json()
    // Cache the token. expires_in is in seconds, so convert to ms and give a 1-min buffer.
    cachedToken = {
      token: tokenData.access_token,
      expiresAt: Date.now() + (tokenData.expires_in - 60) * 1000,
    }
    console.log('Successfully fetched and cached new token.')
    return cachedToken.token
  } catch (error) {
    console.error('Error fetching Reddit token:', error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params
  const searchParams = request.nextUrl.searchParams

  try {
    const redditToken = await getRedditToken()

    // ✅ CRITICAL FIX: Use the correct domain
    const apiDomain = redditToken
      ? 'https://oauth.reddit.com'
      : 'https://www.reddit.com'
    const pathString = path.join('/')
    const queryString = searchParams.toString()
    const apiUrl = `${apiDomain}/${pathString}${
      queryString ? '?' + queryString : ''
    }`

    console.log(`Making request to: ${apiUrl}`)

    const headers: Record<string, string> = {
      'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
      Accept: 'application/json',
    }

    if (redditToken) {
      headers['Authorization'] = `Bearer ${redditToken}`
    }

    const response = await fetch(apiUrl, { headers })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        `Reddit API error (${response.status}): ${response.statusText}`,
        errorText
      )
      return NextResponse.json(
        {
          error: `Reddit API error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Reddit API route error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch from Reddit',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}