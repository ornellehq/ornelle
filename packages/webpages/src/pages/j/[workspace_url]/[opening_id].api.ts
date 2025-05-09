import type { APIRoute } from "astro"

export const prerender = false
export const POST: APIRoute = async ({ cookies, request, params }) => {
  const { opening_id } = params as { opening_id: string }
  const data = await request.json()
  const { email } = data
  const application = cookies.get("application")?.json()

  cookies.set(
    "application",
    { ...(application ?? {}), [opening_id]: { email } },
    {
      maxAge: 14 * 24 * 60 * 60, // 14 days in seconds
      path: "/",
      secure: false,
      sameSite: "lax",
      httpOnly: true,
    },
  )

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      // c,
    },
  })
}

/**
 * {openingId: {email}}
 */

// export function getStaticPaths() {
//   return []
// }
