import { NextRequest, NextResponse } from 'next/server'

const MAGNIFIC_API_URL = 'https://api.magnific.com/v1/ai/video/omni-human-1-5'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, audioUrl, prompt, resolution, turboMode, apiKey } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      )
    }

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

// Check task status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const apiKey = searchParams.get('apiKey')

    if (!taskId || !apiKey) {
      return NextResponse.json(
        { error: 'Task ID and API key are required' },
        { status: 400 }
      )
    }

    // Poll the same endpoint with the task_id to check status
    const response = await fetch(MAGNIFIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-magnific-api-key': apiKey,
      },
      body: JSON.stringify({
        task_id: taskId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to check task status' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Task status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
