import Link from 'next/link';

// A simple, inline SVG component for the Google 'G' logo
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox='0 0 24 24' {...props}>
    <path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill='#4285F4'
    />
    <path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill='#34A853'
    />
    <path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill='#EA4335'
    />
    <path d='M1 1h22v22H1z' fill='none' />
  </svg>
);

export default function HomePage() {
  const backendLoginUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

  return (
    <main className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#020617] via-[#111827] to-[#020617] p-4'>
      {/* Glassmorphic Card */}
      <div className='relative z-10 flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-white/10 bg-gray-500/10 p-8 text-center backdrop-blur-xl'>
        <h2 className='text-4xl sm:text-5xl font-bold text-white mb-4'>
          Welcome to inboXpense
        </h2>
        <p className='text-lg text-slate-300 mb-8 max-w-sm'>
          The simplest way to track expenses from your SMS backups.
        </p>
        <a
          href={backendLoginUrl}
          className='flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors w-full sm:w-auto'>
          <GoogleIcon className='h-5 w-5' />
          Sign in with Google
        </a>

        {/* --- ADDED THIS SECTION --- */}
        <div className='mt-8 flex justify-center gap-6 text-sm text-slate-400'>
          <Link
            href='/terms'
            className='hover:text-white hover:underline transition-colors'>
            Terms of Service
          </Link>
          <Link
            href='/privacy'
            className='hover:text-white hover:underline transition-colors'>
            Privacy Policy
          </Link>
        </div>
        {/* --- END SECTION --- */}
      </div>
    </main>
  );
}
