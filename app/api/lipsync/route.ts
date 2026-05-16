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
      const response = await fetch(`${MAGNIFIC_API_URL}/${taskId}`, {
        method: 'GET',
        headers: {
          'x-magnific-api-key': apiKey,
        },
      })

      const data = await response.json()

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

    const response = await fetch(MAGNIFIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-magnific-api-key': apiKey,
      },
      body: JSON.stringify({
        image_url: imageUrl,
        audio_url: audioUrl,
        prompt: prompt || 'A person speaking naturally with subtle head movements',
        resolution: resolution || '1080p',
        turbo_mode: turboMode || false,
      }),
    })

    const data = await response.json()

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
