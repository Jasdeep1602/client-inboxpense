import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - inboXpense',
};

export default function TermsOfServicePage() {
  return (
    <main className='bg-background text-foreground min-h-screen'>
      <div className='container mx-auto max-w-3xl py-12 px-4'>
        <h1 className='text-4xl font-bold mb-4'>
          Terms of Service for inboXpense
        </h1>
        <p className='text-muted-foreground'>Last Updated: August 23, 2025</p>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>1. Agreement to Terms</h2>
          <p>
            By using our application, inboXpense (the &quot;Service&quot;), you
            agree to be bound by these Terms of Service (&quot;Terms&quot;). If
            you disagree with any part of the terms, then you may not access the
            Service.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            2. Description of Service
          </h2>
          <p>
            inboXpense is a personal finance tool that allows users to connect
            their Google Drive account to sync and parse SMS backup files for
            the purpose of tracking financial transactions.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            3. User Responsibilities
          </h2>
          <ul className='list-disc ml-6 mt-2 space-y-2'>
            <li>
              You are responsible for safeguarding your Google Account and for
              any activities or actions under your account.
            </li>
            <li>
              You affirm that you have the necessary rights and permissions to
              the SMS backup files that you instruct our Service to access and
              process.
            </li>
            <li>
              You understand that the accuracy of the financial data extracted
              by the Service is dependent on the format and content of your SMS
              messages and is not guaranteed.
            </li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>4. Prohibited Use</h2>
          <p>
            You agree not to use the Service for any unlawful purpose or to
            violate any laws in your jurisdiction. You may not use the Service
            in any manner that could damage, disable, overburden, or impair the
            Service.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>5. Termination</h2>
          <p>
            We may terminate or suspend your access to our Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            6. Disclaimer of Warranties
          </h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS
            AVAILABLE&quot; basis. The Service is provided without warranties of
            any kind, whether express or implied, including, but not limited to,
            implied warranties of merchantability, fitness for a particular
            purpose, non-infringement, or course of performance.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            7. Limitation of Liability
          </h2>
          <p>
            In no event shall inboXpense, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from your access to or use of
            or inability to access or use the Service.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            8. Changes to These Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. We will provide notice of any changes by
            posting the new Terms on this page.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
            singhjasdeep1602@gmail.com
          </p>
        </section>
      </div>
    </main>
  );
}
