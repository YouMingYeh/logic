import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicy: NextPage = () => {
  return (
    <div className='min-h-screen bg-gray-100 px-6 py-12 lg:px-32'>
      <Head>
        <title>Privacy Policy - logic</title>
      </Head>
      <main className='rounded-lg bg-white p-8 shadow-md'>
        <Link href='/'>{'<'}Back to Home</Link>
        <h1 className='mb-6 text-3xl font-bold'>Privacy Policy for logic</h1>
        <p className='mb-4'>
          <strong>Effective Date:</strong> July 1, 2024
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>1. Introduction</h2>
        <p className='mb-6'>
          Welcome to logic. Your privacy is of utmost importance to us. This
          Privacy Policy explains how we collect, use, disclose, and safeguard
          your information when you visit our website and use our services. By
          using logic, you agree to the collection and use of information in
          accordance with this policy.
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>
          2. Information We Collect
        </h2>
        <p className='mb-4'>
          We collect the following information to provide and improve our
          services:
        </p>
        <ul className='mb-6 list-inside list-disc'>
          <li>
            <strong>Email Address:</strong> Collected to provide quick login
            services and to communicate with you regarding our services.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you access and
            use our services, including your IP address, browser type, and the
            pages you visit.
          </li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>
          3. How We Use Your Information
        </h2>
        <p className='mb-4'>We use the collected data for various purposes:</p>
        <ul className='mb-6 list-inside list-disc'>
          <li>
            <strong>Service Provision:</strong> To facilitate your login and
            provide access to our platform services.
          </li>
          <li>
            <strong>Communication:</strong> To send you updates, notifications,
            and other information related to our services.
          </li>
          <li>
            <strong>Improvement:</strong> To analyze usage patterns and improve
            our services.
          </li>
          <li>
            <strong>Legal Requirements:</strong> To comply with legal
            obligations and protect our rights.
          </li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>
          4. Data Storage and Security
        </h2>
        <p className='mb-4'>
          We implement industry-standard practices to ensure your data is
          securely stored and protected:
        </p>
        <ul className='mb-6 list-inside list-disc'>
          <li>
            <strong>Storage:</strong> Your data is stored securely on our
            servers with encryption and access control measures.
          </li>
          <li>
            <strong>Security:</strong> We employ robust security measures such
            as encryption, firewalls, and regular security audits to protect
            your data from unauthorized access, alteration, or disclosure.
          </li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>5. Data Sharing</h2>
        <p className='mb-4'>
          We respect your privacy and do not share your personal data with third
          parties, except in the following cases:
        </p>
        <ul className='mb-6 list-inside list-disc'>
          <li>With your explicit consent.</li>
          <li>To comply with legal obligations or protect our rights.</li>
        </ul>

        <h2 className='mb-4 text-2xl font-semibold'>6. Your Rights</h2>
        <p className='mb-4'>You have the right to:</p>
        <ul className='mb-6 list-inside list-disc'>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of any incorrect or incomplete data.</li>
          <li>Request deletion of your personal data.</li>
          <li>Object to or restrict the processing of your data.</li>
          <li>Request data portability.</li>
        </ul>
        <p className='mb-6'>
          To exercise these rights, please contact us at{' '}
          <a className='text-blue-500 underline' href='mailto:marx@logic.app'>
            marx@logic.app
          </a>{' '}
          or{' '}
          <a
            className='text-blue-500 underline'
            href='mailto:ym911216@gmail.com'
          >
            ym911216@gmail.com
          </a>
          .
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>7. Contact Us</h2>
        <p className='mb-6'>
          If you have any questions, concerns, or complaints about this Privacy
          Policy or our data practices, please contact us at:
        </p>
        <p className='mb-4'>
          Email:{' '}
          <a className='text-blue-500 underline' href='mailto:marx@logic.app'>
            marx@logic.app
          </a>
        </p>
        <p className='mb-6'>
          Email:{' '}
          <a
            className='text-blue-500 underline'
            href='mailto:ym911216@gmail.com'
          >
            ym911216@gmail.com
          </a>
        </p>

        <h2 className='mb-4 text-2xl font-semibold'>
          8. Changes to This Policy
        </h2>
        <p className='mb-4'>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page with
          an updated effective date. You are advised to review this Privacy
          Policy periodically for any changes.
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
