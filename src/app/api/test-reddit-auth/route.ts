// app/api/test-reddit-auth/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Reddit credentials...')
    
    const authString = Buffer.from(
      `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
    ).toString('base64')
    
    const response = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ThoughtPolice/1.0.0 (by /u/Over-Economist-3309)',
        'Authorization': `Basic ${authString}`
      },
      body: 'grant_type=client_credentials'
    })
    
    const result = await response.json()
    
    return NextResponse.json({
      status: response.status,
      hasCredentials: {
        hasClientId: !!process.env.REDDIT_CLIENT_ID,
        hasClientSecret: !!process.env.REDDIT_CLIENT_SECRET,
        clientIdLength: process.env.REDDIT_CLIENT_ID?.length || 0
      },
      authResponse: result
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}