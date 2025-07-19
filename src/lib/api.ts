import { cookies } from 'next/headers';

// This function will be our reusable way to make authenticated API calls from Server Components.
export async function authenticatedFetch(
  path: string, // e.g., '/api/transactions'
  options: RequestInit = {} // e.g., { method: 'POST', body: ... }
): Promise<Response> {
  // 1. Get the JWT from the cookies
  const cookieStore = await cookies();
  const jwt = cookieStore.get('jwt')?.value;

  // 2. Construct the full API URL
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  // 3. Create the headers object
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (jwt) {
    // 4. Attach the cookie to the request headers
    // When fetching server-to-server, cookies aren't sent automatically, so we add them manually.
    headers.set('Cookie', `jwt=${jwt}`);
  }

  // 5. Make the fetch request
  return fetch(apiUrl, { ...options, headers });
}
