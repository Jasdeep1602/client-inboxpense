import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - inboXpense',
};

export default function PrivacyPolicyPage() {
  return (
    <main className='bg-background text-foreground min-h-screen'>
      <div className='container mx-auto max-w-3xl py-12 px-4'>
        <h1 className='text-4xl font-bold mb-4'>
          Privacy Policy for InboXpense
        </h1>
        <p className='text-muted-foreground'>Last Updated: August 23, 2025</p>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>1. Introduction</h2>
          <p>
            Welcome to InboXpense (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;). We are committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our application.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            2. Information We Collect
          </h2>
          <p>
            To provide our service, we collect the following types of
            information:
          </p>
          <ul className='list-disc ml-6 mt-2 space-y-2'>
            <li>
              <strong>Information from Google Account:</strong> When you sign in
              using Google, we receive your basic profile information, which
              includes your full name, email address, profile picture, and your
              unique Google ID. We store this information to identify you as a
              user.
            </li>
            <li>
              <strong>Google Refresh Token:</strong> We securely store a refresh
              token provided by Google. This token allows our application to
              request access to your Google Drive on your behalf without
              requiring you to log in every time.
            </li>
            <li>
              <strong>Information from Google Drive:</strong> Our application
              requests read-only permission
              (`https&#39;://www.googleapis.com/auth/drive.readonly`) to access
              your Google Drive files. Our use of this permission is strictly
              limited to the following actions:
              <ul className='list-circle ml-6 mt-2 space-y-1'>
                <li>
                  Searching for specific folders you have designated (e.g.,
                  &quot;Me&quot;, &quot;Mom&quot;, &quot;Dad&quot;).
                </li>
                <li>
                  Identifying and reading the content of XML files that match
                  the SMS backup format (e.g., &quot;sms-*.xml&quot;) within
                  those folders.
                </li>
              </ul>
            </li>
          </ul>
          <p className='mt-4 font-semibold'>
            We DO NOT have permission to, and will never, view other files, edit
            files, delete files, or access any other part of your Google Drive.
            Our access is strictly read-only and limited to the specific files
            needed for the app to function.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            3. How We Use Your Information
          </h2>
          <p>We use the information we collect solely to:</p>
          <ul className='list-disc ml-6 mt-2 space-y-2'>
            <li>Authenticate and manage your user account.</li>
            <li>
              Access, download, and parse your specified SMS backup files from
              your Google Drive.
            </li>
            <li>
              Extract financial transaction data from the SMS content and
              display it to you within the application.
            </li>
            <li>Provide you with analytics and summaries of your own data.</li>
            <li>
              Allow you to create custom categories and rules for your
              transactions.
            </li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            4. Data Sharing and Disclosure
          </h2>
          <p>
            We do not sell, trade, rent, or otherwise transfer your personal
            information or financial data to outside parties. Your data is for
            your eyes only.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>5. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety
            of your personal information. Your Google Refresh Token is stored
            securely, and all data transmission between your browser and our
            servers is encrypted.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            6. Your Rights and Choices
          </h2>
          <p>
            You have the right to revoke our access to your Google Account at
            any time by visiting your Google Account security settings page. If
            you revoke access, we will no longer be able to sync your data. You
            may also contact us to request the deletion of your account and all
            associated data.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>
            7. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className='mt-8'>
          <h2 className='text-2xl font-semibold mb-2'>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at: singhjasdeep1602@gmail.com
          </p>
        </section>
      </div>
    </main>
  );
}
