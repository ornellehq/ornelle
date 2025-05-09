import type { APIRoute } from "astro"
import { createHmacSignatureFromFormData } from "../../../util"

export const prerender = false

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { workspace_url } = params as { workspace_url: string }

    // Get form data from the request
    const formData = await request.formData()

    // Generate timestamp for HMAC
    const timestamp = Date.now()

    // Generate the HMAC signature
    const signature = await createHmacSignatureFromFormData(timestamp)

    // Forward the request to the main API with HMAC authorization
    const response = await fetch(
      `${import.meta.env.Mothership}/workspaces/${workspace_url}/applications`,
      {
        method: "POST",
        headers: {
          "X-Timestamp": timestamp.toString(),
          "X-Signature": signature,
          "X-Source": "career-page",
        },
        body: formData,
      },
    )

    // Get the response data
    const responseData = await response.json()

    // Return the response with the same status
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Application submission error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to submit application",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
