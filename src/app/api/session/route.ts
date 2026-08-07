import { cookies } from "next/headers";

/** Matches the API's own token and cookie, so the two expire together. */
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/**
 * Puts the session token in a cookie on *this* domain.
 *
 * The API sets a cookie of its own, but on the API's domain, and a request to this app
 * is never sent it — so `proxy.ts` looked for a token that could not be there and turned
 * away every visit to /dashboard, however well the login had gone. The token is already
 * in the browser by the time this is called; it comes back in the login response body.
 * Storing it here httpOnly keeps it out of reach of scripts, which is more than could be
 * said for it a moment earlier.
 *
 * A forged token gets no further than the gate: the API verifies the signature on every
 * request, so what it opens is a dashboard that cannot load a single row.
 */
export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token || typeof token !== "string") {
    return Response.json({ message: "token is required" }, { status: 400 });
  }

  (await cookies()).set({
    name: "token",
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: THIRTY_DAYS,
    path: "/",
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete("token");

  return Response.json({ ok: true });
}
