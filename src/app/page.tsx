export default function HomePage() {
  // We use a standard <a> tag because this is a simple navigation
  // to an external URL (our backend on a different port).
  const backendLoginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>Welcome to Inboxpense</h1>
        <p className='text-lg text-gray-600 mb-8'>
          The simplest way to track expenses from your SMS backups.
        </p>
        <div>
          <a
            href={backendLoginUrl}
            className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors'>
            Sign in with Google
          </a>
        </div>
      </div>
    </main>
  );
}
