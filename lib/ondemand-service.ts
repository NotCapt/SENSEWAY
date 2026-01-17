"use client"

/**
 * Service for interacting with OnDemand AI Workflows
 * Uses Next.js API route to avoid CORS issues
 */

interface WorkflowRunRequest {
  workflow_id: string
  input?: Record<string, any>
}

/**
 * Triggers an OnDemand AI workflow execution via Next.js API route
 * This avoids CORS issues by making the request through our server
 * @param workflowId - The workflow ID to execute
 * @param input - Optional input parameters for the workflow
 * @returns Promise with the workflow execution response
 */
export async function triggerWorkflow(
  workflowId: string
): Promise<any> {
  try {
    // Use Next.js API route instead of direct API call to avoid CORS
    const url = `https://api.on-demand.io/automation/api/workflow/${workflowId}/execute`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey" : "Ez1LGbUF0gjlV1g7J9GgGmzs3te6dbUM"
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `Failed to trigger workflow: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data.data || data
  } catch (error) {
    console.error("Error triggering OnDemand workflow:", error)
    throw error
  }
}

/**
 * Triggers the SOS workflow to call emergency contacts
 * @param phoneNumbers - Array of phone numbers to call
 * @returns Promise with the workflow execution response
 */
export async function triggerSOSWorkflow(phoneNumbers: string[]): Promise<any> {
  const WORKFLOW_ID = "696ac7e0c28c63108ddb7ecc"
  
  return triggerWorkflow(WORKFLOW_ID)
}
