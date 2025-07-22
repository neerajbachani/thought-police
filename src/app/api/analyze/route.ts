import { NextRequest, NextResponse } from 'next/server'
import { redditApi } from '@/lib/services/redditApi'
import { multiModelPipeline } from '@/lib/services/multiModelPipeline'

export async function POST(request: NextRequest) {
  try {
    const { username, verbose = false } = await request.json()
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    console.log(`Starting analysis for user: ${username}`)
    
    // Set verbose mode
    if (verbose) {
      redditApi.setVerbose(true)
      multiModelPipeline.setVerbose(true)
    }

    // Fetch user data server-side
    const userData = await redditApi.getFullUserData(username, {
      maxItems: 5000,
      maxAge: 365,
      verbose
    })

    if (!userData.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log(`User data fetched: ${userData.comments.length} comments, ${userData.posts.length} posts`)

    // Analyze using pipeline server-side
    const analysis = await multiModelPipeline.analyzeUser(
      userData.comments,
      userData.posts,
      username
    )

    console.log(`Analysis complete for ${username}`)
    return NextResponse.json(analysis)

  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    )
  }
}