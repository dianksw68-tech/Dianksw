import { NextRequest, NextResponse } from 'next/server'

const MAGNIFIC_API_URL = 'https://api.magnific.com/v1/ai/video/omni-human-1-5'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, audioUrl, prompt, resolution, turboMode, apiKey, taskId } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      )
    }

    // If taskId is provided, this is a status check request using GET
    if (taskId) {
      console.log('[v0] Checking task status for:', taskId)
      const statusUrl = `${MAGNIFIC_API_URL}/${taskId}`
      console.log('[v0] Status URL:', statusUrl)
      
      const response = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'x-magnific-api-key': apiKey,
        },
      })

      const data = await response.json()
      console.log('[v0] Status response:', response.status, JSON.stringify(data))

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to check task status' },
          { status: response.status }
        )
      }

      return NextResponse.json(data)
    }

    // Otherwise, create a new lip sync task
    if (!imageUrl || !audioUrl) {
      return NextResponse.json(
        { error: 'Image URL and Audio URL are required' },
        { status: 400 }
      )
    }

    console.log('[v0] Creating new lip sync task')
    console.log('[v0] Image URL:', imageUrl)
    console.log('[v0] Audio URL:', audioUrl)

    const requestBody = {
      image_url: imageUrl,
      audio_url: audioUrl,
      prompt: prompt || 'A person speaking naturally with subtle head movements',
      resolution: resolution || '1080p',
      turbo_mode: turboMode || false,
    }
    console.log('[v0] Request body:', JSON.stringify(requestBody))

    const response = await fetch(MAGNIFIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-magnific-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()
    console.log('[v0] Create task response:', response.status, JSON.stringify(data))

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create lip sync task' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Lip sync API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
