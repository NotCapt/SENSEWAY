import { NextRequest, NextResponse } from "next/server"

// const ONDEMAND_API_KEY = "j5Io65KDWI3sImmez9Zd1bokfJTPMW5W"
const ONDEMAND_API_KEY = "Ez1LGbUF0gjlV1g7J9GgGmzs3te6dbUM"
const ONDEMAND_API_BASE = "https://api.on-demand.io/v1"

/**
 * POST /api/workflows/trigger
 * Server-side API route to trigger OnDemand AI workflows
 * This avoids CORS issues by making the request from the server
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { workflow_id, input } = body

    if (!workflow_id) {
      return NextResponse.json(
        { error: "workflow_id is required" },
        { status: 400 }
      )
    }

    // Make the request to OnDemand API from server-side (no CORS issues)
    const response = await fetch(`${ONDEMAND_API_BASE}/workflows/run`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ONDEMAND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflow_id,
        input: input || {},
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OnDemand API error:", response.status, errorText)
      
      return NextResponse.json(
        { 
          error: `Failed to trigger workflow: ${response.status} ${response.statusText}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in workflow trigger API route:", error)
    return NextResponse.json(
      { 
        error: "Failed to trigger workflow",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
